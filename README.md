# ChromaCut - Magnetic Lasso Image Editor

A production-quality web application for advanced image selection and background replacement using magnetic lasso (intelligent scissors) technology. Built with React, TypeScript, and Konva.js.

![ChromaCut Demo](https://img.shields.io/badge/Status-Production%20Ready-success)

## Features

### 🎯 Magnetic Lasso Selection
- **Smart Edge Detection**: Click to place anchor points, and the path automatically snaps to object edges
- **Live-Wire Technology**: Uses A* pathfinding on Sobel gradient-based cost maps for intelligent path calculation
- **Interactive Preview**: See the path before committing with real-time preview as you move the mouse
- **Precision Controls**: Adjustable edge strength slider to fine-tune edge detection sensitivity

### 🖼️ Image Processing
- **Native Resolution Processing**: Works with ImageData at full resolution for maximum quality
- **Zoom & Pan**: Smooth, trackpad-friendly navigation with mouse wheel zoom
- **Coordinate Transforms**: Proper handling between screen and image-native coordinates

### 🎨 Background Recoloring
- **Inverted Fill**: Apply solid color to background while preserving the selected object
- **Clean Masking**: Binary mask generation from closed polygon paths
- **Color Picker**: Choose any background color with live preview
- **PNG Export**: Download the result as a high-quality PNG

### 🛠️ User Experience
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + Z`: Undo last anchor
  - `Esc`: Reset current selection
- **Visual Feedback**:
  - Yellow anchors mark committed points
  - Green highlight when near first anchor (ready to close)
  - Cyan path preview shows magnetic lasso in action
- **Performance Optimized**:
  - Throttled mouse move updates (~60fps)
  - Local window pathfinding (adaptive bounding box)
  - Efficient cost map computation

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm

### Quick Start

```bash
# Navigate to the project directory
cd chromacut

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage Guide

### 1. Upload an Image
- Click **"📁 Upload Image"** and select a PNG, JPG, or TIF file
- The image will be centered and scaled to fit the viewport
- Large images (>10MB) will show a performance warning

### 2. Create Selection with Magnetic Lasso
- **Click** anywhere on the image to place the first anchor point
- **Move your mouse** to see the path preview automatically snap to edges
- **Click** again to commit that segment and place the next anchor
- The path will intelligently follow object boundaries based on edge detection
- **Adjust Edge Strength** slider if the path isn't snapping well (higher = more sensitive to edges)

### 3. Close the Path
- Move your cursor near the **first anchor point** (it will turn green)
- **Click** to close the loop and finalize the selection
- The final segment will also use the magnetic lasso algorithm

### 4. Apply Background Color
- Once the path is closed, a **color picker** appears
- Choose your desired background color
- Click **"✓ Apply Color"** to replace the background
- **Only the background is recolored** - the selected object keeps its original appearance

### 5. Download Result
- Click **"⬇ Download PNG"** to save the processed image
- The file will be saved as `chromacut-result.png`

### Pro Tips
- Use zoom (mouse wheel) and pan for precision on detailed edges
- For complex selections, place more anchor points around tight curves
- If the path isn't following edges well, try adjusting the Edge Strength slider
- Press `Ctrl/Cmd+Z` to remove the last anchor if you make a mistake
- Press `Esc` to start over completely

## Technical Architecture

### Project Structure
```
chromacut/
├── src/
│   ├── components/
│   │   ├── Editor.tsx          # Konva-based canvas editor with zoom/pan
│   │   └── Toolbar.tsx         # Control panel with all UI controls
│   ├── lib/
│   │   ├── imageProcessing.ts  # Image loading utilities
│   │   ├── sobel.ts            # Sobel gradient & cost map computation
│   │   ├── pathfinding.ts      # A* algorithm for live-wire
│   │   └── mask.ts             # Mask generation & compositing
│   ├── types.ts                # TypeScript interfaces
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Styling
│   └── main.tsx                # Entry point
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Core Technologies
- **React 18**: UI framework with hooks
- **TypeScript 5**: Type-safe development
- **Vite 5**: Fast build tool and dev server
- **Konva.js**: High-performance canvas rendering
- **React-Konva**: React bindings for Konva

### Algorithms

#### Magnetic Lasso (Live-Wire)
1. **Edge Detection**: Compute Sobel gradients on grayscale image
2. **Cost Map**: Convert gradient magnitude to traversal cost (strong edge = low cost)
3. **Pathfinding**: Run A* in a local window between last anchor and cursor
4. **Preview**: Update path on mouse move (throttled to 60fps)

#### Mask Generation
1. Create offscreen canvas matching image dimensions
2. Draw closed polygon path
3. Fill interior with white, background with black
4. Extract ImageData as binary mask

#### Background Compositing
1. Read original image pixels
2. For each pixel: if mask is black (background), replace with solid color
3. If mask is white (selection), keep original pixel
4. Render to canvas for export

## Performance Considerations

- **Local Window**: Pathfinding limited to adaptive bounding box (typically 200x200)
- **Throttling**: Mouse move updates limited to ~60fps using requestAnimationFrame
- **Cost Map Caching**: Gradients computed once, only recalculated on edge strength change
- **Efficient Data Structures**: Float32Array for cost maps, minimal object allocation
- **Memory Management**: Object URLs properly revoked to prevent leaks

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires modern browser with:
- Canvas API
- ES2020 support
- CSS Grid & Flexbox

## Development

### Code Style
- Functional React components with hooks
- TypeScript strict mode enabled
- Modular library functions for testability
- Clear separation between UI and logic

### Future Enhancements (Potential)
- Web Worker for pathfinding to prevent UI blocking
- Multi-resolution pyramid for large images
- Feather edge option for softer selections
- Undo/redo stack for complex workflows
- Export with transparency option

## License

MIT License - Feel free to use in your projects!

## Credits

Built with ❤️ using modern web technologies. Implements intelligent scissors algorithm inspired by Eric N. Mortensen and William A. Barrett's research on interactive segmentation.

---

**ChromaCut** - Professional image editing, right in your browser.
