window.__ModuleLoader__.load({
  id: 'dsh-wakamo-pet',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'tachibana-pet'
    const ASPECT = 2179 / 2860
    const SIZES = [320, 460, 600, 760]
    const MIN_SIZE = 220
    const MAX_SIZE = 760
    const DEFAULT_SIZE = 520
    const SIZE_KEY = 'tachibana-pet:size'
    const POS_KEY = 'tachibana-pet:position'
    const GREET_KEY = 'tachibana-pet:greeted'
    const INTRO_KEY = 'tachibana-pet:introduced'
    const SOUND_KEY = 'tachibana-pet:sound'

    const REACTIONS = [
      { key: 'line.serve', face: 's2_13', voice: 'serve' },
      { key: 'line.mask', face: 's2_12', voice: 'mask' },
      { key: 'line.unmask', face: 's2_12', voice: 'unmask' },
      { key: 'line.stare', face: 's2_12', voice: 'stare' },
      { key: 'line.satisfied', face: 's2_13', voice: 'satisfied' },
      { key: 'line.watching', face: 's2_13', voice: 'watching' },
      { key: 'line.victory', face: 's2_13', voice: 'victory' },
      { key: 'line.close', face: 's2_12', voice: 'close' },
      { key: 'line.beside', face: 's2_01', voice: 'beside' },
    ]
    const ANNOYED = { key: 'line.end', face: 's2_09', voice: 'end' }
    const GREETING = { key: 'line.login', face: 's2_01', voice: 'login' }
    const FIRST_GREETING = { key: 'line.intro', face: 's2_01' }
    const SIZE_LINE = { key: 'line.size', face: 's2_12', voice: 'size' }
    const HEADPAT = { key: 'line.headpat', face: 's2_12', voice: 'headpat' }
    const HEADPAT_LONG = { key: 'line.headpatLong', face: 's2_13', voice: 'headpatLong' }
    const HEADPAT_LINES = [
      HEADPAT,
      { key: 'line.touch', face: 's2_12', voice: 'touch' },
      { key: 'line.thanks', face: 's2_13', voice: 'thanks' },
    ]
    const MOVE_LINE = { key: 'line.move', face: 's2_01', voice: 'move' }
    const IDLE_LINES = [
      { key: 'line.summer', face: 's2_01', voice: 'summer' },
      { key: 'line.walk', face: 's2_01', voice: 'walk' },
      { key: 'line.prepared', face: 's2_12', voice: 'prepared' },
      { key: 'line.dontLeave', face: 's2_12', voice: 'dontLeave' },
      { key: 'line.cool', face: 's2_01', voice: 'cool' },
      { key: 'line.beside', face: 's2_13', voice: 'beside' },
    ]

    const EN = {
      name: 'Wakamo',
      size: 'Cycle preset size',
      resize: 'Drag to resize',
      mute: 'Mute voice',
      unmute: 'Unmute voice',
      'line.login':
        'Welcome back, Sensei. I, Wakamo, have been waiting for you with a longing that makes one day feel like three autumns. ♥',
      'line.intro': 'Ohoho, I, Wakamo, have arrived. My dearest Sensei. ♥',
      'line.serve': 'You may command me to do anything. Yes — literally, anything. ♥',
      'line.mask':
        'You ask whether wearing a mask in summer is stifling...? Fufu, it is fine. This one is a custom-made summer edition. ♥',
      'line.unmask':
        'Of course, if my dear Sensei wishes to see... I, Wakamo, would not mind removing it... Ufufu, what will you do?',
      'line.stare':
        'I-if you stare at me like that... even I... right now, I feel a little... embarrassed...',
      'line.prepared':
        'It is a rare summer, after all... In that case, Sensei, I, Wakamo, have resolved myself. As long as I am with you, no matter what you see of me, I...!',
      'line.dontLeave':
        'Whether under the scorching summer sun or in the freezing winter water... I will never leave your side. So please do not leave me this summer either. My dearest Sensei. ♥',
      'line.satisfied': 'Fufu, Sensei, are you satisfied?',
      'line.end': 'It is about time we ended this.',
      'line.watching':
        'I feel like someone is watching me... Could it be you, Sensei...? Fufufu ♥',
      'line.victory': 'What a delightful victory, fufu ♥',
      'line.size': 'I want Sensei to see me in this outfit soon...',
      'line.headpat': 'Fufu... so warm...',
      'line.headpatLong': 'Sensei... Sensei...! My dearest Sensei! How can I express these overflowing feelings?',
      'line.touch': 'When you touch me so suddenly...',
      'line.move': 'Shall we move somewhere else?',
      'line.cool': 'It is cool here... fufu.',
      'line.thanks': 'Fufu, thank you very much.',
      'line.beside': 'Please stay by my side. I am right here, and I am not going anywhere.',
      'line.close': 'Sensei, may I come a little closer? ...As close as I like? Ah...!',
      'line.summer':
        'Once summer arrives, everyone becomes relaxed and their hearts flutter... In that case, it would not be strange if anything happened, would it? Fufu...',
      'line.walk':
        'I wanted to take a walk with you, Sensei... but with this heat, it seems better to wait until the sun sets.',
    }

    const ZH = {
      name: '若藻',
      size: '切换预设大小',
      resize: '拖动调整大小',
      mute: '关闭语音',
      unmute: '开启语音',
      'line.login': '老师，欢迎回来。若藻我正怀着一日三秋般的思念等待着您♥',
      'line.intro': '哦嗬嗬，若藻我也过来了。亲·爱·的·老·师·♡',
      'line.serve': '您可以吩咐我做任何事。对，就是字面意思，“任何事”♥',
      'line.mask':
        '您问夏天带着面具，会不会很闷热……？呵呵，没关系。这是我特别订制的夏日专用版哦♥',
      'line.unmask':
        '当然，如果亲爱的老师想看……若藻我可以取下面具哦…………呵呵呵，怎么样，要看看吗？',
      'line.stare':
        '您……您这样直勾勾地看着，就算是我，现在也……也感觉有点……难为情……',
      'line.prepared':
        '毕竟是难得的夏天……既然如此……老师，若藻我已经做好心理准备了，只要是和您在一起，无论让您看到我的什么样子，我都……！',
      'line.dontLeave':
        '不管是在酷暑的烈日下，还是在寒冬的冰水中……我都会和您形影不离。所以在这个盛夏里，也请您不要离开我哦。亲·爱·的·老·师·♥',
      'line.satisfied': '呵呵，老师，你满意了吗？',
      'line.end': '差不多该结束了吧。',
      'line.watching': '总感觉有人看着我……难道是老师……？呵呵呵♥',
      'line.victory': '真是让人愉快的胜利呀，呵呵♥',
      'line.size': '嗯……好想让老师快点看到我这身打扮……',
      'line.headpat': '呵呵，好暖和啊……',
      'line.headpatLong': '老师……老师……！亲·爱·的·老·师·♥老师……若藻我该怎么才能表达这种满溢而出的感情呢？',
      'line.touch': '您这样突然触碰我的话……',
      'line.move': '换个地方吧。',
      'line.cool': '这里很凉爽呢，呵呵♥',
      'line.thanks': '呵呵，非常感谢。',
      'line.beside': '好啦，请继续陪在我身边吧。我就在这里，哪儿也不去。',
      'line.close': '老师，我能再多靠近您一点吗？……嗯？靠多近都没关系吗？啊，啊啊……？！',
      'line.summer':
        '只要到了夏天，大家都会变得放松，心情也会变得亢奋……这样的话，不管发生什么，都不会觉得奇怪吧？呵呵……',
      'line.walk':
        '难得想和老师一起出去散步。但天气这么炎热，还是先等到太阳落山吧。',
    }

    const CSS = `
      .tp-root {
        position: fixed;
        z-index: 30;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
        will-change: transform;
        color: var(--dsw-alias-label-primary);
      }
      .tp-root[data-anchored="true"] { right: 28px; bottom: 8px; }
      .tp-stage {
        position: absolute;
        inset: 0;
        animation: tp-enter .55s cubic-bezier(.2,.8,.2,1) both;
      }
      .tp-ground {
        position: absolute;
        left: 14%;
        right: 14%;
        bottom: -2px;
        height: 9%;
        border-radius: 50%;
        background: radial-gradient(ellipse at center, rgba(28,14,44,.34) 0%, rgba(28,14,44,.16) 45%, rgba(28,14,44,0) 72%);
        filter: blur(7px);
        opacity: .6;
        pointer-events: none;
        transition: opacity .18s ease;
      }
      .tp-root[data-jumping="true"] .tp-ground { opacity: 0; }
      .tp-root[data-falling="true"] .tp-ground { opacity: 0; }
      .tp-figure {
        position: absolute;
        inset: 0;
        display: block;
        pointer-events: auto;
        cursor: grab;
        touch-action: none;
        outline: none;
        -webkit-tap-highlight-color: transparent;
      }
      .tp-root[data-dragging="true"] .tp-figure { cursor: grabbing; }
      .tp-root[data-spring="true"] .tp-figure { cursor: ns-resize; }
      .tp-root[data-spring="true"] .tp-stack { animation: none !important; }
      .tp-hand {
        position: absolute;
        left: 33%;
        top: 1%;
        width: 32%;
        aspect-ratio: 1;
        pointer-events: none;
        filter: drop-shadow(0 7px 8px rgba(30,10,40,.22));
        -webkit-mask-image: linear-gradient(to right, transparent 0, #000 14%);
        mask-image: linear-gradient(to right, transparent 0, #000 14%);
        animation: tp-hand-bob .62s ease-in-out infinite;
        transform-origin: 50% 10%;
      }
      .tp-hand-frame {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        image-rendering: pixelated;
        -webkit-user-drag: none;
        user-select: none;
      }
      @keyframes tp-hand-bob {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      .tp-root[data-petting="true"] .tp-stack {
        animation: tp-squish .62s ease-in-out infinite;
        transform-origin: 50% 100%;
      }
      @keyframes tp-squish {
        0%, 100% { transform: scale(1, 1) translateY(0); }
        50% { transform: scale(1.015, .96) translateY(.8%); }
      }
      .tp-figure:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 4px;
        border-radius: 18px;
      }
      .tp-stack {
        position: absolute;
        inset: 0;
        transform-origin: 50% 100%;
        animation: tp-breathe 6.8s ease-in-out infinite;
        will-change: transform;
      }
      .tp-image {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center bottom;
        -webkit-user-drag: none;
        user-select: none;
        opacity: 0;
        transition: none;
      }
      .tp-image[data-active="true"][data-ready="true"] { opacity: 1; }
      .tp-eye-blink {
        position: absolute;
        left: 47.73%;
        top: 19.93%;
        width: 16.52%;
        height: 5.24%;
        object-fit: fill;
        pointer-events: none;
        opacity: 0;
        transition: opacity .05s linear;
      }
      .tp-eye-blink[data-on="true"] { opacity: 1; }
      .tp-root[data-dragging="true"] .tp-stack,
      .tp-root[data-resizing="true"] .tp-stack { animation-play-state: paused; }
      .tp-resize {
        position: absolute;
        left: 4px;
        top: 4px;
        z-index: 2;
        display: grid;
        place-items: center;
        width: 26px;
        height: 26px;
        padding: 0;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 9px;
        background: var(--dsw-alias-bg-overlay);
        box-shadow: 0 4px 14px rgba(20,12,40,.14);
        color: var(--dsw-alias-label-secondary);
        cursor: nwse-resize;
        opacity: .55;
        transform: scale(.92);
        transition: opacity .16s ease, transform .16s ease;
        pointer-events: auto;
        touch-action: none;
      }
      .tp-root:hover .tp-resize,
      .tp-root:focus-within .tp-resize,
      .tp-root[data-resizing="true"] .tp-resize {
        opacity: 1;
        transform: none;
      }
      .tp-resize:hover {
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-bg-layer-1);
      }
      .tp-resize:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 1px;
      }
      .tp-size {
        font-size: 10px;
        font-weight: 500;
        color: var(--dsw-alias-label-secondary);
        font-variant-numeric: tabular-nums;
      }
      .tp-hud {
        position: absolute;
        top: 6px;
        right: 2px;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 3px 4px 3px 9px;
        border-radius: 999px;
        background: var(--dsw-alias-bg-overlay);
        border: 1px solid var(--dsw-alias-border-l1);
        box-shadow: 0 6px 18px rgba(20,12,40,.14);
        opacity: 0;
        transform: translateY(-4px);
        transition: opacity .16s ease, transform .16s ease;
        pointer-events: none;
      }
      .tp-root:hover .tp-hud,
      .tp-root:focus-within .tp-hud,
      .tp-root[data-resizing="true"] .tp-hud {
        opacity: 1;
        transform: none;
        pointer-events: auto;
      }
      .tp-name {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .06em;
        color: var(--dsw-alias-label-secondary);
        white-space: nowrap;
      }
      .tp-petal {
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50% 0 50% 50%;
        transform: rotate(45deg);
        background: linear-gradient(135deg, #f0b3d2, #b985dc);
      }
      .tp-btn {
        display: grid;
        place-items: center;
        width: 21px;
        height: 21px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: var(--dsw-alias-bg-layer-2);
        color: var(--dsw-alias-label-secondary);
        font: 600 10px/1 inherit;
        cursor: pointer;
      }
      .tp-btn:hover {
        background: var(--dsw-alias-bg-layer-1);
        color: var(--dsw-alias-label-primary);
      }
      .tp-btn:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 1px;
      }
      .tp-btn[data-speaking="true"] {
        color: var(--dsw-alias-brand-primary);
        animation: tp-voice .9s ease-in-out infinite;
      }
      @keyframes tp-voice {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.14); }
      }
      .tp-bubble {
        position: absolute;
        left: 50%;
        bottom: calc(100% + 8px);
        width: max-content;
        max-width: min(280px, 76vw);
        box-sizing: border-box;
        padding: 12px 16px;
        border-radius: 8px;
        background: var(--dsw-alias-bg-overlay, #fff);
        border: 1px solid var(--dsw-alias-border-l1, #e3dce1);
        border-top: 2px solid #cb8da7;
        color: var(--dsw-alias-label-primary);
        font-size: 13px;
        line-height: 1.5;
        text-align: center;
        box-shadow: 0 6px 20px rgba(35,24,34,.12);
        overflow-wrap: anywhere;
        pointer-events: none;
        transform: translateX(-50%);
        animation: tp-bubble .22s cubic-bezier(.2,.8,.2,1) both;
      }
      .tp-bubble::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -4px;
        width: 8px;
        height: 8px;
        margin-left: -4px;
        transform: rotate(45deg);
        background: var(--dsw-alias-bg-overlay, #fff);
        border-right: 1px solid var(--dsw-alias-border-l1);
        border-bottom: 1px solid var(--dsw-alias-border-l1);
      }
      .tp-bubble.tp-pricing { width:280px; padding:14px 16px 12px; text-align:left; }
      .tp-pricing-head { display:flex; align-items:center; justify-content:space-between; gap:10px;
        font-size:11px; color:var(--dsw-alias-label-secondary,#6b656d); }
      .tp-pricing-brand { font-weight:600; color:var(--dsw-alias-label-primary,#262229); }
      .tp-pricing-clock { margin:10px 0 8px; font-size:24px; line-height:1.2; font-weight:600;
        font-variant-numeric:tabular-nums; letter-spacing:0; }
      .tp-pricing-clock small { margin-left:8px; font-size:11px; font-weight:400;
        color:var(--dsw-alias-label-secondary,#6b656d); }
      .tp-pricing-state { display:flex; align-items:center; gap:7px; font-size:13px; font-weight:600; }
      .tp-pricing-dot { width:7px; height:7px; border-radius:50%; background:#399b83; flex:none; }
      .tp-pricing[data-period="peak"] .tp-pricing-dot { background:#d69238; }
      .tp-pricing[data-period="unknown"] .tp-pricing-dot { background:#8d8791; }
      .tp-pricing-next { margin-top:10px; padding-top:9px; border-top:1px solid var(--dsw-alias-border-l1,#e7e1e5);
        font-size:12px; font-weight:400; line-height:1.65; }
      .tp-pricing-note { margin-top:7px; font-size:10px; line-height:1.55;
        color:var(--dsw-alias-label-secondary,#777078); }
      @keyframes tp-enter {
        from { opacity: 0; transform: translateY(10px) scale(.985); }
        to { opacity: 1; transform: none; }
      }
      @keyframes tp-breathe {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-0.45%) scale(1.0035); }
      }
      @keyframes tp-bubble {
        from { opacity: 0; transform: translate(-50%, 4px) scale(.96); }
        to { opacity: 1; transform: translate(-50%, 0) scale(1); }
      }
      @media (prefers-reduced-motion: reduce) {
        .tp-stage, .tp-image, .tp-bubble { animation: none !important; }
        .tp-hud { transition: none; }
        .tp-hand { animation: none !important; }
        .tp-root[data-petting="true"] .tp-image { animation: none !important; }
      }    `

    // Pricing rule checked 2026-10-19 against the official DeepSeek pricing page.
    function deepSeekPeriod(timestamp) {
      const date = new Date(timestamp + 8 * 60 * 60 * 1000)
      const year = date.getUTCFullYear()
      if (year !== 2026) return 'unknown'
      const day = date.getUTCDay()
      const md = (date.getUTCMonth() + 1) * 100 + date.getUTCDate()
      const holiday = [
        [101, 103], [215, 223], [404, 406], [501, 505],
        [619, 621], [925, 927], [1001, 1007],
      ].some(([start, end]) => md >= start && md <= end)
      const minute = date.getUTCHours() * 60 + date.getUTCMinutes()
      return !holiday && day >= 1 && day <= 5 &&
        ((minute >= 540 && minute < 720) || (minute >= 840 && minute < 1080))
        ? 'peak' : 'off-peak'
    }

    function deepSeekPeriodMessage(timestamp) {
      const format = (value) => new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
      }).format(new Date(value))
      const period = deepSeekPeriod(timestamp)
      const time = `北京时间 ${format(timestamp)}。`
      if (period === 'unknown') {
        return `${time}当前年份节假日表未更新，暂不能准确判断高峰/空闲时段，请核对 DeepSeek 官方价格页。`
      }
      let next = Math.floor(timestamp / 60000) * 60000 + 60000
      const limit = next + 8 * 24 * 60 * 60000
      while (next < limit && deepSeekPeriod(next) === period) next += 60000
      const change = next < limit && deepSeekPeriod(next) !== 'unknown'
        ? `下次${period === 'peak' ? '转为空闲' : '进入高峰'}：${format(next)}。`
        : '后续时段需核对新年度节假日表。'
      return `${time}DeepSeek 现在是${period === 'peak' ? '高峰时段' : '空闲时段'}。${change}空闲时段价格为高峰的一半。按官方页面 2026-10-19 规则计算。`
    }

    function nextReactionIndex(deck, count, random = Math.random) {
      if (deck.remaining.length === 0) {
        deck.remaining = Array.from({ length: count }, (_, index) => index)
        for (let i = count - 1; i > 0; i -= 1) {
          const j = Math.floor(random() * (i + 1))
          ;[deck.remaining[i], deck.remaining[j]] = [deck.remaining[j], deck.remaining[i]]
        }
        // Draw from the end; avoid repeating the previous round's final line.
        if (count > 1 && deck.remaining[count - 1] === deck.last) {
          const j = Math.floor(random() * (count - 1))
          ;[deck.remaining[j], deck.remaining[count - 1]] =
            [deck.remaining[count - 1], deck.remaining[j]]
        }
      }
      deck.last = deck.remaining.pop()
      return deck.last
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max)
    }

    function readSize() {
      try {
        const raw = Number(localStorage.getItem(SIZE_KEY))
        if (Number.isFinite(raw) && raw > 0) return clamp(Math.round(raw), MIN_SIZE, MAX_SIZE)
      } catch {}
      return DEFAULT_SIZE
    }

    function saveSize(size) {
      try {
        localStorage.setItem(SIZE_KEY, String(size))
      } catch {}
    }

    function readPos() {
      try {
        const raw = localStorage.getItem(POS_KEY)
        if (!raw) return null
        const value = JSON.parse(raw)
        if (value && Number.isFinite(value.left) && Number.isFinite(value.top)) {
          return { left: value.left, top: value.top }
        }
      } catch {}
      return null
    }

    function savePos(pos) {
      try {
        if (pos) localStorage.setItem(POS_KEY, JSON.stringify(pos))
        else localStorage.removeItem(POS_KEY)
      } catch {}
    }

    function clampPos(pos, size) {
      if (!pos) return null
      const width = Math.round(size * ASPECT)
      return {
        left: clamp(pos.left, 0, Math.max(0, window.innerWidth - width)),
        top: clamp(pos.top, 0, Math.max(0, window.innerHeight - size)),
      }
    }

    function readSound() {
      try {
        return localStorage.getItem(SOUND_KEY) !== 'off'
      } catch {}
      return true
    }

    function saveSound(on) {
      try {
        localStorage.setItem(SOUND_KEY, on ? 'on' : 'off')
      } catch {}
    }

    function useLocaleRevision(locale) {
      const [revision, setRevision] = React.useState(() => locale.getSnapshot().revision)
      React.useEffect(
        () => locale.subscribe(() => setRevision(locale.getSnapshot().revision)),
        [locale],
      )
      return revision
    }

    function PricingBubble({ timestamp }) {
      const period = deepSeekPeriod(timestamp)
      const date = new Date(timestamp)
      const clock = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
      }).format(date)
      const day = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit',
      }).format(date)
      let next = Math.floor(timestamp / 60000) * 60000 + 60000
      const limit = next + 8 * 24 * 60 * 60000
      if (period !== 'unknown') {
        while (next < limit && deepSeekPeriod(next) === period) next += 60000
      }
      const nextText = period !== 'unknown' && next < limit && deepSeekPeriod(next) !== 'unknown'
        ? `${period === 'peak' ? '转为空闲' : '下次高峰'} · ${new Intl.DateTimeFormat('zh-CN', {
            timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
          }).format(new Date(next))}`
        : '节假日表需更新，请核对官方价格页'
      return h('div', {
        className: 'tp-bubble tp-pricing', role: 'status', 'data-period': period,
        'aria-label': deepSeekPeriodMessage(timestamp),
      },
        h('div', { className: 'tp-pricing-head' },
          h('span', { className: 'tp-pricing-brand' }, 'DeepSeek · 用量时段'),
          h('span', null, day)),
        h('div', { className: 'tp-pricing-clock' }, clock, h('small', null, '北京时间')),
        h('div', { className: 'tp-pricing-state' },
          h('span', { className: 'tp-pricing-dot', 'aria-hidden': true }),
          period === 'peak' ? '当前为高峰时段' : period === 'off-peak' ? '当前为空闲时段' : '当前时段待核实'),
        h('div', { className: 'tp-pricing-next' }, nextText),
        h('div', { className: 'tp-pricing-note' },
          '空闲价格为高峰的 ½ · 本地规则计算',
          h('br'), '规则核对于 2026-10-19 · 节假日表：2026'),
      )
    }

    // FILE_TOOLS_COMPONENT

    const FrameLayers = React.memo(function FrameLayers({ ready, face }) {
      return h(React.Fragment, null, Object.keys(ASSETS).map((name) =>
        h('img', {
          key: name,
          className: 'tp-image',
          src: ASSETS[name],
          alt: '',
          draggable: false,
          'data-ready': ready ? 'true' : 'false',
          'data-active': name === face ? 'true' : 'false',
        }),
      ))
    })

    function decodeVoice(ctx, cache, key, clip) {
      if (cache.has(key)) {
        const pending = cache.get(key)
        cache.delete(key)
        cache.set(key, pending)
        return pending
      }
      const pending = Promise.resolve().then(() => {
        const binary = atob(clip)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
        return ctx.decodeAudioData(bytes.buffer)
      }).then((buffer) => {
        // Keep decoded PCM bounded as well as limiting the number of recent clips.
        const bytes = buffer.length * buffer.numberOfChannels * 4
        if (bytes > 8 * 1024 * 1024 && cache.get(key) === pending) cache.delete(key)
        return buffer
      }).catch((error) => {
        if (cache.get(key) === pending) cache.delete(key)
        throw error
      })
      cache.set(key, pending)
      while (cache.size > 3) cache.delete(cache.keys().next().value)
      return pending
    }

    function PetView(props) {
      const locale = props.locale
      const t = locale.bind(NS)
      useLocaleRevision(locale)

      const [ready, setReady] = React.useState(false)
      const [face, setFace] = React.useState('idle')
      const [bubble, setBubble] = React.useState(null)
      const [size, setSize] = React.useState(readSize)
      const [pos, setPos] = React.useState(() => clampPos(readPos(), readSize()))
      const [dragging, setDragging] = React.useState(false)
      const [resizing, setResizing] = React.useState(false)
      const [petting, setPetting] = React.useState(false)
      const [handFrame, setHandFrame] = React.useState(0)
      const [blinking, setBlinking] = React.useState(false)
      const [springing, setSpringing] = React.useState(false)
      const [jumping, setJumping] = React.useState(false)
      const [falling, setFalling] = React.useState(false)
      const [sound, setSound] = React.useState(readSound)
      const [speaking, setSpeaking] = React.useState(false)

      const rootRef = React.useRef(null)
      const figureRef = React.useRef(null)
      const stackRef = React.useRef(null)
      const dragRef = React.useRef(null)
      const resizeRef = React.useRef(null)
      const holdRef = React.useRef(null)
      const pettingRef = React.useRef(false)
      const springRef = React.useRef(null)
      const jumpingRef = React.useRef(false)
      const physicsRef = React.useRef(null)
      const faceRef = React.useRef('idle')
      const posRef = React.useRef(pos)
      const sizeRef = React.useRef(size)
      const soundRef = React.useRef(sound)
      const audioCtxRef = React.useRef(null)
      const sourceRef = React.useRef(null)
      const voiceTokenRef = React.useRef(0)
      const voiceCacheRef = React.useRef(new Map())
      const timers = React.useRef({})
      const pokeLog = React.useRef({ count: 0, last: 0 })
      const reactionDeck = React.useRef({ remaining: [], last: -1 })
      const lastMoveVoice = React.useRef(-Infinity)
      const fileTools = useFileTools(onFileStatus, rootRef)

      function onFileStatus(phase, name) {
        clearTimer('face')
        clearTimer('bubble')
        const faces = { busy: 's2_01', success: 's2_13', done: 's2_13',
          password: 's2_04', error: 's2_07', cancelled: 'idle' }
        const messages = {
          busy: `老师，${name} 交给若藻吧。`,
          success: '这一份已经处理好了。',
          done: '老师，文件都处理好了。',
          password: '老师，这个压缩包需要密码哦。',
          error: '这次没能全部处理好，老师请看看提示。',
          cancelled: '已经停下了，老师。源文件没有改动。',
        }
        setFace(faces[phase] || 'idle')
        setBubble(messages[phase])
        if (phase !== 'busy' && phase !== 'password') {
          schedule('face', () => setFace('idle'), 4000)
          schedule('bubble', () => setBubble(null), 6500)
        }
        if ((phase === 'done' || phase === 'error') && !dragRef.current &&
          !physicsRef.current && !jumpingRef.current && !pettingRef.current &&
          !springRef.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          figureRef.current?.animate?.([
            { transform: 'rotate(0deg)' },
            { transform: `rotate(${phase === 'done' ? -2 : 2}deg)`, offset: 0.4 },
            { transform: 'rotate(0deg)' },
          ], { duration: 500, easing: 'ease-in-out' })
        }
      }

      faceRef.current = face
      posRef.current = pos
      sizeRef.current = size
      soundRef.current = sound

      function clearTimer(key) {
        const id = timers.current[key]
        if (id) {
          clearTimeout(id)
          delete timers.current[key]
        }
      }

      function schedule(key, fn, delay) {
        clearTimer(key)
        timers.current[key] = setTimeout(() => {
          delete timers.current[key]
          fn()
        }, delay)
      }

      function ensureAudioContext() {
        if (audioCtxRef.current) return audioCtxRef.current
        const Ctor = window.AudioContext || window.webkitAudioContext
        if (!Ctor) return null
        audioCtxRef.current = new Ctor()
        return audioCtxRef.current
      }

      function stopVoice() {
        voiceTokenRef.current += 1
        const source = sourceRef.current
        sourceRef.current = null
        if (source) {
          try {
            source.stop()
          } catch {}
          try {
            source.disconnect()
          } catch {}
        }
        setSpeaking(false)
      }

      function playVoice(key, onDuration) {
        if (!soundRef.current) return
        const clip = VOICES[key]
        if (!clip) return
        const ctx = ensureAudioContext()
        if (!ctx) return
        stopVoice()
        const token = voiceTokenRef.current

        const start = () => {
          if (token !== voiceTokenRef.current) return
          try {
            decodeVoice(ctx, voiceCacheRef.current, key, clip)
              .then((buffer) => {
                if (token !== voiceTokenRef.current) return
                const source = ctx.createBufferSource()
                source.buffer = buffer
                source.connect(ctx.destination)
                source.onended = () => {
                  source.disconnect()
                  if (sourceRef.current === source) {
                    sourceRef.current = null
                    setSpeaking(false)
                  }
                }
                sourceRef.current = source
                setSpeaking(true)
                source.start(0)
                if (onDuration) onDuration(buffer.duration)
              })
              .catch(() => {
                if (token === voiceTokenRef.current) setSpeaking(false)
              })
          } catch {
            setSpeaking(false)
          }
        }

        if (ctx.state === 'suspended') {
          ctx
            .resume()
            .then(start)
            .catch(() => setSpeaking(false))
        } else {
          start()
        }
      }

      function toggleSound(event) {
        if (event) event.stopPropagation()
        const next = !soundRef.current
        soundRef.current = next
        setSound(next)
        saveSound(next)
        if (!next) stopVoice()
      }

      function showReaction(reaction, duration) {
        const text = t(reaction.key)
        const ms = duration || Math.min(6500, 2400 + text.length * 55)
        setFace(reaction.face)
        setBubble(text)
        schedule('face', () => setFace('idle'), ms)
        schedule('bubble', () => setBubble(null), ms + 900)
        if (reaction.voice) {
          playVoice(reaction.voice, (seconds) => {
            const total = Math.max(ms, Math.min(18000, seconds * 1000 + 500))
            schedule('face', () => setFace('idle'), total)
            schedule('bubble', () => setBubble(null), total + 700)
          })
        } else {
          stopVoice()
        }
      }

      function clearHold() {
        const hold = holdRef.current
        if (hold && hold.timer) clearTimeout(hold.timer)
        holdRef.current = null
      }

      function beginPetting(pointerId) {
        const hold = holdRef.current
        if (!hold || hold.pointerId !== pointerId) return
        if (dragRef.current && dragRef.current.moved) return
        clearHold()
        dragRef.current = null
        setDragging(false)
        pettingRef.current = true
        setPetting(true)
        showReaction(HEADPAT_LINES[Math.floor(Math.random() * HEADPAT_LINES.length)], 60000)
        schedule('patLong', () => {
          if (!pettingRef.current) return
          setFace(HEADPAT_LONG.face)
          setBubble(t(HEADPAT_LONG.key))
          playVoice(HEADPAT_LONG.voice)
        }, 7000)
      }

      function finishPetting() {
        if (!pettingRef.current) return
        pettingRef.current = false
        setPetting(false)
        clearTimer('patLong')
        schedule('face', () => setFace('idle'), 700)
        schedule('bubble', () => setBubble(null), 1200)
      }

      function playBoing() {
        if (!soundRef.current) return
        const ctx = ensureAudioContext()
        if (!ctx) return
        if (ctx.state === 'suspended') ctx.resume().catch(() => {})
        try {
          const now = ctx.currentTime
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(320, now)
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.32)
          gain.gain.setValueAtTime(0.0001, now)
          gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.42)
        } catch {}
      }

      function startSpring(event) {
        const drag = dragRef.current
        if (!drag) return
        clearHold()
        dragRef.current = null
        setDragging(false)
        clearTimer('springEnd')
        jumpingRef.current = false
        setJumping(false)
        const stack = stackRef.current
        if (stack && typeof stack.getAnimations === 'function') {
          stack.getAnimations().forEach((animation) => animation.cancel())
        }
        if (rootRef.current && typeof rootRef.current.getAnimations === 'function') {
          rootRef.current.getAnimations().forEach((animation) => animation.cancel())
        }
        springRef.current = { pointerId: event.pointerId, startY: drag.y, pull: 0, raf: 0 }
        setSpringing(true)
        if (stack) stack.style.transform = 'scale(1, 1) translateY(0px)'
      }

      function releaseSpring() {
        const spring = springRef.current
        if (spring && spring.raf) cancelAnimationFrame(spring.raf)
        springRef.current = null
        const pull = spring ? spring.pull : 0
        clearTimer('springEnd')
        const stack = stackRef.current
        const root = rootRef.current
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (!reduce && pull > 0.03) {
          const sx = 1 + pull * 0.12
          const sy = 1 - pull * 0.38
          const ty = pull * 8

          const rect = root ? root.getBoundingClientRect() : null
          const peak = rect ? Math.max(0, rect.top - 8) : 0

          jumpingRef.current = true
          setJumping(true)

          if (root && peak > 12 && typeof root.animate === 'function') {
            root.getAnimations().forEach((animation) => animation.cancel())
            root.animate(
              [
                { transform: 'translateY(0px)', offset: 0, easing: 'cubic-bezier(.15,.9,.25,1)' },
                { transform: `translateY(${-peak}px)`, offset: 0.36, easing: 'cubic-bezier(.5,0,.9,.4)' },
                { transform: 'translateY(0px)', offset: 0.66, easing: 'cubic-bezier(.2,.8,.3,1)' },
                { transform: `translateY(${-peak * 0.16}px)`, offset: 0.8, easing: 'cubic-bezier(.5,0,.9,.4)' },
                { transform: 'translateY(0px)', offset: 0.93 },
                { transform: 'translateY(0px)', offset: 1 },
              ],
              { duration: 1200, easing: 'linear', fill: 'forwards' },
            )
          }

          if (stack && typeof stack.animate === 'function') {
            stack.getAnimations().forEach((animation) => animation.cancel())
            stack.animate(
              [
                { transform: `scale(${sx}, ${sy}) translateY(${ty}px)`, offset: 0 },
                { transform: 'scale(.93, 1.1) translateY(0)', offset: 0.16 },
                { transform: 'scale(1, 1.02) translateY(0)', offset: 0.42 },
                { transform: 'scale(1.08, .91) translateY(0)', offset: 0.64 },
                { transform: 'scale(.98, 1.02) translateY(0)', offset: 0.8 },
                { transform: 'scale(1.01, .99) translateY(0)', offset: 0.92 },
                { transform: 'scale(1, 1) translateY(0)', offset: 1 },
              ],
              { duration: 1200, easing: 'linear', fill: 'forwards' },
            )
          }

          stopVoice()
          playBoing()
          schedule('springEnd', () => {
            setSpringing(false)
            setJumping(false)
            jumpingRef.current = false
            if (stack) stack.getAnimations().forEach((animation) => animation.cancel())
            if (stack) stack.style.transform = ''
            if (root) root.getAnimations().forEach((animation) => animation.cancel())
          }, 1220)
        } else {
          setSpringing(false)
          if (stack) stack.style.transform = ''
          setJumping(false)
          jumpingRef.current = false
        }
      }

      function playThud() {
        if (!soundRef.current) return
        const ctx = ensureAudioContext()
        if (!ctx) return
        if (ctx.state === 'suspended') ctx.resume().catch(() => {})
        try {
          const now = ctx.currentTime
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(120, now)
          osc.frequency.exponentialRampToValueAtTime(52, now + 0.18)
          gain.gain.setValueAtTime(0.0001, now)
          gain.gain.exponentialRampToValueAtTime(0.13, now + 0.01)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.22)
        } catch {}
      }

      function squashLanding() {
        const stack = stackRef.current
        if (!stack || typeof stack.animate !== 'function') return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        stack.animate(
          [
            { transform: 'scale(1.06, .92)' },
            { transform: 'scale(.98, 1.02)' },
            { transform: 'scale(1, 1)' },
          ],
          { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' },
        )
      }

      function settlePhysics(state) {
        physicsRef.current = null
        setFalling(false)
        const final = { left: state.x, top: state.y }
        const root = rootRef.current
        if (root) {
          root.style.left = final.left + 'px'
          root.style.top = final.top + 'px'
          root.style.right = 'auto'
          root.style.bottom = 'auto'
          root.style.transform = ''
        }
        setPos(final)
        posRef.current = final
        savePos(final)
      }

      function stepPhysics(now) {
        const state = physicsRef.current
        const root = rootRef.current
        if (!state || !root) return
        let remaining = Math.min(Math.max((now - state.last) / 1000, 0), 0.1)
        state.last = now
        const currentSize = sizeRef.current
        const width = Math.round(currentSize * ASPECT)
        const maxX = Math.max(0, window.innerWidth - width)
        const floor = Math.max(8, window.innerHeight - currentSize - 8)
        // Small time-based steps preserve collisions during short rendering stalls.
        while (remaining > 0) {
          const dt = Math.min(remaining, 1 / 240)
          remaining -= dt
          state.x += state.vx * dt
          state.y += state.vy * dt + 0.5 * 3200 * dt * dt
          state.vy += 3200 * dt
          state.vx *= Math.pow(0.992, dt * 60)
          if (state.x < 0) {
            state.x = 0
            state.vx = Math.abs(state.vx) * 0.35
          }
          if (state.x > maxX) {
            state.x = maxX
            state.vx = -Math.abs(state.vx) * 0.35
          }
          if (state.y < 8) {
            state.y = 8
            state.vy = Math.abs(state.vy) * 0.3
          }

          if (state.y >= floor) {
            state.y = floor
            if (state.vy > 180) {
              state.vy = -state.vy * 0.42
              state.vx *= 0.85
              state.bounces += 1
              if (state.bounces <= 2) {
                squashLanding()
                playThud()
              }
            } else {
              state.vy = 0
              state.vx *= Math.pow(0.8, dt * 60)
              if (Math.abs(state.vx) < 25 || state.bounces > 3) {
                settlePhysics(state)
                return
              }
            }
          }
        }

        root.style.transform = `translate3d(${state.x - state.startX}px, ${state.y - state.startY}px, 0)`
        state.raf = requestAnimationFrame(stepPhysics)
      }

      function startPhysics(drag) {
        const root = rootRef.current
        if (!root) return
        const rect = root.getBoundingClientRect()
        const now = performance.now()
        const idle = now - drag.lastT > 140
        const vx = idle ? 0 : clamp(drag.vx, -1800, 1800)
        const vy = idle ? 0 : clamp(drag.vy, -1800, 1800)

        root.style.transform = 'translate3d(0, 0, 0)'

        const state = {
          x: rect.left,
          y: rect.top,
          startX: rect.left,
          startY: rect.top,
          vx: vx * 0.6,
          vy: vy * 0.6,
          last: now,
          bounces: 0,
          raf: 0,
        }
        physicsRef.current = state
        setFalling(true)
        state.raf = requestAnimationFrame(stepPhysics)
      }

      function poke() {
        const now = Date.now()
        const log = pokeLog.current
        if (now - log.last > 1600) log.count = 0
        log.count += 1
        log.last = now

        let reaction
        if (log.count >= 4) {
          reaction = ANNOYED
        } else {
          const index = nextReactionIndex(reactionDeck.current, REACTIONS.length)
          reaction = REACTIONS[index]
        }

        showReaction(reaction)

        const figure = figureRef.current
        if (figure && typeof figure.animate === 'function') {
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          if (!reduce) {
            figure.animate(
              [
                { transform: 'translateY(0) scale(1)' },
                { transform: 'translateY(-10px) scale(1.012)' },
                { transform: 'translateY(2px) scale(.997)' },
                { transform: 'translateY(0) scale(1)' },
              ],
              { duration: 520, easing: 'cubic-bezier(.22,.9,.28,1)' },
            )
          }
        }
      }

      function anchoredPos(nextSize) {
        const root = rootRef.current
        if (!root) return clampPos(posRef.current, nextSize)
        const rect = root.getBoundingClientRect()
        const width = Math.round(nextSize * ASPECT)
        return {
          left: clamp(rect.right - width, 0, Math.max(0, window.innerWidth - width)),
          top: clamp(rect.bottom - nextSize, 0, Math.max(0, window.innerHeight - nextSize)),
        }
      }

      function cycleSize(event) {
        event.stopPropagation()
        const index = SIZES.indexOf(size)
        let next
        if (index >= 0) {
          next = SIZES[(index + 1) % SIZES.length]
        } else {
          next = SIZES.find((value) => value > size) ?? SIZES[0]
        }

        const nextPos = anchoredPos(next)
        setSize(next)
        setPos(nextPos)
        posRef.current = nextPos
        sizeRef.current = next
        saveSize(next)
        savePos(nextPos)

        showReaction(SIZE_LINE, 3200)
      }

      function onResizeStart(event) {
        if (event.button !== 0 || !rootRef.current) return
        event.stopPropagation()
        event.preventDefault()
        resizeRef.current = {
          id: event.pointerId,
          y: event.clientY,
          size,
          rect: rootRef.current.getBoundingClientRect(),
        }
        if (event.currentTarget.setPointerCapture) {
          try {
            event.currentTarget.setPointerCapture(event.pointerId)
          } catch {}
        }
        setResizing(true)
      }

      function onResizeMove(event) {
        const resize = resizeRef.current
        if (!resize || resize.id !== event.pointerId) return
        const maxSize = Math.max(
          MIN_SIZE,
          Math.min(
            MAX_SIZE,
            resize.rect.right / ASPECT,
            resize.rect.bottom,
          ),
        )
        const nextSize = clamp(Math.round(resize.size - (event.clientY - resize.y)), MIN_SIZE, maxSize)
        const width = Math.round(nextSize * ASPECT)
        const nextPos = {
          left: resize.rect.right - width,
          top: resize.rect.bottom - nextSize,
        }
        setSize(nextSize)
        setPos(nextPos)
        posRef.current = nextPos
        sizeRef.current = nextSize
      }

      function onResizeEnd(event) {
        const resize = resizeRef.current
        if (!resize || resize.id !== event.pointerId) return
        resizeRef.current = null
        setResizing(false)
        saveSize(sizeRef.current)
        savePos(posRef.current)
      }

      function onPointerDown(event) {
        if (event.button !== 0 || jumpingRef.current || physicsRef.current || !rootRef.current) return
        const rect = rootRef.current.getBoundingClientRect()
        const rx = (event.clientX - rect.left) / rect.width
        const ry = (event.clientY - rect.top) / rect.height
        const onHead = rx >= 0.38 && rx <= 0.68 && ry >= 0.07 && ry <= 0.29
        dragRef.current = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          left: rect.left,
          top: rect.top,
          moved: false,
          onHead,
          vx: 0,
          vy: 0,
          lastX: event.clientX,
          lastY: event.clientY,
          lastT: performance.now(),
        }
        if (event.currentTarget.setPointerCapture) {
          try {
            event.currentTarget.setPointerCapture(event.pointerId)
          } catch {}
        }

        const ctx = ensureAudioContext()
        if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {})

        clearHold()
        if (onHead) {
          holdRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            timer: setTimeout(() => beginPetting(event.pointerId), 420),
          }
        }
        event.preventDefault()
      }

      function onPointerMove(event) {
        if (springRef.current) {
          const spring = springRef.current
          if (spring.pointerId !== event.pointerId) return
          const pull = clamp((event.clientY - spring.startY) / (size * 0.42), 0, 1)
          spring.pull = pull
          if (!spring.raf) {
            spring.raf = requestAnimationFrame(() => {
              spring.raf = 0
              if (springRef.current !== spring || !stackRef.current) return
              const value = spring.pull
              stackRef.current.style.transform =
                `scale(${1 + value * 0.12}, ${1 - value * 0.38}) translateY(${value * 8}px)`
            })
          }
          return
        }
        if (pettingRef.current) return

        const hold = holdRef.current
        if (hold && Math.hypot(event.clientX - hold.x, event.clientY - hold.y) > 10) {
          clearHold()
        }
        const drag = dragRef.current
        if (!drag || drag.id !== event.pointerId) return
        const dx = event.clientX - drag.x
        const dy = event.clientY - drag.y
        if (!drag.moved) {
          if (Math.hypot(dx, dy) < 10) return
          if (drag.onHead && dy > 10 && dy > Math.abs(dx) * 1.2) {
            drag.moved = true
            startSpring(event)
            return
          }
          drag.moved = true
          clearHold()
        }
        setDragging(true)
        const next = clampPos({ left: drag.left + dx, top: drag.top + dy }, size)
        setPos(next)
        posRef.current = next

        const dt = Math.max(1, performance.now() - drag.lastT)
        const instVx = ((event.clientX - drag.lastX) / dt) * 1000
        const instVy = ((event.clientY - drag.lastY) / dt) * 1000
        drag.vx = drag.vx * 0.6 + instVx * 0.4
        drag.vy = drag.vy * 0.6 + instVy * 0.4
        drag.lastX = event.clientX
        drag.lastY = event.clientY
        drag.lastT = performance.now()
      }

      function endDrag(event, isCancel) {
        if (springRef.current) {
          releaseSpring()
          setDragging(false)
          clearHold()
          return
        }
        if (pettingRef.current) {
          finishPetting()
          dragRef.current = null
          setDragging(false)
          clearHold()
          return
        }
        clearHold()
        const drag = dragRef.current
        if (!drag || drag.id !== event.pointerId) return
        dragRef.current = null
        setDragging(false)
        if (drag.moved) {
          startPhysics(drag)
          const now = performance.now()
          if (!isCancel && !speaking && !sourceRef.current && now - lastMoveVoice.current >= 15000) {
            lastMoveVoice.current = now
            showReaction(MOVE_LINE)
          }
        } else if (!isCancel) {
          poke()
        }
      }

      function onKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          poke()
        }
      }

      function onContextMenu(event) {
        event.preventDefault()
        event.stopPropagation()
        setBubble({ type: 'pricing', timestamp: Date.now() })
        schedule('bubble', () => setBubble(null), 16000)
      }

      React.useEffect(() => {
        let alive = true
        const frames = Array.from(stackRef.current.querySelectorAll('.tp-image'))
        // Decode the mounted layers before allowing expression changes to become visible.
        Promise.all(frames.map(async (image) => {
          try {
            await image.decode()
          } catch {
            console.error('[tachibana-pet] could not decode frame', image.src.slice(0, 32))
            image.src = ASSETS.idle
            await image.decode()
          }
        })).then(() => {
          if (alive) setReady(true)
        }).catch(() => {
          if (alive) console.error('[tachibana-pet] could not load idle frame')
        })
        HAND_FRAMES.forEach((src) => {
          const image = new Image()
          image.src = src
        })
        return () => {
          alive = false
        }
      }, [])

      React.useEffect(() => {
        if (!petting) {
          setHandFrame(0)
          return
        }
        const id = setInterval(() => setHandFrame((frame) => (frame + 1) % 5), 120)
        return () => clearInterval(id)
      }, [petting])

      React.useEffect(() => {
        if (!ready) return
        let alive = true
        let next = 0
        let close = 0

        function schedule(delay) {
          next = setTimeout(() => {
            if (!alive) return
            if (faceRef.current === 'idle') {
              setBlinking(true)
              close = setTimeout(() => {
                if (!alive) return
                setBlinking(false)
                schedule(3200 + Math.random() * 3800)
              }, 130)
            } else {
              schedule(1600)
            }
          }, delay)
        }

        schedule(2200 + Math.random() * 2600)
        return () => {
          alive = false
          clearTimeout(next)
          clearTimeout(close)
        }
      }, [ready])

      React.useEffect(() => {
        if (!ready) return
        let greeted = false
        try {
          greeted = sessionStorage.getItem(GREET_KEY) === '1'
        } catch {}
        if (greeted) return
        try {
          sessionStorage.setItem(GREET_KEY, '1')
        } catch {}

        let introduced = true
        try {
          introduced = localStorage.getItem(INTRO_KEY) === '1'
        } catch {}
        if (!introduced) {
          try {
            localStorage.setItem(INTRO_KEY, '1')
          } catch {}
        }

        const greeting = introduced ? GREETING : FIRST_GREETING
        schedule('greet', () => showReaction(greeting), 900)
        return () => clearTimer('greet')
      }, [ready])

      React.useEffect(() => {
        if (!ready) return
        let alive = true
        let idleTimer = 0

        function scheduleIdle(delay) {
          idleTimer = setTimeout(() => {
            if (!alive) return
            if (document.visibilityState === 'visible' && faceRef.current === 'idle') {
              const line = IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)]
              showReaction(line)
            }
            scheduleIdle(140000 + Math.random() * 120000)
          }, delay)
        }

        scheduleIdle(90000 + Math.random() * 60000)
        return () => {
          alive = false
          clearTimeout(idleTimer)
        }
      }, [ready])

      React.useEffect(() => {
        function onResize() {
          const current = posRef.current
          if (!current) return
          const next = clampPos(current, size)
          if (next && (next.left !== current.left || next.top !== current.top)) {
            setPos(next)
            posRef.current = next
          }
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
      }, [size])

      React.useEffect(() => {
        const map = timers.current
        return () => {
          Object.keys(map).forEach((key) => {
            clearTimeout(map[key])
            delete map[key]
          })
          if (holdRef.current) {
            clearTimeout(holdRef.current.timer)
            holdRef.current = null
          }
          pettingRef.current = false
          if (springRef.current && springRef.current.raf) {
            cancelAnimationFrame(springRef.current.raf)
          }
          springRef.current = null
          if (physicsRef.current && physicsRef.current.raf) {
            cancelAnimationFrame(physicsRef.current.raf)
            physicsRef.current = null
          }
        }
      }, [])

      React.useEffect(
        () => () => {
          voiceTokenRef.current += 1
          voiceCacheRef.current.clear()
          const source = sourceRef.current
          sourceRef.current = null
          if (source) {
            source.onended = null
            try {
              source.stop()
            } catch {}
            try {
              source.disconnect()
            } catch {}
          }
          const ctx = audioCtxRef.current
          audioCtxRef.current = null
          if (ctx && ctx.state !== 'closed') ctx.close().catch(() => {})
        },
        [],
      )

      const width = Math.round(size * ASPECT)
      const rootStyle = { '--tp-height': size + 'px', width: width + 'px', height: size + 'px' }
      if (pos) {
        rootStyle.left = pos.left + 'px'
        rootStyle.top = pos.top + 'px'
      }

      return h(
        'div',
        {
          ref: rootRef,
          className: 'tp-root',
          style: rootStyle,
          'data-anchored': pos ? 'false' : 'true',
          'data-dragging': dragging ? 'true' : 'false',
          'data-resizing': resizing ? 'true' : 'false',
          'data-petting': petting ? 'true' : 'false',
          'data-spring': springing ? 'true' : 'false',
          'data-jumping': jumping ? 'true' : 'false',
          'data-falling': falling ? 'true' : 'false',
          'data-processing': fileTools.state.phase === 'busy' ? 'true' : 'false',
          'data-file-hover': fileTools.hover ? 'true' : 'false',
        },
        h('style', null, CSS),
        h('style', null, FILE_TOOLS_CSS),
        h(FileToolsPanel, { tools: fileTools }),
        h(
          'div',
          { className: 'tp-stage' },
          h('div', { className: 'tp-ground', 'aria-hidden': true }),
          h(
            'div',
            {
              ref: figureRef,
              className: 'tp-figure',
              role: 'button',
              tabIndex: 0,
              'aria-label': t('name'),
              onPointerDown,
              onPointerMove,
              onPointerUp: (event) => endDrag(event, false),
              onPointerCancel: (event) => endDrag(event, true),
              onLostPointerCapture: (event) => endDrag(event, true),
              onKeyDown,
              onContextMenu,
              onDragOver: fileTools.dragOver,
              onDragLeave: fileTools.dragLeave,
              onDrop: fileTools.drop,
              onDragStart: (event) => event.preventDefault(),
            },
            h(
              'div',
              {
                ref: stackRef,
                className: 'tp-stack',
              },
              h(FrameLayers, { ready, face }),
              h('img', {
                className: 'tp-eye-blink',
                src: EYE_PATCH,
                alt: '',
                draggable: false,
                'data-on': blinking ? 'true' : 'false',
              }),
            ),
          ),
          petting
            ? h(
                'div',
                { className: 'tp-hand', 'aria-hidden': true },
                HAND_FRAMES.map((src, index) =>
                  h('img', {
                    key: index,
                    className: 'tp-hand-frame',
                    src,
                    alt: '',
                    draggable: false,
                    style: { opacity: index === handFrame ? 1 : 0 },
                  }),
                ),
              )
            : null,
          h(
            'div',
            {
              className: 'tp-resize',
              role: 'button',
              tabIndex: 0,
              'aria-label': t('resize'),
              title: t('resize'),
              onPointerDown: onResizeStart,
              onPointerMove: onResizeMove,
              onPointerUp: onResizeEnd,
              onPointerCancel: onResizeEnd,
              onDragStart: (event) => event.preventDefault(),
            },
            h(
              'svg',
              {
                viewBox: '0 0 16 16',
                width: 13,
                height: 13,
                'aria-hidden': true,
                focusable: false,
              },
              h('path', {
                d: 'M5.2 10.8 10.8 5.2M10.8 5.2H7.4M10.8 5.2v3.4M5.2 10.8H8.6M5.2 10.8V7.4',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: 1.35,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }),
            ),
          ),
          h(
            'div',
            { className: 'tp-hud' },
            h(
              'span',
              { className: 'tp-name' },
              h('span', { className: 'tp-petal', 'aria-hidden': true }),
              t('name'),
            ),
            h('span', { className: 'tp-size' }, Math.round(size) + 'px'),
            h('select', {
              className: 'tp-file-format', 'aria-label': '音频输出格式',
              title: '拖入音频时使用的格式', value: fileTools.format,
              onChange: event => fileTools.setFormat(event.target.value),
              onPointerDown: event => event.stopPropagation(),
            }, ['mp3', 'wav', 'flac', 'm4a', 'ogg', 'opus'].map(value =>
              h('option', { key: value, value }, value.toUpperCase()))),
            h(
              'button',
              {
                type: 'button',
                className: 'tp-btn tp-sound',
                onClick: toggleSound,
                title: t(sound ? 'mute' : 'unmute'),
                'aria-label': t(sound ? 'mute' : 'unmute'),
                'aria-pressed': sound ? 'true' : 'false',
                'data-speaking': speaking ? 'true' : 'false',
              },
              h(
                'svg',
                {
                  viewBox: '0 0 16 16',
                  width: 12,
                  height: 12,
                  'aria-hidden': true,
                  focusable: false,
                },
                h('path', { d: 'M2.5 6h2L8 3.6v8.8L4.5 10h-2z', fill: 'currentColor' }),
                sound
                  ? h('path', {
                      d: 'M10.2 5.8a3.6 3.6 0 0 1 0 4.4M12 4a6 6 0 0 1 0 8',
                      fill: 'none',
                      stroke: 'currentColor',
                      strokeWidth: 1.25,
                      strokeLinecap: 'round',
                    })
                  : h('path', {
                      d: 'M10.2 6.2l3.2 3.6M13.4 6.2l-3.2 3.6',
                      fill: 'none',
                      stroke: 'currentColor',
                      strokeWidth: 1.25,
                      strokeLinecap: 'round',
                    }),
              ),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'tp-btn',
                onClick: cycleSize,
                title: t('size'),
                'aria-label': t('size'),
              },
              'Aa',
            ),
          ),
          bubble
            ? bubble.type === 'pricing'
              ? h(PricingBubble, { key: bubble.timestamp, timestamp: bubble.timestamp })
              : h('div', { className: 'tp-bubble', key: bubble, role: 'status' }, bubble)
            : null,
        ),
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => {
          const disposers = [
            ctx.locale.register(NS, 'en', EN),
            ctx.locale.register(NS, 'zh', ZH),
            ctx.locale.register(NS, 'zh-CN', ZH),
            ctx.locale.register(NS, 'zh-Hans', ZH),
          ]
          return () => {
            for (const dispose of disposers) dispose()
          }
        }, 'tachibana-pet: dictionaries')
        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            { name: 'shell.overlay', id: 'tachibana-pet', order: -10 },
            function TachibanaPet() {
              return h(PetView, { locale: ctx.locale })
            },
          ),
        )
      },
    }
  },
})
