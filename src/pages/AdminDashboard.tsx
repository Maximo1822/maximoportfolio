import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Pencil, Trash2, Youtube, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePortfolio, PortfolioItem, getYouTubeThumbnail } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    profile,
    videos,
    designs,
    updateProfile,
    addVideo,
    updateVideo,
    deleteVideo,
    addDesign,
    updateDesign,
    deleteDesign,
  } = usePortfolio();

  const [editingProfile, setEditingProfile] = useState(profile);
  const [newVideoItem, setNewVideoItem] = useState({ title: '', thumbnail: '', youtubeUrl: '' });
  const [newDesignItem, setNewDesignItem] = useState({ title: '', thumbnail: '', imageUrl: '' });
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isAddVideoDialogOpen, setIsAddVideoDialogOpen] = useState(false);
  const [isAddDesignDialogOpen, setIsAddDesignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('profile');

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    setEditingProfile(profile);
  }, [profile]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    toast({
      title: 'Logged out',
      description: 'You have been logged out of the admin panel.',
    });
    navigate('/admin');
  };

  const handleSaveProfile = () => {
    updateProfile(editingProfile);
    toast({
      title: 'Profile updated',
      description: 'Your profile has been saved successfully.',
    });
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddVideo = () => {
    if (!newVideoItem.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title.',
        variant: 'destructive',
      });
      return;
    }

    if (newVideoItem.youtubeUrl && !validateUrl(newVideoItem.youtubeUrl)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid YouTube URL.',
        variant: 'destructive',
      });
      return;
    }

    addVideo({
      title: newVideoItem.title.trim(),
      thumbnail: newVideoItem.thumbnail.trim(),
      youtubeUrl: newVideoItem.youtubeUrl.trim(),
    });

    setNewVideoItem({ title: '', thumbnail: '', youtubeUrl: '' });
    setIsAddVideoDialogOpen(false);
    toast({
      title: 'Video added',
      description: 'New video has been added to your portfolio.',
    });
  };

  const handleAddDesign = () => {
    if (!newDesignItem.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title.',
        variant: 'destructive',
      });
      return;
    }

    if (newDesignItem.imageUrl && !validateUrl(newDesignItem.imageUrl)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid image URL.',
        variant: 'destructive',
      });
      return;
    }

    addDesign({
      title: newDesignItem.title.trim(),
      thumbnail: newDesignItem.thumbnail.trim(),
      imageUrl: newDesignItem.imageUrl.trim(),
    });

    setNewDesignItem({ title: '', thumbnail: '', imageUrl: '' });
    setIsAddDesignDialogOpen(false);
    toast({
      title: 'Design added',
      description: 'New design has been added to your portfolio.',
    });
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    if (editingItem.type === 'video') {
      updateVideo(editingItem.id, editingItem);
    } else {
      updateDesign(editingItem.id, editingItem);
    }

    setEditingItem(null);
    setIsEditDialogOpen(false);
    toast({
      title: 'Item updated',
      description: 'Changes have been saved.',
    });
  };

  const handleDeleteItem = (item: PortfolioItem) => {
    if (item.type === 'video') {
      deleteVideo(item.id);
    } else {
      deleteDesign(item.id);
    }
    toast({
      title: 'Item deleted',
      description: 'The item has been removed.',
    });
  };

  const getItemThumbnail = (item: PortfolioItem) => {
    if (item.type === 'video' && item.youtubeUrl) {
      return getYouTubeThumbnail(item.youtubeUrl) || item.thumbnail;
    }
    return item.imageUrl || item.thumbnail;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary text-glow">Admin Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="bg-muted border border-border mb-8">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Profile
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Videos
            </TabsTrigger>
            <TabsTrigger value="designs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Designs
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary mb-6">Edit Profile</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Name</label>
                  <Input
                    value={editingProfile.name}
                    onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                    className="bg-muted border-border"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Title</label>
                  <Input
                    value={editingProfile.title}
                    onChange={(e) => setEditingProfile({ ...editingProfile, title: e.target.value })}
                    className="bg-muted border-border"
                    maxLength={100}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground mb-2 block">Bio</label>
                  <Textarea
                    value={editingProfile.bio}
                    onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                    className="bg-muted border-border min-h-[120px]"
                    maxLength={500}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Profile Image URL</label>
                  <Input
                    value={editingProfile.profileImage}
                    onChange={(e) => setEditingProfile({ ...editingProfile, profileImage: e.target.value })}
                    placeholder="https://..."
                    className="bg-muted border-border"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Discord Username</label>
                  <Input
                    value={editingProfile.discordUsername}
                    onChange={(e) => setEditingProfile({ ...editingProfile, discordUsername: e.target.value })}
                    className="bg-muted border-border"
                    maxLength={50}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground mb-2 block">Discord Server Link</label>
                  <Input
                    value={editingProfile.discordServerLink}
                    onChange={(e) => setEditingProfile({ ...editingProfile, discordServerLink: e.target.value })}
                    placeholder="https://discord.gg/..."
                    className="bg-muted border-border"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveProfile}
                className="mt-6 bg-primary text-primary-foreground btn-glow"
              >
                Save Profile
              </Button>
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">Video Portfolio</h3>
                <Dialog open={isAddVideoDialogOpen} onOpenChange={setIsAddVideoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground btn-glow">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Video
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle className="text-primary">Add New Video</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Title *</label>
                        <Input
                          value={newVideoItem.title}
                          onChange={(e) => setNewVideoItem({ ...newVideoItem, title: e.target.value })}
                          placeholder="Enter video title"
                          className="bg-muted border-border"
                          maxLength={100}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <Youtube className="w-4 h-4 text-destructive" />
                          YouTube URL
                        </label>
                        <Input
                          value={newVideoItem.youtubeUrl}
                          onChange={(e) => setNewVideoItem({ ...newVideoItem, youtubeUrl: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="bg-muted border-border"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Paste YouTube video link (supports youtube.com/watch, youtu.be, and shorts)
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Custom Thumbnail URL (optional)</label>
                        <Input
                          value={newVideoItem.thumbnail}
                          onChange={(e) => setNewVideoItem({ ...newVideoItem, thumbnail: e.target.value })}
                          placeholder="https://... (leave empty to use YouTube thumbnail)"
                          className="bg-muted border-border"
                        />
                      </div>
                      <Button onClick={handleAddVideo} className="w-full bg-primary text-primary-foreground">
                        Add Video
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((item) => (
                  <div key={item.id} className="bg-muted border border-border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-background relative">
                      {getItemThumbnail(item) ? (
                        <img 
                          src={getItemThumbnail(item)} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No thumbnail
                        </div>
                      )}
                      {item.youtubeUrl && (
                        <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Youtube className="w-3 h-3" />
                          YouTube
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-foreground mb-3">{item.title}</h4>
                      {item.youtubeUrl && (
                        <p className="text-xs text-muted-foreground mb-3 truncate">{item.youtubeUrl}</p>
                      )}
                      <div className="flex gap-2">
                        <Dialog open={isEditDialogOpen && editingItem?.id === item.id} onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (!open) setEditingItem(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setEditingItem(item)}
                              className="flex-1 bg-primary text-primary-foreground"
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border">
                            <DialogHeader>
                              <DialogTitle className="text-primary">Edit Video</DialogTitle>
                            </DialogHeader>
                            {editingItem && editingItem.type === 'video' && (
                              <div className="space-y-4 mt-4">
                                <div>
                                  <label className="text-sm text-muted-foreground mb-2 block">Title</label>
                                  <Input
                                    value={editingItem.title}
                                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                    className="bg-muted border-border"
                                    maxLength={100}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                                    <Youtube className="w-4 h-4 text-destructive" />
                                    YouTube URL
                                  </label>
                                  <Input
                                    value={editingItem.youtubeUrl || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, youtubeUrl: e.target.value })}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="bg-muted border-border"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-muted-foreground mb-2 block">Custom Thumbnail URL</label>
                                  <Input
                                    value={editingItem.thumbnail}
                                    onChange={(e) => setEditingItem({ ...editingItem, thumbnail: e.target.value })}
                                    className="bg-muted border-border"
                                  />
                                </div>
                                <Button onClick={handleUpdateItem} className="w-full bg-primary text-primary-foreground">
                                  Save Changes
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteItem(item)}
                          className="flex-1"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Designs Tab */}
          <TabsContent value="designs">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">Design Portfolio</h3>
                <Dialog open={isAddDesignDialogOpen} onOpenChange={setIsAddDesignDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground btn-glow">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Design
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle className="text-primary">Add New Design</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Title *</label>
                        <Input
                          value={newDesignItem.title}
                          onChange={(e) => setNewDesignItem({ ...newDesignItem, title: e.target.value })}
                          placeholder="Enter design title"
                          className="bg-muted border-border"
                          maxLength={100}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <LinkIcon className="w-4 h-4 text-primary" />
                          Image URL *
                        </label>
                        <Input
                          value={newDesignItem.imageUrl}
                          onChange={(e) => setNewDesignItem({ ...newDesignItem, imageUrl: e.target.value })}
                          placeholder="https://... (direct link to image)"
                          className="bg-muted border-border"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Use direct image links from Imgur, Discord CDN, or other image hosts
                        </p>
                      </div>
                      <Button onClick={handleAddDesign} className="w-full bg-primary text-primary-foreground">
                        Add Design
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {designs.map((item) => (
                  <div key={item.id} className="bg-muted border border-border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-background relative">
                      {getItemThumbnail(item) ? (
                        <img 
                          src={getItemThumbnail(item)} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-foreground mb-3">{item.title}</h4>
                      <div className="flex gap-2">
                        <Dialog open={isEditDialogOpen && editingItem?.id === item.id} onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (!open) setEditingItem(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setEditingItem(item)}
                              className="flex-1 bg-primary text-primary-foreground"
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border">
                            <DialogHeader>
                              <DialogTitle className="text-primary">Edit Design</DialogTitle>
                            </DialogHeader>
                            {editingItem && editingItem.type === 'design' && (
                              <div className="space-y-4 mt-4">
                                <div>
                                  <label className="text-sm text-muted-foreground mb-2 block">Title</label>
                                  <Input
                                    value={editingItem.title}
                                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                    className="bg-muted border-border"
                                    maxLength={100}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4 text-primary" />
                                    Image URL
                                  </label>
                                  <Input
                                    value={editingItem.imageUrl || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="bg-muted border-border"
                                  />
                                </div>
                                <Button onClick={handleUpdateItem} className="w-full bg-primary text-primary-foreground">
                                  Save Changes
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteItem(item)}
                          className="flex-1"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
