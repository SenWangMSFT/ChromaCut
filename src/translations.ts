export type Language = 'en' | 'fr' | 'zh';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  uploadImage: string;
  undo: string;
  reset: string;
  edgeStrength: string;
  backgroundColor: string;
  applyColor: string;
  downloadPNG: string;
  hint: string;
  hintClick: string;
  hintSnaps: string;
  hintClose: string;
  uploadPlaceholder: string;
  supportedFormats: string;
  pathClosedSuccess: string;
  colorAppliedSuccess: string;
  colorAppliedDownload: string;
  downloadSuccess: string;
  uploadError: string;
  applyColorError: string;
  invalidFileType: string;
  selectLanguage: string;
  undoTitle: string;
  resetTitle: string;
  outputMode: string;
  backgroundColorMode: string;
  extractObjectMode: string;
  applyColorHint: string;
  extractObjectHint: string;
  keyboardShortcuts: string;
  keyboardShortcutsTitle: string;
  shortcutUndo: string;
  shortcutReset: string;
  shortcutApply: string;
  shortcutDownload: string;
  shortcutZoomIn: string;
  shortcutZoomOut: string;
  shortcutZoomFit: string;
  shortcutHelp: string;
  shortcutUpload: string;
  generalSection: string;
  editingSection: string;
  viewSection: string;
  closeHelp: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'ChromaCut',
    appSubtitle: 'Magnetic Lasso Editor',
    uploadImage: 'Upload Image',
    undo: 'Undo',
    reset: 'Reset',
    edgeStrength: 'Edge Strength',
    backgroundColor: 'Background Color',
    applyColor: 'Apply Color',
    downloadPNG: 'Download PNG',
    hint: '💡',
    hintClick: 'Click to place anchors',
    hintSnaps: 'Path snaps to edges',
    hintClose: 'Click near first anchor to close',
    uploadPlaceholder: 'Drop an image here or click to browse',
    supportedFormats: 'Supports PNG, JPEG, and TIFF formats',
    pathClosedSuccess: 'Selection closed! Choose a background color and click Apply.',
    colorAppliedSuccess: 'Background color applied! Click Download to save.',
    colorAppliedDownload: 'Color applied successfully!',
    downloadSuccess: 'Image downloaded successfully!',
    uploadError: 'Failed to load image',
    applyColorError: 'Failed to apply background color',
    invalidFileType: 'Please upload a PNG, JPG, or TIF image',
    selectLanguage: 'Language',
    undoTitle: 'Undo last anchor (Ctrl/Cmd+Z)',
    resetTitle: 'Reset selection (Esc)',
    outputMode: 'Output Mode',
    backgroundColorMode: 'Background Color',
    extractObjectMode: 'Extract Object Only',
    applyColorHint: 'Replace background with solid color',
    extractObjectHint: 'Remove background, keep object only',
    keyboardShortcuts: 'Keyboard Shortcuts',
    keyboardShortcutsTitle: 'Keyboard Shortcuts',
    shortcutUndo: 'Undo last anchor',
    shortcutReset: 'Reset selection',
    shortcutApply: 'Apply background color',
    shortcutDownload: 'Download result',
    shortcutZoomIn: 'Zoom in',
    shortcutZoomOut: 'Zoom out',
    shortcutZoomFit: 'Fit to screen',
    shortcutHelp: 'Show keyboard shortcuts',
    shortcutUpload: 'Upload new image',
    generalSection: 'General',
    editingSection: 'Editing',
    viewSection: 'View',
    closeHelp: 'Close',
  },
  fr: {
    appTitle: 'ChromaCut',
    appSubtitle: 'Éditeur de Lasso Magnétique',
    uploadImage: 'Télécharger une Image',
    undo: 'Annuler',
    reset: 'Réinitialiser',
    edgeStrength: 'Force des Contours',
    backgroundColor: 'Couleur d\'Arrière-plan',
    applyColor: 'Appliquer la Couleur',
    downloadPNG: 'Télécharger PNG',
    hint: '💡',
    hintClick: 'Cliquez pour placer des ancres',
    hintSnaps: 'Le chemin s\'accroche aux bords',
    hintClose: 'Cliquez près de la première ancre pour fermer',
    uploadPlaceholder: 'Déposez une image ici ou cliquez pour parcourir',
    supportedFormats: 'Prend en charge les formats PNG, JPEG et TIFF',
    pathClosedSuccess: 'Sélection fermée ! Choisissez une couleur d\'arrière-plan et cliquez sur Appliquer.',
    colorAppliedSuccess: 'Couleur d\'arrière-plan appliquée ! Cliquez sur Télécharger pour enregistrer.',
    colorAppliedDownload: 'Couleur appliquée avec succès !',
    downloadSuccess: 'Image téléchargée avec succès !',
    uploadError: 'Échec du chargement de l\'image',
    applyColorError: 'Échec de l\'application de la couleur d\'arrière-plan',
    invalidFileType: 'Veuillez télécharger une image PNG, JPG ou TIF',
    selectLanguage: 'Langue',
    undoTitle: 'Annuler la dernière ancre (Ctrl/Cmd+Z)',
    resetTitle: 'Réinitialiser la sélection (Échap)',
    outputMode: 'Mode de Sortie',
    backgroundColorMode: 'Couleur d\'Arrière-plan',
    extractObjectMode: 'Extraire l\'Objet Uniquement',
    applyColorHint: 'Remplacer l\'arrière-plan par une couleur unie',
    extractObjectHint: 'Supprimer l\'arrière-plan, garder uniquement l\'objet',
    keyboardShortcuts: 'Raccourcis Clavier',
    keyboardShortcutsTitle: 'Raccourcis Clavier',
    shortcutUndo: 'Annuler la dernière ancre',
    shortcutReset: 'Réinitialiser la sélection',
    shortcutApply: 'Appliquer la couleur d\'arrière-plan',
    shortcutDownload: 'Télécharger le résultat',
    shortcutZoomIn: 'Zoom avant',
    shortcutZoomOut: 'Zoom arrière',
    shortcutZoomFit: 'Ajuster à l\'écran',
    shortcutHelp: 'Afficher les raccourcis clavier',
    shortcutUpload: 'Télécharger une nouvelle image',
    generalSection: 'Général',
    editingSection: 'Édition',
    viewSection: 'Affichage',
    closeHelp: 'Fermer',
  },
  zh: {
    appTitle: 'ChromaCut',
    appSubtitle: '磁性套索编辑器',
    uploadImage: '上传图片',
    undo: '撤销',
    reset: '重置',
    edgeStrength: '边缘强度',
    backgroundColor: '背景颜色',
    applyColor: '应用颜色',
    downloadPNG: '下载 PNG',
    hint: '💡',
    hintClick: '点击放置锚点',
    hintSnaps: '路径自动吸附边缘',
    hintClose: '点击靠近第一个锚点以关闭',
    uploadPlaceholder: '拖放图片到这里或点击浏览',
    supportedFormats: '支持 PNG、JPEG 和 TIFF 格式',
    pathClosedSuccess: '选区已关闭！选择背景颜色并点击应用。',
    colorAppliedSuccess: '背景颜色已应用！点击下载保存。',
    colorAppliedDownload: '颜色应用成功！',
    downloadSuccess: '图片下载成功！',
    uploadError: '图片加载失败',
    applyColorError: '背景颜色应用失败',
    invalidFileType: '请上传 PNG、JPG 或 TIF 图片',
    selectLanguage: '语言',
    undoTitle: '撤销上一个锚点 (Ctrl/Cmd+Z)',
    resetTitle: '重置选区 (Esc)',
    outputMode: '输出模式',
    backgroundColorMode: '背景颜色',
    extractObjectMode: '仅提取对象',
    applyColorHint: '用纯色替换背景',
    extractObjectHint: '移除背景，仅保留对象',
    keyboardShortcuts: '键盘快捷键',
    keyboardShortcutsTitle: '键盘快捷键',
    shortcutUndo: '撤销上一个锚点',
    shortcutReset: '重置选区',
    shortcutApply: '应用背景颜色',
    shortcutDownload: '下载结果',
    shortcutZoomIn: '放大',
    shortcutZoomOut: '缩小',
    shortcutZoomFit: '适应屏幕',
    shortcutHelp: '显示键盘快捷键',
    shortcutUpload: '上传新图片',
    generalSection: '通用',
    editingSection: '编辑',
    viewSection: '视图',
    closeHelp: '关闭',
  },
};
