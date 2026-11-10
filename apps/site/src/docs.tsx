import { motion } from 'motion/react'
import { useRef, useState, type ComponentType } from 'react'
import {
  Avatar,
  AvatarStack,
  Button,
  Card,
  Checkbox,
  CommandPalette,
  Confirm,
  Dialog,
  Empty,
  Field,
  Glass,
  IconButton,
  Input,
  Kbd,
  List,
  Menu,
  Pill,
  Popover,
  Progress,
  ProgressRing,
  Row,
  Segmented,
  Sheet,
  Skeleton,
  SkeletonText,
  Slider,
  Spinner,
  Switch,
  TabBar,
  Tabs,
  Textarea,
  Toolbar,
  Tooltip,
  refractionSupported,
  toast,
} from '@noirlang/components'
import * as Ico from './icons'
import { Stage, type Backdrop } from './ui'
import { docMeta, groupMeta, type DocMeta, type Group } from './meta'

const groupIcons: Record<Group, ComponentType<{ size?: number }>> = { glass: Ico.Drop, basic: Ico.Square, layers: Ico.Layers, nav: Ico.Compass, content: Ico.Rows }
export const groups = groupMeta.map((g) => ({ ...g, icon: groupIcons[g.id] }))
export type { Group }

export type Doc = DocMeta & { Demo: ComponentType; code: string }

/* ---------- Cam ---------- */

function GlassDemo() {
  const [bg, setBg] = useState<Backdrop>('lines')
  const [refract, setRefract] = useState(true)
  const stage = useRef<HTMLDivElement>(null)
  return (
    <>
      <div className="demo-controls">
        <Segmented
          label="Zemin"
          size="sm"
          value={bg}
          onChange={setBg}
          options={[
            { value: 'lines', label: 'Çizgi' },
            { value: 'color', label: 'Renk' },
            { value: 'type', label: 'Yazı' },
          ]}
        />
        <Switch checked={refract && refractionSupported} onChange={setRefract} disabled={!refractionSupported}>
          Kırılma
        </Switch>
      </div>
      <Stage ref={stage} backdrop={bg} tall>
        <motion.div className="drag" drag dragConstraints={stage} dragElastic={0.12} whileDrag={{ scale: 1.04 }}>
          <Glass refract={refract} interactive className="glass-pane">
            <span className="glass-pane-label">regular</span>
            <span className="glass-pane-hint">Sürükle</span>
          </Glass>
        </motion.div>
        <motion.div className="drag" drag dragConstraints={stage} dragElastic={0.12} whileDrag={{ scale: 1.04 }}>
          <Glass refract={refract} variant="clear" className="glass-lens">
            <span className="glass-pane-label">clear</span>
          </Glass>
        </motion.div>
      </Stage>
      {!refractionSupported && <p className="demo-note">Bu tarayıcı SVG backdrop filtresini desteklemiyor; cam, bulanık sürüme düşüyor. Kırılmayı görmek için Chromium tabanlı bir tarayıcıda açın.</p>}
    </>
  )
}

/* ---------- Temel ---------- */

function ButtonDemo() {
  const [busy, setBusy] = useState(false)
  return (
    <Stage backdrop="color">
      <div className="row">
        <Button tone="primary">Kaydet</Button>
        <Button>İkincil</Button>
        <Button tone="quiet">Sessiz</Button>
        <Button tone="danger">Sil</Button>
        <Button tone="glass">Cam</Button>
      </div>
      <div className="row">
        <Button size="sm">Küçük</Button>
        <Button size="lg" tone="primary">
          <Ico.Plus size={17} /> Büyük
        </Button>
        <Button
          busy={busy}
          onClick={() => {
            setBusy(true)
            setTimeout(() => setBusy(false), 1400)
          }}
        >
          {busy ? 'Gönderiliyor' : 'Gönder'}
        </Button>
      </div>
    </Stage>
  )
}

function IconButtonDemo() {
  return (
    <Stage backdrop="color">
      <div className="row">
        <IconButton label="Düzenle">
          <Ico.Pencil />
        </IconButton>
        <IconButton label="Paylaş" tone="secondary">
          <Ico.Share />
        </IconButton>
        <IconButton label="Bildirimler" tone="glass" size="lg">
          <Ico.Bell />
        </IconButton>
      </div>
    </Stage>
  )
}

function FieldDemo() {
  const [mail, setMail] = useState('deniz@')
  const bad = mail.length > 0 && !/^\S+@\S+\.\S+$/.test(mail)
  return (
    <Stage>
      <div className="stack form">
        <Field label="Ad">
          <Input placeholder="Ada Lovelace" />
        </Field>
        <Field label="E-posta" hint="Yalnızca bildirimler için." error={bad ? 'Geçerli bir adres girin.' : undefined}>
          <Input type="email" value={mail} onChange={(e) => setMail(e.target.value)} />
        </Field>
        <Field label="Not">
          <Textarea placeholder="Kısa bir açıklama" />
        </Field>
      </div>
    </Stage>
  )
}

function CheckboxDemo() {
  const [items, setItems] = useState([
    { t: 'Taslağı yaz', on: true },
    { t: 'Gözden geçir', on: false },
    { t: 'Yayınla', on: false },
  ])
  return (
    <Stage>
      <div className="stack">
        {items.map((it, i) => (
          <Checkbox key={it.t} checked={it.on} onChange={(on) => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, on } : x)))}>
            {it.t}
          </Checkbox>
        ))}
      </div>
    </Stage>
  )
}

function SwitchDemo() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  return (
    <Stage>
      <div className="stack narrow">
        <Switch checked={a} onChange={setA}>
          Wi-Fi
        </Switch>
        <Switch checked={b} onChange={setB}>
          Uçak modu
        </Switch>
        <Switch checked={false} onChange={() => {}} disabled>
          Kapalı (devre dışı)
        </Switch>
      </div>
    </Stage>
  )
}

function SliderDemo() {
  const [v, setV] = useState(64)
  return (
    <Stage>
      <div className="stack narrow">
        <div className="slider-row">
          <Ico.Sun size={16} />
          <Slider label="Parlaklık" value={v} onChange={setV} />
          <span className="mono dim">{v}</span>
        </div>
      </div>
    </Stage>
  )
}

function SegmentedDemo() {
  const [v, setV] = useState('week')
  return (
    <Stage>
      <Segmented
        label="Aralık"
        value={v}
        onChange={setV}
        options={[
          { value: 'day', label: 'Gün' },
          { value: 'week', label: 'Hafta' },
          { value: 'month', label: 'Ay' },
          { value: 'year', label: 'Yıl' },
        ]}
      />
    </Stage>
  )
}

function PillDemo() {
  return (
    <Stage>
      <div className="row">
        <Pill tone="green">Yayında</Pill>
        <Pill tone="yellow">Taslak</Pill>
        <Pill tone="red">Gecikti</Pill>
        <Pill tone="cyan">Yeni</Pill>
        <Pill>Arşiv</Pill>
      </div>
      <div className="row dim small">
        Aramak için <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </div>
    </Stage>
  )
}

const people = [{ name: 'Deniz Kaya' }, { name: 'Ada Lovelace' }, { name: 'Grace Hopper' }, { name: 'Alan Turing' }, { name: 'Edsger Dijkstra' }, { name: 'Barbara Liskov' }]

function AvatarDemo() {
  return (
    <Stage>
      <div className="row">
        <Avatar name="Deniz Kaya" size={44} />
        <Avatar name="Ada Lovelace" size={36} />
        <Avatar name="Grace Hopper" />
        <AvatarStack people={people} />
      </div>
    </Stage>
  )
}

function SpinnerDemo() {
  return (
    <Stage>
      <div className="row dim">
        <Spinner />
        <Spinner size={22} />
        <span className="row small">
          <Spinner size={14} label="Yükleniyor" /> Yükleniyor
        </span>
      </div>
    </Stage>
  )
}

/* ---------- Katmanlar ---------- */

function DialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Stage backdrop="color">
      <Button tone="primary" onClick={() => setOpen(true)}>
        Proje oluştur
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni proje"
        description="Ekibin görebileceği bir çalışma alanı."
        closeLabel="Kapat"
        footer={
          <>
            <Button tone="quiet" onClick={() => setOpen(false)}>
              Vazgeç
            </Button>
            <Button
              tone="primary"
              onClick={() => {
                setOpen(false)
                toast('Proje oluşturuldu')
              }}
            >
              Oluştur
            </Button>
          </>
        }
      >
        <div className="stack">
          <Field label="Ad">
            <Input placeholder="Megaron" />
          </Field>
          <Field label="Açıklama">
            <Textarea rows={2} />
          </Field>
        </div>
      </Dialog>
    </Stage>
  )
}

function ConfirmDemo() {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  return (
    <Stage backdrop="color">
      <Button tone="danger" onClick={() => setOpen(true)}>
        <Ico.Trash size={16} /> Projeyi sil
      </Button>
      <Confirm
        open={open}
        onClose={() => setOpen(false)}
        title="Proje silinsin mi?"
        danger
        busy={busy}
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
        onConfirm={() => {
          setBusy(true)
          setTimeout(() => {
            setBusy(false)
            setOpen(false)
            toast({ title: 'Proje silindi', tone: 'info', action: { label: 'Geri al', onClick: () => toast('Geri alındı') } })
          }, 900)
        }}
      >
        Tüm görevler ve dosyalar kalıcı olarak silinir.
      </Confirm>
    </Stage>
  )
}

function SheetDemo() {
  const [side, setSide] = useState<'bottom' | 'right' | null>(null)
  const [wifi, setWifi] = useState(true)
  return (
    <Stage backdrop="color">
      <div className="row">
        <Button onClick={() => setSide('bottom')}>Alttan aç</Button>
        <Button onClick={() => setSide('right')}>Yandan aç</Button>
      </div>
      <Sheet open={side !== null} side={side ?? 'bottom'} onClose={() => setSide(null)} label="Ayarlar" closeLabel="Kapat">
        <div className="stack">
          <p className="dim">{side === 'bottom' ? 'Tutamaktan aşağı çekerek kapatabilirsiniz.' : 'Escape ya da dışarı tıklamak kapatır.'}</p>
          <List>
            <Row icon={<Ico.Wifi size={16} />} tone="cyan" title="Wi-Fi" trailing={<Switch checked={wifi} onChange={setWifi} label="Wi-Fi" />} />
            <Row icon={<Ico.Bell size={16} />} tone="red" title="Bildirimler" onClick={() => {}} />
            <Row icon={<Ico.Lock size={16} />} tone="green" title="Gizlilik" onClick={() => {}} />
          </List>
        </div>
      </Sheet>
    </Stage>
  )
}

function PopoverDemo() {
  const [open, setOpen] = useState(false)
  const anchor = useRef<HTMLButtonElement>(null)
  return (
    <Stage backdrop="color">
      <Button ref={anchor} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        Paylaş
      </Button>
      <Popover open={open} onClose={() => setOpen(false)} anchor={anchor}>
        <div className="pop-body">
          <p className="pop-title">Bağlantıyla paylaş</p>
          <Input readOnly value="noir.app/p/8f2a" onFocus={(e) => e.target.select()} />
          <Button
            tone="primary"
            size="sm"
            onClick={() => {
              setOpen(false)
              toast('Bağlantı kopyalandı')
            }}
          >
            Kopyala
          </Button>
        </div>
      </Popover>
    </Stage>
  )
}

function MenuDemo() {
  return (
    <Stage backdrop="color">
      <Menu
        label="Dosya işlemleri"
        trigger={<Button>Seçenekler</Button>}
        items={[
          { label: 'Düzenle', icon: <Ico.Pencil size={16} />, hint: '⌘E', onSelect: () => toast('Düzenle') },
          { label: 'Paylaş', icon: <Ico.Share size={16} />, onSelect: () => toast('Paylaş') },
          { label: 'Taşı', icon: <Ico.Folder size={16} />, disabled: true },
          'separator',
          { label: 'Sil', icon: <Ico.Trash size={16} />, danger: true, onSelect: () => toast.error('Silindi') },
        ]}
      />
    </Stage>
  )
}

function TooltipDemo() {
  return (
    <Stage backdrop="color">
      <div className="row">
        <Tooltip content="Düzenle">
          <IconButton label="Düzenle" tone="secondary">
            <Ico.Pencil />
          </IconButton>
        </Tooltip>
        <Tooltip content="Bağlantıyı paylaş">
          <IconButton label="Paylaş" tone="secondary">
            <Ico.Share />
          </IconButton>
        </Tooltip>
      </div>
    </Stage>
  )
}

function ToastDemo() {
  return (
    <Stage backdrop="color">
      <div className="row">
        <Button onClick={() => toast('Değişiklikler kaydedildi')}>Başarılı</Button>
        <Button onClick={() => toast({ title: 'Ada sizi andı', body: '“Taslak hazır, bakabilir misin?”', tone: 'info' })}>Bilgi</Button>
        <Button onClick={() => toast.error('Yüklenemedi', 'Dosya 10 MB sınırını aşıyor.')}>Hata</Button>
      </div>
    </Stage>
  )
}

/* ---------- Navigasyon ---------- */

function TabBarDemo() {
  const [tab, setTab] = useState('home')
  const [compact, setCompact] = useState(false)
  return (
    <>
      <div className="demo-controls">
        <Switch checked={compact} onChange={setCompact}>
          Kompakt
        </Switch>
      </div>
      <Stage backdrop="type">
        <TabBar
          value={tab}
          onChange={setTab}
          compact={compact}
          items={[
            { value: 'home', label: 'Ana sayfa', icon: <Ico.Home size={20} /> },
            { value: 'inbox', label: 'Gelen', icon: <Ico.Inbox size={20} /> },
            { value: 'search', label: 'Ara', icon: <Ico.Search size={20} /> },
            { value: 'me', label: 'Profil', icon: <Ico.User size={20} /> },
          ]}
        />
      </Stage>
    </>
  )
}

function ToolbarDemo() {
  return (
    <Stage backdrop="type">
      <div className="wide">
        <Toolbar
          leading={
            <IconButton label="Geri">
              <Ico.Back />
            </IconButton>
          }
          title="Tasarım incelemesi"
          trailing={
            <>
              <IconButton label="Paylaş">
                <Ico.Share />
              </IconButton>
              <Button tone="primary" size="sm">
                Yayınla
              </Button>
            </>
          }
        />
      </div>
    </Stage>
  )
}

function TabsDemo() {
  return (
    <Stage center={false}>
      <Tabs
        label="Proje"
        items={[
          { value: 'tasks', label: 'Görevler', content: <Note text="12 açık görev, 3'ü bu hafta bitiyor." /> },
          { value: 'docs', label: 'Belgeler', content: <Note text="Son düzenlenen: Yol haritası, 2 saat önce." /> },
          { value: 'chat', label: 'Sohbet', content: <Note text="Ada: Toplantıyı yarına alalım mı?" /> },
        ]}
      />
    </Stage>
  )
}
const Note = ({ text }: { text: string }) => <p className="dim">{text}</p>

function PaletteDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Stage backdrop="color">
      <Button onClick={() => setOpen(true)}>
        <Ico.Search size={16} /> Komut ara
      </Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        placeholder="Bir komut yazın…"
        empty="Sonuç yok"
        commands={[
          { id: 'new', label: 'Yeni görev', group: 'Oluştur', icon: <Ico.Plus size={16} />, hint: 'N', onSelect: () => toast('Yeni görev') },
          { id: 'doc', label: 'Yeni belge', group: 'Oluştur', icon: <Ico.Pencil size={16} />, onSelect: () => toast('Yeni belge') },
          { id: 'inbox', label: 'Gelen kutusuna git', group: 'Git', icon: <Ico.Inbox size={16} />, hint: 'G I', onSelect: () => toast('Gelen kutusu') },
          { id: 'profile', label: 'Profil', group: 'Git', icon: <Ico.User size={16} />, onSelect: () => toast('Profil') },
          { id: 'lock', label: 'Oturumu kilitle', group: 'Hesap', icon: <Ico.Lock size={16} />, onSelect: () => toast('Kilitlendi') },
        ]}
      />
    </Stage>
  )
}

/* ---------- İçerik ---------- */

function CardDemo() {
  return (
    <Stage>
      <div className="cards">
        <Card title="Yol haritası" description="Güncellendi: 2 saat önce" actions={<Pill tone="green">Aktif</Pill>}>
          <Progress value={0.62} label="İlerleme" />
        </Card>
        <Card interactive title="Ekip" description="6 kişi">
          <AvatarStack people={people} size={26} />
        </Card>
      </div>
    </Stage>
  )
}

function ListDemo() {
  const [n, setN] = useState(true)
  return (
    <Stage>
      <div className="narrow">
        <List header="Hesap" footer="Bildirimler cihazlarınız arasında eşitlenir.">
          <Row icon={<Ico.User size={16} />} tone="cyan" title="Profil" subtitle="deniz@ornek.com" onClick={() => {}} />
          <Row icon={<Ico.Bell size={16} />} tone="red" title="Bildirimler" trailing={<Switch checked={n} onChange={setN} label="Bildirimler" />} />
          <Row icon={<Ico.Lock size={16} />} tone="green" title="Parola" trailing="3 ay önce" onClick={() => {}} />
        </List>
      </div>
    </Stage>
  )
}

function EmptyDemo() {
  return (
    <Stage>
      <div className="narrow">
        <Empty
          icon={<Ico.Inbox size={28} />}
          title="Gelen kutusu boş"
          action={
            <Button size="sm" tone="primary">
              Görev ekle
            </Button>
          }
        >
          Size atanan görevler ve bahsedilmeler burada görünür.
        </Empty>
      </div>
    </Stage>
  )
}

function SkeletonDemo() {
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      <div className="demo-controls">
        <Switch checked={loaded} onChange={setLoaded}>
          Yüklendi
        </Switch>
      </div>
      <Stage>
        <div className="narrow">
          <div className="person">
            {loaded ? <Avatar name="Ada Lovelace" size={40} /> : <Skeleton circle height={40} />}
            <div className="grow">{loaded ? <p className="person-text">Ada Lovelace taslağı onayladı. Yayına almadan önce son bir okuma yapalım.</p> : <SkeletonText lines={2} />}</div>
          </div>
        </div>
      </Stage>
    </>
  )
}

function ProgressDemo() {
  const [v, setV] = useState(0.35)
  return (
    <Stage>
      <div className="stack narrow">
        <Progress value={v} label="Yükleme" />
        <Progress label="Hazırlanıyor" />
        <div className="row">
          <ProgressRing value={v} label="Yükleme" />
          <Button size="sm" onClick={() => setV((x) => (x >= 1 ? 0 : Math.min(1, x + 0.2)))}>
            İlerlet
          </Button>
          <span className="mono dim small">{Math.round(v * 100)}%</span>
        </div>
      </div>
    </Stage>
  )
}

/* ---------- Kayıt ---------- */

const demos: Record<string, { Demo: ComponentType; code: string }> = {
  'glass': {
    Demo: GlassDemo,
    code: `<Glass interactive>…</Glass>
<Glass variant="clear" refract={{ strength: 30, bezel: 24 }}>…</Glass>

// Kendi elemanınıza:
const ref = useRef(null)
useRefraction(ref, { blur: 6, strength: 22 })`,
  },
  'button': {
    Demo: ButtonDemo,
    code: `<Button tone="primary">Kaydet</Button>
<Button tone="glass">Cam</Button>
<Button busy={saving}>Gönder</Button>`,
  },
  'icon-button': {
    Demo: IconButtonDemo,
    code: `<IconButton label="Düzenle"><PencilIcon /></IconButton>
<IconButton label="Bildirimler" tone="glass" size="lg"><BellIcon /></IconButton>`,
  },
  'field': {
    Demo: FieldDemo,
    code: `<Field label="E-posta" hint="Yalnızca bildirimler için." error={err}>
  <Input type="email" value={mail} onChange={…} />
</Field>`,
  },
  'checkbox': {
    Demo: CheckboxDemo,
    code: `<Checkbox checked={done} onChange={setDone}>Taslağı yaz</Checkbox>`,
  },
  'switch': {
    Demo: SwitchDemo,
    code: `<Switch checked={wifi} onChange={setWifi}>Wi-Fi</Switch>`,
  },
  'slider': {
    Demo: SliderDemo,
    code: `<Slider label="Parlaklık" value={v} onChange={setV} />`,
  },
  'segmented': {
    Demo: SegmentedDemo,
    code: `<Segmented
  label="Aralık"
  value={range}
  onChange={setRange}
  options={[{ value: 'day', label: 'Gün' }, { value: 'week', label: 'Hafta' }]}
/>`,
  },
  'pill': {
    Demo: PillDemo,
    code: `<Pill tone="green">Yayında</Pill>
<Kbd>⌘</Kbd><Kbd>K</Kbd>`,
  },
  'avatar': {
    Demo: AvatarDemo,
    code: `<Avatar name="Ada Lovelace" src={url} size={36} />
<AvatarStack people={team} max={4} />`,
  },
  'spinner': {
    Demo: SpinnerDemo,
    code: `<Spinner size={14} label="Yükleniyor" />`,
  },
  'dialog': {
    Demo: DialogDemo,
    code: `<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Yeni proje"
  footer={<Button tone="primary">Oluştur</Button>}
>
  …
</Dialog>`,
  },
  'confirm': {
    Demo: ConfirmDemo,
    code: `<Confirm
  open={open} onClose={close} onConfirm={remove}
  title="Proje silinsin mi?" danger busy={busy}
  confirmLabel="Sil" cancelLabel="Vazgeç"
>
  Tüm görevler kalıcı olarak silinir.
</Confirm>`,
  },
  'sheet': {
    Demo: SheetDemo,
    code: `<Sheet open={open} onClose={close} label="Ayarlar" side="bottom">
  …
</Sheet>`,
  },
  'popover': {
    Demo: PopoverDemo,
    code: `const anchor = useRef(null)

<Button ref={anchor} onClick={toggle}>Paylaş</Button>
<Popover open={open} onClose={close} anchor={anchor}>…</Popover>`,
  },
  'menu': {
    Demo: MenuDemo,
    code: `<Menu
  trigger={<Button>Seçenekler</Button>}
  items={[
    { label: 'Düzenle', hint: '⌘E', onSelect: edit },
    'separator',
    { label: 'Sil', danger: true, onSelect: remove },
  ]}
/>`,
  },
  'tooltip': {
    Demo: TooltipDemo,
    code: `<Tooltip content="Düzenle">
  <IconButton label="Düzenle"><PencilIcon /></IconButton>
</Tooltip>`,
  },
  'toast': {
    Demo: ToastDemo,
    code: `// Bir kez:
<Toaster />

toast('Kaydedildi')
toast.error('Yüklenemedi', 'Dosya çok büyük.')
toast({ title: 'Silindi', action: { label: 'Geri al', onClick: undo } })`,
  },
  'tabbar': {
    Demo: TabBarDemo,
    code: `<TabBar
  value={tab}
  onChange={setTab}
  compact={scrollingDown}
  items={[{ value: 'home', label: 'Ana sayfa', icon: <HomeIcon /> }, …]}
/>`,
  },
  'toolbar': {
    Demo: ToolbarDemo,
    code: `<Toolbar
  sticky
  leading={<IconButton label="Geri"><BackIcon /></IconButton>}
  title="Tasarım incelemesi"
  trailing={<Button tone="primary" size="sm">Yayınla</Button>}
/>`,
  },
  'tabs': {
    Demo: TabsDemo,
    code: `<Tabs
  items={[
    { value: 'tasks', label: 'Görevler', content: <Tasks /> },
    { value: 'docs', label: 'Belgeler', content: <Docs /> },
  ]}
/>`,
  },
  'command-palette': {
    Demo: PaletteDemo,
    code: `<CommandPalette
  open={open}
  onClose={close}
  commands={[{ id: 'new', label: 'Yeni görev', group: 'Oluştur', onSelect: create }]}
/>`,
  },
  'card': {
    Demo: CardDemo,
    code: `<Card title="Yol haritası" description="2 saat önce" actions={<Pill>Aktif</Pill>}>
  …
</Card>`,
  },
  'list': {
    Demo: ListDemo,
    code: `<List header="Hesap">
  <Row icon={<UserIcon />} tone="cyan" title="Profil" onClick={open} />
  <Row title="Bildirimler" trailing={<Switch … />} />
</List>`,
  },
  'empty': {
    Demo: EmptyDemo,
    code: `<Empty icon={<InboxIcon />} title="Gelen kutusu boş" action={<Button>Görev ekle</Button>}>
  Size atanan görevler burada görünür.
</Empty>`,
  },
  'skeleton': {
    Demo: SkeletonDemo,
    code: `{loading ? <SkeletonText lines={2} /> : <p>{text}</p>}
<Skeleton circle height={40} />`,
  },
  'progress': {
    Demo: ProgressDemo,
    code: `<Progress value={0.4} label="Yükleme" />
<Progress label="Hazırlanıyor" />
<ProgressRing value={0.4} label="Yükleme" />`,
  },
}

export const docs: Doc[] = docMeta.map((m) => ({ ...m, ...demos[m.id] }))
