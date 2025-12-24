# ChromaCut - Magnetic Lasso Editor

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## English

### Overview

**ChromaCut** is a modern, browser-based image editing tool featuring an intelligent magnetic lasso selection system. Using advanced computer vision algorithms, ChromaCut automatically detects and snaps to object edges, making precise selections effortless.

### Features

- 🎯 **Magnetic Lasso Selection** - Intelligent edge detection with automatic path snapping
- 🎨 **Background Recoloring** - Replace backgrounds with custom colors
- 🖼️ **Multi-Format Support** - PNG, JPEG, and TIFF image formats
- 🌍 **Multilingual Interface** - English, French (Français), and Chinese (中文)
- ⚡ **Real-time Processing** - Instant visual feedback and smooth interactions
- 🎭 **Premium UI** - Modern glassmorphism design with fluid animations
- 📱 **Responsive Layout** - Resizable panels and touch-friendly controls
- 🔄 **Undo/Reset** - Non-destructive editing workflow

### Technology Stack

- **Frontend Framework**: React 18.2 + TypeScript 5.2
- **Build Tool**: Vite 5.0
- **Canvas Rendering**: Konva.js 9.3 + React-Konva 18.2
- **Image Processing**: Custom algorithms (Sobel gradient, A* pathfinding)
- **Styling**: CSS3 with glassmorphism effects

---

## Algorithm Details

### 1. Edge Detection: Sobel Operator

The Sobel operator is a discrete differentiation operator that computes an approximation of the gradient of the image intensity function. This helps identify edges where pixel intensity changes rapidly.

#### Sobel Kernels

The algorithm uses two 3×3 convolution kernels to calculate horizontal and vertical gradients:

**Horizontal Gradient (Gₓ):**
```
    | -1  0  +1 |
Gₓ = | -2  0  +2 |
    | -1  0  +1 |
```

**Vertical Gradient (Gᵧ):**
```
    | -1  -2  -1 |
Gᵧ = |  0   0   0 |
    | +1  +2  +1 |
```

#### Gradient Computation

For each pixel at position (x, y), the gradients are computed by convolving the kernels with the grayscale image:

```
Gₓ(x,y) = Σ Σ Kₓ(i,j) · I(x+i-1, y+j-1)
         i j

Gᵧ(x,y) = Σ Σ Kᵧ(i,j) · I(x+i-1, y+j-1)
         i j
```

Where:
- `I(x,y)` is the intensity of the pixel at (x,y)
- `Kₓ` and `Kᵧ` are the Sobel kernels
- The summation is over a 3×3 neighborhood

#### Gradient Magnitude

The gradient magnitude represents the strength of the edge:

```
G(x,y) = √(Gₓ² + Gᵧ²)
```

For computational efficiency, we use the approximation:

```
G(x,y) ≈ |Gₓ| + |Gᵧ|
```

#### Cost Map Generation

The gradient magnitude is inverted to create a cost map where strong edges have low cost:

```
Cost(x,y) = max(ε, 1 - G(x,y)/G_max) · edgeStrength
```

Where:
- `G_max` is the maximum gradient in the image
- `ε = 0.01` prevents zero costs
- `edgeStrength` is a user-adjustable parameter (default: 1.5)

---

### 2. Path Finding: A* Algorithm

The magnetic lasso uses the A* pathfinding algorithm to find the lowest-cost path between anchor points along object edges.

#### Algorithm Overview

A* is an informed search algorithm that finds the optimal path from a start node to a goal node using a heuristic function.

#### Cost Function

```
f(n) = g(n) + h(n)
```

Where:
- `f(n)` = total estimated cost through node n
- `g(n)` = actual cost from start to node n
- `h(n)` = heuristic estimated cost from n to goal

#### Heuristic Function

We use the Euclidean distance as the heuristic:

```
h(n) = √((xₙ - x_goal)² + (yₙ - y_goal)²)
```

This heuristic is **admissible** (never overestimates the actual cost) and **consistent**, guaranteeing optimal path finding.

#### Neighbor Cost Calculation

For each neighboring pixel, the transition cost is:

```
g_new(neighbor) = g(current) + Cost(neighbor) + distance
```

Where `distance` is:
- `1.0` for cardinal directions (up, down, left, right)
- `√2 ≈ 1.414` for diagonal directions

#### Optimization: Local Window Search

To improve performance on large images, the search is constrained to a local window:

```
Window = {
    xₘᵢₙ = max(0, min(x_start, x_goal) - windowSize/2)
    xₘₐₓ = min(width, max(x_start, x_goal) + windowSize/2)
    yₘᵢₙ = max(0, min(y_start, y_goal) - windowSize/2)
    yₘₐₓ = min(height, max(y_start, y_goal) + windowSize/2)
}
```

Adaptive window size:
```
windowSize = min(200, max(100, 2 × distance(start, goal)))
```

#### Path Reconstruction

Once the goal is reached, the optimal path is reconstructed by following parent pointers:

```
path = []
node = goal
while node ≠ start:
    path.prepend(node)
    node = parent[node]
path.prepend(start)
```

---

### 3. Mask Generation and Compositing

#### Polygon Mask Creation

The closed path forms a polygon, which is rendered to a binary mask:

```
Mask(x,y) = {
    255  if (x,y) is inside polygon
    0    if (x,y) is outside polygon
}
```

#### Background Color Application

For each pixel in the output image:

```
Output(x,y) = {
    backgroundColor   if Mask(x,y) < 128
    Original(x,y)     if Mask(x,y) ≥ 128
}
```

This preserves the selected object while replacing the background.

---

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chromacut.git
cd chromacut

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Usage

1. **Upload Image**: Click "Upload Image" or drag and drop
2. **Place Anchors**: Click on the image to place anchor points
3. **Automatic Snapping**: The path automatically snaps to nearby edges
4. **Close Selection**: Click near the first anchor to close the path
5. **Adjust Edge Strength**: Use the slider to control edge detection sensitivity
6. **Choose Background Color**: Select a color from the color picker
7. **Apply Color**: Click "Apply Color" to replace the background
8. **Download**: Click "Download PNG" to save your edited image

### Keyboard Shortcuts

- **Ctrl/Cmd + Z**: Undo last anchor
- **Esc**: Reset selection
- **Wheel**: Zoom in/out
- **Two-finger pan**: Pan canvas (trackpad/touch)

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### License

MIT License - See LICENSE file for details

---

<a name="中文"></a>
## 中文

### 概述

**ChromaCut** 是一款现代化的基于浏览器的图像编辑工具，具有智能磁性套索选择系统。通过使用先进的计算机视觉算法，ChromaCut 能够自动检测并吸附到物体边缘，使精确选择变得轻而易举。

### 功能特性

- 🎯 **磁性套索选择** - 智能边缘检测，自动路径吸附
- 🎨 **背景重新着色** - 用自定义颜色替换背景
- 🖼️ **多格式支持** - PNG、JPEG 和 TIFF 图像格式
- 🌍 **多语言界面** - 英语、法语（Français）和中文
- ⚡ **实时处理** - 即时视觉反馈和流畅交互
- 🎭 **高级界面** - 现代玻璃态设计，流畅动画
- 📱 **响应式布局** - 可调整大小的面板和触摸友好控件
- 🔄 **撤销/重置** - 非破坏性编辑工作流程

### 技术栈

- **前端框架**: React 18.2 + TypeScript 5.2
- **构建工具**: Vite 5.0
- **画布渲染**: Konva.js 9.3 + React-Konva 18.2
- **图像处理**: 自定义算法（Sobel 梯度、A* 路径查找）
- **样式**: CSS3 玻璃态效果

---

## 算法详解

### 1. 边缘检测：Sobel 算子

Sobel 算子是一种离散微分算子，用于计算图像强度函数梯度的近似值。这有助于识别像素强度快速变化的边缘。

#### Sobel 卷积核

该算法使用两个 3×3 卷积核来计算水平和垂直梯度：

**水平梯度 (Gₓ)：**
```
    | -1  0  +1 |
Gₓ = | -2  0  +2 |
    | -1  0  +1 |
```

**垂直梯度 (Gᵧ)：**
```
    | -1  -2  -1 |
Gᵧ = |  0   0   0 |
    | +1  +2  +1 |
```

#### 梯度计算

对于位置 (x, y) 的每个像素，通过将卷积核与灰度图像进行卷积来计算梯度：

```
Gₓ(x,y) = Σ Σ Kₓ(i,j) · I(x+i-1, y+j-1)
         i j

Gᵧ(x,y) = Σ Σ Kᵧ(i,j) · I(x+i-1, y+j-1)
         i j
```

其中：
- `I(x,y)` 是位置 (x,y) 处像素的强度
- `Kₓ` 和 `Kᵧ` 是 Sobel 卷积核
- 求和遍历 3×3 邻域

#### 梯度幅值

梯度幅值表示边缘的强度：

```
G(x,y) = √(Gₓ² + Gᵧ²)
```

为了提高计算效率，我们使用近似值：

```
G(x,y) ≈ |Gₓ| + |Gᵧ|
```

#### 代价图生成

将梯度幅值反转以创建代价图，其中强边缘具有低代价：

```
Cost(x,y) = max(ε, 1 - G(x,y)/G_max) · edgeStrength
```

其中：
- `G_max` 是图像中的最大梯度
- `ε = 0.01` 防止零代价
- `edgeStrength` 是用户可调参数（默认值：1.5）

---

### 2. 路径查找：A* 算法

磁性套索使用 A* 路径查找算法在锚点之间沿物体边缘找到最低代价路径。

#### 算法概述

A* 是一种启发式搜索算法，使用启发式函数从起始节点找到到达目标节点的最优路径。

#### 代价函数

```
f(n) = g(n) + h(n)
```

其中：
- `f(n)` = 通过节点 n 的总估计代价
- `g(n)` = 从起点到节点 n 的实际代价
- `h(n)` = 从 n 到目标的启发式估计代价

#### 启发式函数

我们使用欧几里得距离作为启发式：

```
h(n) = √((xₙ - x_goal)² + (yₙ - y_goal)²)
```

该启发式是**可接受的**（永不高估实际代价）且**一致的**，保证找到最优路径。

#### 邻居代价计算

对于每个相邻像素，转移代价为：

```
g_new(neighbor) = g(current) + Cost(neighbor) + distance
```

其中 `distance` 为：
- 基本方向（上、下、左、右）为 `1.0`
- 对角线方向为 `√2 ≈ 1.414`

#### 优化：局部窗口搜索

为了提高大图像的性能，搜索被限制在局部窗口内：

```
Window = {
    xₘᵢₙ = max(0, min(x_start, x_goal) - windowSize/2)
    xₘₐₓ = min(width, max(x_start, x_goal) + windowSize/2)
    yₘᵢₙ = max(0, min(y_start, y_goal) - windowSize/2)
    yₘₐₓ = min(height, max(y_start, y_goal) + windowSize/2)
}
```

自适应窗口大小：
```
windowSize = min(200, max(100, 2 × distance(start, goal)))
```

#### 路径重建

一旦到达目标，通过跟踪父指针重建最优路径：

```
path = []
node = goal
while node ≠ start:
    path.prepend(node)
    node = parent[node]
path.prepend(start)
```

---

### 3. 蒙版生成和合成

#### 多边形蒙版创建

闭合路径形成一个多边形，被渲染为二值蒙版：

```
Mask(x,y) = {
    255  如果 (x,y) 在多边形内部
    0    如果 (x,y) 在多边形外部
}
```

#### 背景颜色应用

对于输出图像中的每个像素：

```
Output(x,y) = {
    backgroundColor   如果 Mask(x,y) < 128
    Original(x,y)     如果 Mask(x,y) ≥ 128
}
```

这样可以保留选定的对象，同时替换背景。

---

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/chromacut.git
cd chromacut

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 使用方法

1. **上传图片**：点击"上传图片"或拖放文件
2. **放置锚点**：在图像上点击以放置锚点
3. **自动吸附**：路径自动吸附到附近的边缘
4. **关闭选区**：点击靠近第一个锚点以闭合路径
5. **调整边缘强度**：使用滑块控制边缘检测灵敏度
6. **选择背景颜色**：从颜色选择器中选择颜色
7. **应用颜色**：点击"应用颜色"替换背景
8. **下载**：点击"下载 PNG"保存编辑后的图像

### 键盘快捷键

- **Ctrl/Cmd + Z**：撤销上一个锚点
- **Esc**：重置选区
- **滚轮**：放大/缩小
- **双指平移**：平移画布（触控板/触摸）

### 浏览器支持

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### 许可证

MIT 许可证 - 详见 LICENSE 文件

---

## Contributing | 贡献

Contributions are welcome! Please feel free to submit a Pull Request.

欢迎贡献！请随时提交 Pull Request。

## Support | 支持

For issues and questions, please open an issue on GitHub.

如有问题，请在 GitHub 上提交 issue。

---

**Made with ❤️ using React + TypeScript**
