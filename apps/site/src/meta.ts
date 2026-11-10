// Component registry metadata. Plain data (no JSX) so vite.config can read it for SEO prerendering.
export type Group = 'glass' | 'basic' | 'layers' | 'nav' | 'content'

export const groupMeta: { id: Group; label: string }[] = [
  { id: 'glass', label: 'Cam' },
  { id: 'basic', label: 'Temel' },
  { id: 'layers', label: 'Katmanlar' },
  { id: 'nav', label: 'Navigasyon' },
  { id: 'content', label: 'İçerik' },
]

export type DocMeta = { id: string; group: Group; name: string; desc: string }

export const docMeta: DocMeta[] = [
  { id: 'glass', group: 'glass', name: 'Glass', desc: 'Her şeyin temeli. Bulanıklık, doygunluk, parlak üst kenar ve koyu alt kenar. Chromium’da kenarlarda gerçek mercek kırılması. Panelleri sürükleyin.' },
  { id: 'button', group: 'basic', name: 'Button', desc: 'Beş ton, üç boy, meşgul durumu. Basınca hafifçe çöker; cam ton tersine büyür.' },
  { id: 'icon-button', group: 'basic', name: 'IconButton', desc: 'Yalnızca ikon. label hem erişilebilir ad hem ipucu olur.' },
  { id: 'field', group: 'basic', name: 'Input, Textarea, Field', desc: 'Field etiketi, ipucunu ve hatayı bağlar. Kontrol bir label içinde durur, id gerekmez.' },
  { id: 'checkbox', group: 'basic', name: 'Checkbox', desc: 'Yuvarlak onay. İşaret kendini çizer.' },
  { id: 'switch', group: 'basic', name: 'Switch', desc: 'Basılı tutunca topuz uzar ve cama döner, bırakınca yaylanarak geçer.' },
  { id: 'slider', group: 'basic', name: 'Slider', desc: 'Yerel range girdisi; klavye ve ekran okuyucu desteği hazır. Sürüklerken topuz şişer.' },
  { id: 'segmented', group: 'basic', name: 'Segmented', desc: 'Seçim parçalar arasında kayar. Ok tuşlarıyla gezilir.' },
  { id: 'pill', group: 'basic', name: 'Pill, Kbd', desc: 'Durum etiketi ve tuş gösterimi. Pill paletin herhangi bir rengini alır.' },
  { id: 'avatar', group: 'basic', name: 'Avatar, AvatarStack', desc: 'Görsel yoksa baş harfler; renk addan türetilir, her seferinde aynı çıkar.' },
  { id: 'spinner', group: 'basic', name: 'Spinner', desc: 'Rengini metinden alır. label verilirse ekran okuyucuya duyurulur.' },
  { id: 'dialog', group: 'layers', name: 'Dialog', desc: 'Cam panel; odak içeride kalır, Escape kapatır, kapanınca odak geri döner.' },
  { id: 'confirm', group: 'layers', name: 'Confirm', desc: 'Geri dönüşü olmayan işler için hazır onay penceresi.' },
  { id: 'sheet', group: 'layers', name: 'Sheet', desc: 'Alttan açılan sayfa tutamaktan aşağı çekilerek kapanır; yan panel ayrıntılar içindir.' },
  { id: 'popover', group: 'layers', name: 'Popover', desc: 'Bir elemana asılı cam panel. Portal içinde durur, yer yoksa yukarı açılır.' },
  { id: 'menu', group: 'layers', name: 'Menu', desc: 'Popover üstüne kurulu menü. Oklar gezinir, Enter seçer, Escape kapatıp odağı düğmeye verir.' },
  { id: 'tooltip', group: 'layers', name: 'Tooltip', desc: 'Üzerine gelince kısa gecikmeyle, klavye odağında hemen görünür.' },
  { id: 'toast', group: 'layers', name: 'Toast', desc: 'Her yerden toast() ile çağrılır. Sağa kaydırınca kapanır, üzerine gelince süre durur.' },
  { id: 'tabbar', group: 'nav', name: 'TabBar', desc: 'Yüzen cam sekme çubuğu. Seçim baloncuğu kayar; kompakt modda etiketler katlanır. Bu sayfanın altındaki çubuk da bu.' },
  { id: 'toolbar', group: 'nav', name: 'Toolbar', desc: 'Başlık ve eylemler için yüzen cam çubuk. sticky ile içerik altından kayar. Sayfanın üst çubuğu da bu.' },
  { id: 'tabs', group: 'nav', name: 'Tabs', desc: 'Kayan alt çizgili metin sekmeleri. Kontrollü ya da kendi başına çalışır.' },
  { id: 'command-palette', group: 'nav', name: 'CommandPalette', desc: 'Bulanık arama, gruplar, klavyeyle seçim. Türkçe karakterlerde aksan duyarsız. Bu sayfada ⌘K ile açılır.' },
  { id: 'card', group: 'content', name: 'Card', desc: 'İçerik için opak yüzey. Cam yalnızca üstteki katmanlarda kalır.' },
  { id: 'list', group: 'content', name: 'List, Row', desc: 'iOS ayarlar düzeninde gruplu liste. Tıklanabilir satırlar ok işareti alır.' },
  { id: 'empty', group: 'content', name: 'Empty', desc: 'Boş durumlar için: ne olduğunu ve sıradaki adımı söyler.' },
  { id: 'skeleton', group: 'content', name: 'Skeleton', desc: 'Yüklenirken içeriğin yerini tutar, böylece sayfa zıplamaz.' },
  { id: 'progress', group: 'content', name: 'Progress, ProgressRing', desc: 'Değer 0–1 arası; yay ile ilerler. Değer verilmezse belirsiz akar.' },
]
