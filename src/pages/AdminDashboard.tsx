import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePortfolio, PortfolioItem } from '@/contexts/PortfolioContext';
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
  const [newItem, setNewItem] = useState({ title: '', thumbnail: '' });
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('profile');
  const [itemType, setItemType] = useState<'video' | 'design'>('video');

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

  const handleAddItem = () => {
    if (!newItem.title) {
      toast({
        title: 'Error',
        description: 'Please enter a title.',
        variant: 'destructive',
      });
      return;
    }

    if (itemType === 'video') {
      addVideo(newItem);
    } else {
      addDesign(newItem);
    }

    setNewItem({ title: '', thumbnail: '' });
    setIsAddDialogOpen(false);
    toast({
      title: 'Item added',
      description: `New ${itemType} has been added.`,
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

  const renderItemGrid = (items: PortfolioItem[], type: 'video' | 'design') => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-primary">
          {type === 'video' ? 'Video Portfolio' : 'Design Portfolio'}
        </h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setItemType(type)}
              className="bg-primary text-primary-foreground btn-glow"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {type === 'video' ? 'Video' : 'Design'}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">Add New {type === 'video' ? 'Video' : 'Design'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Title</label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Enter title"
                  className="bg-muted border-border"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Thumbnail URL</label>
                <Input
                  value={newItem.thumbnail}
                  onChange={(e) => setNewItem({ ...newItem, thumbnail: e.target.value })}
                  placeholder="Enter image URL"
                  className="bg-muted border-border"
                />
              </div>
              <Button onClick={handleAddItem} className="w-full bg-primary text-primary-foreground">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-muted border border-border rounded-lg overflow-hidden">
            <div className="aspect-video bg-background relative">
              {item.thumbnail ? (
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No thumbnail
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
                      <DialogTitle className="text-primary">Edit Item</DialogTitle>
                    </DialogHeader>
                    {editingItem && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Title</label>
                          <Input
                            value={editingItem.title}
                            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                            className="bg-muted border-border"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Thumbnail URL</label>
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
  );

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
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Title</label>
                  <Input
                    value={editingProfile.title}
                    onChange={(e) => setEditingProfile({ ...editingProfile, title: e.target.value })}
                    className="bg-muted border-border"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground mb-2 block">Bio</label>
                  <Textarea
                    value={editingProfile.bio}
                    onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                    className="bg-muted border-border min-h-[120px]"
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
            {renderItemGrid(videos, 'video')}
          </TabsContent>

          {/* Designs Tab */}
          <TabsContent value="designs">
            {renderItemGrid(designs, 'design')}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
