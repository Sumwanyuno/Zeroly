import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";
import WishlistManager from "../components/WishlistManager";
import api from "../api.js";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, Package, Sprout, Leaf, TreePine, Crown, Coins, Wind, Car, Trees } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import EditItemModal from "../components/EditItemModal";

const API_BASE_URL = "http://localhost:5001/api"; 

const getTierInfo = (points) => {
  if (points >= 151) return { name: "Canopy", icon: <Crown className="w-5 h-5 text-yellow-500" aria-label="Canopy tier icon" role="img" />, color: "text-yellow-500", bg: "bg-yellow-500/10", next: null };
  if (points >= 51) return { name: "Bloom", icon: <TreePine className="w-5 h-5 text-emerald-500" aria-label="Bloom tier icon" role="img" />, color: "text-emerald-500", bg: "bg-emerald-500/10", next: 151 };
  if (points >= 21) return { name: "Sprout", icon: <Sprout className="w-5 h-5 text-green-500" aria-label="Sprout tier icon" role="img" />, color: "text-green-500", bg: "bg-green-500/10", next: 51 };
  return { name: "Seed", icon: <Leaf className="w-5 h-5 text-amber-600" aria-label="Seed tier icon" role="img" />, color: "text-amber-600", bg: "bg-amber-600/10", next: 21 };
};

// Animated counter that smoothly rolls up to a target value on mount
const AnimatedCounter = ({ target, decimals = 1, className = "" }) => {
  const nodeRef = useRef(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = value.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [target, decimals]);
  return <span ref={nodeRef} className={className}>0</span>;
};

// Static accent style maps — avoids dynamic class interpolation that Tailwind v4 cannot scan
const ACCENT_STYLES = {
  emerald: {
    wrapper:   "hover:border-emerald-500/40",
    blob:      "bg-emerald-500/10",
    iconWrap:  "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    unitText:  "text-emerald-500",
  },
  green: {
    wrapper:   "hover:border-green-500/40",
    blob:      "bg-green-500/10",
    iconWrap:  "bg-green-500/10 border-green-500/20 text-green-500",
    unitText:  "text-green-500",
  },
  teal: {
    wrapper:   "hover:border-teal-500/40",
    blob:      "bg-teal-500/10",
    iconWrap:  "bg-teal-500/10 border-teal-500/20 text-teal-500",
    unitText:  "text-teal-500",
  },
};

// Carbon Impact stat card
const CarbonStatCard = ({ icon, label, value, unit, decimals, accent, description, delay }) => {
  const s = ACCENT_STYLES[accent] ?? ACCENT_STYLES.emerald;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`relative flex flex-col gap-3 rounded-2xl p-5 border backdrop-blur-md overflow-hidden
        bg-card/60 border-border/40 ${s.wrapper} transition-colors duration-300 group`}
      role="region"
      aria-label={label}
    >
      {/* Subtle glow blob */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${s.blob} blur-2xl pointer-events-none transition-all duration-500 group-hover:w-32 group-hover:h-32`} />
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${s.iconWrap}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-extrabold text-foreground tracking-tight leading-none">
          <AnimatedCounter target={value} decimals={decimals} />
          <span className={`text-base font-semibold ml-1.5 ${s.unitText}`}>{unit}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
      </div>
    </motion.div>
  );
};

const ProfilePage = () => {
  const { userInfo, socket } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userInfo) {
        setLoading(false);
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
       
        const { data } = await api.get(`${API_BASE_URL}/users/profile`, config); 
        setUserProfile(data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Could not fetch user profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userInfo]);

  // Listen for real-time item status changes
  useEffect(() => {
    if (!socket || !userProfile) return;

    const handleItemStatusChange = (data) => {
      setUserProfile(prevProfile => {
        if (!prevProfile) return prevProfile;
        
        return {
          ...prevProfile,
          items: prevProfile.items.map(item => 
            item._id === data.itemId 
              ? { ...item, status: data.status, version: data.version }
              : item
          )
        };
      });
    };

    socket.on('item-status-changed', handleItemStatusChange);

    return () => {
      socket.off('item-status-changed', handleItemStatusChange);
    };
  }, [socket, userProfile]);

  const handleDelete = async (deletedItemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    if (!userInfo) {
      toast.error("You must be logged in to delete an item.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
     
      await axios.delete(`${API_BASE_URL}/items/${deletedItemId}`, config);
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        items: prevProfile.items.filter((item) => item._id !== deletedItemId),
      }));
      toast.success("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(
        error.response?.data?.message || "You are not authorized to delete this item."
      );
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedItem) => {
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      items: prevProfile.items.map((item) => 
        item._id === updatedItem._id ? { ...item, ...updatedItem } : item
      ),
    }));
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Could not load profile. Please log in.</p>
      </div>
    );
  }

  const currentUserTier = getTierInfo(userProfile.points || 0);
  const progressToNext = currentUserTier.next 
    ? ((userProfile.points || 0) / currentUserTier.next) * 100 
    : 100;

  return (
    <div className="bg-background min-h-screen font-sans transition-colors duration-300 relative z-0 pt-10 pb-20">
      <div className="fixed inset-0 -z-10 h-full w-full bg-grid-pattern pointer-events-none"></div>

      <div className="container mx-auto p-4 md:px-8 max-w-7xl">
        {/* Profile Details Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="bg-card/80 dark:bg-card/75 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
            
            <CardHeader className="pb-6 border-b border-border/40 relative z-10">
              <CardTitle className="text-3xl font-extrabold flex items-center gap-3 tracking-tight">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                  <User className="w-6 h-6" aria-hidden="true" />
                </div>
                Your Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col lg:flex-row justify-between items-start gap-8 relative z-10">
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <h1 className="text-3xl font-extrabold text-foreground mb-1">
                    {userProfile.name}
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-2 text-lg">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                    {userProfile.email}
                  </p>
                </div>

                {/* Embedded Progress Bar */}
                <div 
                  className="bg-background/85 backdrop-blur-md rounded-2xl p-5 border border-border/40 mt-6 max-w-xl shadow-sm group hover:border-primary/30 transition-colors duration-300"
                  tabIndex={0}
                  aria-label={`${currentUserTier.name} Tier status. Total points: ${userProfile.points || 0} EcoCoins.`}
                >
                  <div className="flex items-center gap-5 mb-5">
                    <div className={`p-4 rounded-2xl shadow-inner border border-white/5 ${currentUserTier.bg} ${currentUserTier.color}`}>
                      {currentUserTier.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-foreground text-xl flex items-center gap-2 tracking-tight">
                        <span className={currentUserTier.color}>{currentUserTier.name}</span> Tier
                      </h4>
                      <p className="text-sm font-semibold flex items-center gap-1.5 text-primary bg-primary/10 w-fit px-2.5 py-0.5 rounded-full mt-1 border border-primary/20">
                        <Coins className="w-4 h-4" aria-hidden="true" /> {userProfile.points || 0} EcoCoins
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-card/50 p-4 rounded-xl border border-border/30">
                    <div className="flex justify-between text-xs font-bold mb-3 uppercase tracking-wider">
                      <span className="text-muted-foreground">Progress to {currentUserTier.next ? "Next Tier" : "Max Tier"}</span>
                      <span className="text-primary">{currentUserTier.next ? `${userProfile.points || 0} / ${currentUserTier.next}` : "MAX"}</span>
                    </div>
                    <Progress 
                      value={progressToNext} 
                      className="h-2.5 bg-primary/10"
                      aria-valuenow={Math.round(progressToNext)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Progress to next tier"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 lg:self-center shrink-0 mt-6 lg:mt-0">
                <Button asChild size="lg" className="shadow-xl shadow-primary/20 h-14 px-8 text-base font-bold rounded-xl transition-transform hover:scale-105">
                  <Link to="/upload" className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    List New Item
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add Wishlist Manager Here */}
          <WishlistManager />
        </motion.div>

        {/* ── Carbon Impact Dashboard ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55, ease: "easeOut" }}
          className="mb-12"
          aria-labelledby="carbon-dashboard-title"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Wind className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="carbon-dashboard-title" className="text-2xl font-extrabold text-foreground tracking-tight">
                Carbon Impact Dashboard
              </h2>
              <p className="text-sm text-muted-foreground">Your real-world environmental contributions</p>
            </div>
          </div>

          {/* Glassmorphic container */}
          <div className="relative rounded-3xl border border-border/40 bg-card/50 backdrop-blur-xl p-6 shadow-lg overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-10 -left-10 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Stat grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              <CarbonStatCard
                icon={<Wind className="w-5 h-5" />}
                label="CO₂ Offset"
                value={userProfile.totalCarbonOffset || 0}
                unit="kg"
                decimals={1}
                accent="emerald"
                description="Total carbon dioxide saved through your donations"
                delay={0.12}
              />
              <CarbonStatCard
                icon={<Trees className="w-5 h-5" />}
                label="Trees Saved"
                value={((userProfile.totalCarbonOffset || 0) / 22).toFixed(1) * 1}
                unit="trees"
                decimals={1}
                accent="green"
                description="Equivalent annual CO₂ absorption of trees"
                delay={0.22}
              />
              <CarbonStatCard
                icon={<Car className="w-5 h-5" />}
                label="Car Miles Avoided"
                value={(userProfile.totalCarbonOffset || 0) * 2.5}
                unit="mi"
                decimals={1}
                accent="teal"
                description="Miles a standard car would have driven for this CO₂"
                delay={0.32}
              />
            </div>

            {/* Bottom note */}
            <p className="text-xs text-muted-foreground text-center mt-5 relative z-10">
              CO₂ values are category-based estimates. Equivalencies: 1 tree absorbs ~22 kg CO₂/yr · 1 kg CO₂ ≈ 2.5 car miles.
            </p>
          </div>
        </motion.div>

        {/* Listed Items Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              Your Listed Items
            </h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">
              {userProfile.items.length} {userProfile.items.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          {userProfile.items.length === 0 ? (
            <div className="text-center py-24 bg-card/30 backdrop-blur-sm rounded-3xl border border-border/40 border-dashed shadow-sm">
              <div className="mx-auto w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mb-6 shadow-inner border border-border/50">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-extrabold text-foreground mb-3 tracking-tight">No items listed yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                Start sharing with your community by listing items you no longer need.
              </p>
              <Button asChild size="lg" className="rounded-xl px-8 shadow-md">
                <Link to="/upload">List Your First Item</Link>
              </Button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              <AnimatePresence>
                {userProfile.items.map((item) => (
                  <ItemCard 
                    key={item._id} 
                    item={item} 
                    onDelete={handleDelete} 
                    onEdit={handleEdit}
                    userId={userInfo?._id} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Edit Item Modal */}
      <EditItemModal 
        isOpen={isEditModalOpen} 
        onClose={setIsEditModalOpen} 
        item={editingItem} 
        onEditSuccess={handleEditSuccess} 
      />
    </div>
  );
};

export default ProfilePage;
