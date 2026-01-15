# Card Components

This directory contains reusable card components following a decorator pattern architecture.

## Components

### BaseCard

The foundational card component that provides a consistent structure and styling. All other cards extend or compose with this base component.

**Features:**
- Responsive hover effects
- Featured badge support
- Image display with customizable height
- Category chip
- Metadata display with icons
- Tag management with overflow handling
- Flexible content slots (header, children, footer, actions)
- Customizable styles

**Props:**
```typescript
interface BaseCardProps {
  title: string;              // Card title (required)
  description: string;         // Card description (required)
  image?: string;             // Image URL
  featured?: boolean;         // Show featured badge
  children?: ReactNode;       // Additional content
  actions?: ReactNode;        // Card actions (buttons, etc.)
  header?: ReactNode;         // Custom header content
  footer?: ReactNode;         // Custom footer content
  category?: string;          // Category chip
  tags?: string[];           // Tags (shows up to 4)
  metadata?: Array<{          // Metadata items with icons
    icon: ReactNode;
    text: string;
  }>;
  sx?: object;               // Custom MUI styles
  imageHeight?: number | string; // Custom image height (default: 200)
}
```

**Usage Example:**
```tsx
import { BaseCard } from '../../components';
import { Star as StarIcon } from '@mui/icons-material';

function MyComponent() {
  return (
    <BaseCard
      title="My Awesome Card"
      description="This is a sample card using BaseCard component"
      image="/path/to/image.jpg"
      featured={true}
      category="Technology"
      tags={['React', 'TypeScript', 'MUI']}
      metadata={[
        {
          icon: <StarIcon sx={{ fontSize: 16 }} />,
          text: '4.5 rating'
        }
      ]}
      actions={
        <Button variant="contained">
          View Details
        </Button>
      }
    />
  );
}
```

### ProjectCard

A specialized card for displaying project information. Extends BaseCard with project-specific features.

**Features:**
- Status chip (Completed, In Progress, Planning)
- Technology tags
- GitHub and live demo links
- Project metadata (date, category)


### BlogCard

A specialized card for displaying blog posts. Extends BaseCard with blog-specific features.

**Features:**
- Author information with avatar
- Read time, views, and likes display
- Category and tags
- Share functionality
- "Read More" button

## Decorator Pattern

The card system follows the **decorator pattern**, where:

1. **BaseCard** provides the core functionality and structure
2. **BlogCard** and **ProjectCard** "decorate" BaseCard

## Creating a New Card Type
```tsx
BaseCard from './BaseCard';
import { Button, Chip } from '@mui/material';
import { YourIcon } from '@mui/icons-material';
import type { YourDataType } from '../../services/api';

interface YourCardProps {
  data: YourDataType;
  featured?: boolean;
}

function YourCard({ data, featured = false }: YourCardProps) {
  return (
    <BaseCard
      title={data.title}
      description={data.description}
      image={data.image}
      featured={featured}
      category={data.category}
      tags={data.tags}
      metadata={[
        {
          icon: <YourIcon sx={{ fontSize: 16 }} />,
          text: data.yourMetadata
        }
      ]}
      actions={
        <Button variant="contained">
          Your Action
        </Button>
      }
    >
      {/* Additional custom content */}
      <Chip label={data.status} />
    </BaseCard>
  );
}

export default YourCard;
```

## Best Practices

1. **Use BaseCard directly** for simple, generic cards
2. **Create specialized cards** when you need consistent, domain-specific rendering
3. **Leverage the children prop** for one-off custom content
4. **Use metadata array** for consistent icon+text displays
5. **Keep actions flexible** by passing ReactNode instead of specific components
6. **Override styles carefully** using the sx prop to maintain consistency
