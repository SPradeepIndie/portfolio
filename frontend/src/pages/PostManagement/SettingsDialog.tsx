import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  TextField,
  Chip,
  Box,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { apiService } from '../../services/api';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: SettingsDialogProps) => {
  const [categories, setCategories] = useState<{ id: number; name: string; entity_type: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; name: string; entity_type: string }[]>([]);
  const [newItem, setNewItem] = useState({ name: '', entity_type: 'blog', type: 'tag' });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    try {
      const data = await apiService.getSettings();
      setCategories(data.categories || []);
      setTags(data.tags || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load settings');
    }
  };

  const handleAdd = async () => {
    if (!newItem.name.trim()) return;
    try {
      if (newItem.type === 'category') {
        await apiService.createCategory({ name: newItem.name.trim(), entity_type: newItem.entity_type });
      } else {
        await apiService.createTag({ name: newItem.name.trim(), entity_type: newItem.entity_type });
      }
      setMessage('Added successfully');
      setNewItem({ ...newItem, name: '' });
      loadSettings();
    } catch (e: any) {
      setError(e.message || 'Failed to add item');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await apiService.deleteCategory(id);
      loadSettings();
    } catch (e: any) {
      setError(e.message || 'Failed to delete category');
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await apiService.deleteTag(id);
      loadSettings();
    } catch (e: any) {
      setError(e.message || 'Failed to delete tag');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tags & Categories Management</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <FormControl size="small" sx={{ minWidth: 120, flex: { xs: 1, sm: 'unset' } }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={newItem.type}
                label="Type"
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              >
                <MenuItem value="tag">Tag</MenuItem>
                <MenuItem value="category">Category</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120, flex: { xs: 1, sm: 'unset' } }}>
              <InputLabel>For</InputLabel>
              <Select
                value={newItem.entity_type}
                label="For"
                onChange={(e) => setNewItem({ ...newItem, entity_type: e.target.value })}
              >
                <MenuItem value="blog">Blog</MenuItem>
                <MenuItem value="project">Project</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              fullWidth
            />
            <Button variant="contained" onClick={handleAdd}>Add</Button>
          </Box>

          <Divider />

          <Typography variant="subtitle1">Categories</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.map((c) => (
              <Chip key={c.id} label={`${c.name} (${c.entity_type})`} onDelete={() => handleDeleteCategory(c.id)} />
            ))}
          </Box>

          <Typography variant="subtitle1">Tags</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((t) => (
              <Chip key={t.id} label={`${t.name} (${t.entity_type})`} onDelete={() => handleDeleteTag(t.id)} />
            ))}
          </Box>

        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>

      <Snackbar open={!!message} autoHideDuration={3000} onClose={() => setMessage(null)}>
        <Alert onClose={() => setMessage(null)} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};
