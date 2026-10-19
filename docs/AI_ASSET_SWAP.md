# 给 AI 的素材替换指南（同系列快速换人）

这份文档是写给**另一个 AI**看的：目标是在不改交互逻辑的前提下，把这个桌宠插件里的角色（立绘、表情、眨眼贴片、语音、文案、图标）换成另一个角色。特别是《蔚蓝档案》同一套 `CHxxxx_spr` 立绘差分，流程可以很快。

> 版权提醒：只替换成你有权使用的素材。官方立绘/语音版权归 NEXON Games / Yostar 所有；本仓库代码是 MIT，素材不是。不要用这份指南去分发你没有权利的内容。

---

## 0. 一句话流程

```
放素材 → 改 build_assets.py 的 FRAMES/VOICES → 改 client.template.js 的表情映射/眼睛坐标/ASPECT → 改 locale + icon → 构建 → 语法检查 → 安装测试
```

不要改物理、弹簧、摸头、拖拽这些交互逻辑，除非用户明确要求。

---

## 1. 先认识文件

| 路径 | 作用 |
| --- | --- |
| `src/client.template.js` | 客户端全部逻辑：React、CSS、表情映射、台词、物理、眨眼贴片坐标 |
| `src/build_assets.py` | 把 `assets/` 里的图片/语音/手帧/眼贴转成 data URL，写进 `client.js` |
| `client.js` | 构建产物，**不要手改**；每次改模板后重新生成 |
| `assets/idle.webp` | 待机立绘 |
| `assets/s2_*.webp` | 表情差分（当前只打包用到的几张） |
| `assets/eye-blink.png` | 只有眼睛区域的眨眼贴片 |
| `assets/hand/0..4.png` | petpet 摸头手的 5 帧 |
| `assets/voices/*.ogg` | 内嵌语音，按 key 命名 |
| `locale/zh.json` / `locale/en.json` | 插件管理页显示的标题/描述 |
| `icon.png` | 插件图标（256×256 PNG，<256 KiB） |
| `ASSET_NOTICE.md` | 素材版权声明 |

---

## 2. 当前角色的素材映射（替换前先对照）

### 2.1 表情帧

构建脚本 `src/build_assets.py` 的 `FRAMES` 当前是：

```python
FRAMES = ["idle", "s2_01", "s2_04", "s2_07", "s2_09", "s2_12", "s2_13"]
```

`client.template.js` 里的使用位置：

| 常量/场景 | 当前 face | 语义 |
| --- | --- | --- |
| `GREETING` / `FIRST_GREETING` | `s2_01` | 登录、初次见面：柔和微笑 |
| `REACTIONS` 的 serve / satisfied / watching / victory | `s2_13` | 开心、得意、笑 |
| `REACTIONS` 的 mask / unmask / stare | `s2_12` | 害羞、脸红 |
| `ANNOYED` | `s2_09` | 鼓脸生气 |
| `SIZE_LINE` | `s2_12` | 缩放时的害羞 |
| `HEADPAT` / `HEADPAT_LONG` | `s2_12` / `s2_13` | 摸头 / 长按摸头 |
| `IDLE_LINES` summer / walk | `s2_01` | 待机柔和表情 |
| `IDLE_LINES` prepared / dontLeave | `s2_12` | 待机害羞表情 |
| 预留未用 | `s2_04` / `s2_07` | 惊讶 / 委屈，当前打包但未使用 |

> 换人时，**不要按文件名硬套语义**。同一个 `S2_05` 在不同角色上可能是红眼、哭、笑。先看脸，再决定哪个文件放到哪个 `face` 常量。

### 2.2 语音 key

`src/build_assets.py` 的 `VOICES` 与 `assets/voices/` 对应：

| key | 用在 | 当前台词（中文） |
| --- | --- | --- |
| `login` | 登录 | 老师，欢迎回来。若藻我正怀着一日三秋般的思念等待着您♥ |
| `headpat` | 摸头 | 呵呵，好暖和啊…… |
| `serve` | 戳一戳 | 您可以吩咐我做任何事。对，就是字面意思，“任何事”♥ |
| `mask` | 戳一戳 | 您问夏天带着面具，会不会很闷热……？呵呵，没关系。这是我特别订制的夏日专用版哦♥ |
| `unmask` | 戳一戳 | 当然，如果亲爱的老师想看……若藻我可以取下面具哦…………呵呵呵，怎么样，要看看吗？ |
| `stare` | 戳一戳 | 您……您这样直勾勾地看着，就算是我，现在也……也感觉有点……难为情…… |
| `satisfied` | 戳一戳 | 呵呵，老师，你满意了吗？ |
| `watching` | 戳一戳 | 总感觉有人看着我……难道是老师……？呵呵呵♥ |
| `victory` | 戳一戳 | 真是让人愉快的胜利呀，呵呵♥ |
| `end` | 连戳生气 | 差不多该结束了吧。 |
| `prepared` | 待机 | 毕竟是难得的夏天……既然如此……老师，若藻我已经做好心理准备了，只要是和您在一起，无论让您看到我的什么样子，我都……！ |
| `dontLeave` | 待机 | 不管是在酷暑的烈日下，还是在寒冬的冰水中……我都会和您形影不离。所以在这个盛夏里，也请您不要离开我哦。亲·爱·的·老·师·♥ |

这些台词同时写在 `client.template.js` 的 `EN` / `ZH` 字典里（`line.*`），换语音时必须同步改文字。

### 2.3 眼睛/眨眼贴片

- 贴片来源：闭眼帧 `Eye_Close_S2_01` 裁 `(1040, 570) – (1400, 720)`（原图 2179×2860），带羽化 alpha。
- CSS 百分比（相对整张立绘）：
  - `left: 47.73%`
  - `top: 19.93%`
  - `width: 16.52%`
  - `height: 5.24%`
- 换角色后，如果头部位置/大小变化，必须重新裁贴片并重算这四个百分比，否则眨眼会贴到脸颊或头发上。

### 2.4 petpet 手

- `assets/hand/0..4.png` 是经典 petpet 手 5 帧，尺寸 112×112。
- 位置在 CSS `.tp-hand`：`left: 33%; top: 1%; width: 32%`。
- 换角色后如果头的位置差很多，调这三个值，让手落在头顶。
- 手素材可保留；也可以换成自己的手部素材（保持 5 帧、同尺寸、透明背景）。

### 2.5 立绘尺寸/比例

- 原图 2179×2860；`client.template.js` 里 `ASPECT = 2179 / 2860`。
- 如果新角色原图比例不同，**必须**改 `ASPECT`，否则 `width = size * ASPECT` 会把人物拉扁/拉长。
- 当前帧导出高度 760px（`assets/*.webp`），显示端可缩放到 220–760px。

---

## 3. 同系列（BA `CHxxxx_spr`）最快换法

同一套立绘差分的文件名通常长这样：

```
CH0175_spr_Idle_01.png
CH0175_spr_Eye_Close_S2_01.png
CH0175_spr_S2_01.png ... CH0175_spr_S2_15.png
CH0175_spr_S2_99.png
```

### 步骤

1. **确定新角色的源目录**（例如 `F:\...\CHxxxx_spr\`）。
2. **看脸选帧**：把 `S2_01` 到 `S2_15` 和 `Eye_Close` 缩略图排成一张网格，人工/视觉模型判断：
   - 哪张是“柔和微笑” → `s2_01` 语义
   - 哪张是“害羞脸红” → `s2_12` 语义
   - 哪张是“开心/得意” → `s2_13` 语义
   - 哪张是“鼓脸生气” → `s2_09` 语义
   - 哪张是“惊讶/委屈”（可选）→ `s2_04` / `s2_07`
3. **导出成插件帧**：统一缩放到高度 760，保存为 `assets/<key>.webp`。key 用 `idle`、`s2_01`…；不要把 15 张全部塞进去，只放用到的。
4. **改 `FRAMES`**：只保留实际用到的 key。
5. **改表情映射**：把 `client.template.js` 里 `GREETING`、`REACTIONS`、`ANNOYED`、`SIZE_LINE`、`HEADPAT`、`HEADPAT_LONG`、`IDLE_LINES` 的 `face` 改成新 key。
6. **重做眼贴**：从新角色的闭眼帧裁眼部，更新 `assets/eye-blink.png` + CSS 四个百分比。
7. **换语音/台词**：替换 `assets/voices/*.ogg`，同步 `VOICES` 列表和 `EN`/`ZH` 里的 `line.*` 文本。
8. **改元数据**：`locale/zh.json`、`locale/en.json` 的 `meta.title` / `meta.description`；`icon.png`。
9. **构建**：`python src/build_assets.py`，然后 `node --check client.js`。
10. **安装测试**：见第 7 节。

### 快速导出帧的 Python 片段

```python
from PIL import Image
import os

SRC = r"F:\path\to\CHxxxx_spr"
OUT = r"assets"
H = 760

mapping = [
    ("CHxxxx_spr_Idle_01.png", "idle"),
    ("CHxxxx_spr_S2_03.png", "s2_01"),   # 例：柔和微笑
    ("CHxxxx_spr_S2_12.png", "s2_12"),   # 例：害羞
    ("CHxxxx_spr_S2_14.png", "s2_13"),   # 例：开心
    ("CHxxxx_spr_S2_09.png", "s2_09"),   # 例：鼓脸
]

for src, key in mapping:
    im = Image.open(os.path.join(SRC, src)).convert("RGBA")
    w = round(im.width * H / im.height)
    im.resize((w, H), Image.LANCZOS).save(
        os.path.join(OUT, key + ".webp"), "WEBP", quality=84, method=6
    )
```

### 重做眼贴的 Python 片段

```python
from PIL import Image, ImageDraw, ImageFilter, ImageChops

SRC = r"F:\path\to\CHxxxx_spr_Eye_Close_S2_01.png"
W, H = 2179, 2860          # 换成新原图尺寸
box = (1040, 570, 1400, 720)  # 换成新角色的眼部框
feather = 24

im = Image.open(SRC).convert("RGBA")
patch = im.crop(box)
w, h = patch.size

mask = Image.new("L", (w, h), 0)
d = ImageDraw.Draw(mask)
d.rectangle([feather, feather, w - feather, h - feather], fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(9))

r, g, b, a = patch.split()
patch = Image.merge("RGBA", (r, g, b, ImageChops.multiply(a, mask)))
patch.save("assets/eye-blink.png", "PNG", optimize=True)

# 输出 CSS 百分比，填回 .tp-eye-blink
print("left:", round(box[0] / W * 100, 2))
print("top:", round(box[1] / H * 100, 2))
print("width:", round((box[2] - box[0]) / W * 100, 2))
print("height:", round((box[3] - box[1]) / H * 100, 2))
```

> 如果新原图不是 2179×2860，先更新 `ASPECT`，再用新尺寸算眼贴百分比。

---

## 4. 语音替换

### 4.1 只换声音，不改台词结构

1. 准备 `.ogg`（Vorbis/Opus，短句，建议 <150 KB）。
2. 用相同 key 覆盖 `assets/voices/<key>.ogg`。
3. `VOICES` 列表不用动。
4. 构建后会自动内联。

### 4.2 换台词/情绪

- `client.template.js` 的 `REACTIONS` 数组：每项 `{ key: 'line.xxx', face: 's2_xx', voice: 'xxx' }`。
- `IDLE_LINES`、`GREETING`、`ANNOYED`、`SIZE_LINE`、`HEADPAT` 同理。
- 在 `EN`/`ZH` 字典里加/改 `line.xxx` 文本。
- 如果新增语音 key，把它加到 `build_assets.py` 的 `VOICES`，并把 `.ogg` 放到 `assets/voices/`。

### 4.3 从 kivo.wiki 取同系列语音

角色 API：

```
https://api.kivo.wiki/api/v1/data/students/<character_id>
```

返回 JSON 里有：

- `voice`: 日配列表，`text` 是官方简中翻译，`file` 是 `.ogg`
- `voice_cn`: 中配列表
- `character_voice` / `character_voice_cn`: 声优名

按 `description`（如 `CH0175_LogIn_1`）挑句，下载 `https:` + `file`，转成短句即可。注意不要批量抓取/再分发，遵守素材站的条款。

---

## 5. 元数据与图标

- `locale/zh.json`：
  ```json
  { "meta": { "title": "角色名 · 桌宠", "description": "一句话说明 + 玩法" } }
  ```
- `locale/en.json` 同步英文。
- `icon.png`：256×256，透明/简洁，<256 KiB；用角色脸部裁切或原创图标。
- 如果 fork 成新插件：`package.json` 的 `name`、`cordis.patch.yml` 的 `id`/`name`、`client.js` 的 loader `id` 必须一致；当前公开仓库用 `dsh-wakamo-pet` / `wakamo-pet`。

---

## 6. 构建

```powershell
python src/build_assets.py
node --check client.js
```

构建会：

- 读 `assets/*.webp` → `ASSETS`
- 读 `assets/voices/*.ogg` → `VOICES`
- 读 `assets/hand/0..4.png` → `HAND_FRAMES`
- 读 `assets/eye-blink.png` → `EYE_PATCH`
- 把 `src/client.template.js` 拼进 `client.js`

如果改了 `FRAMES`/`VOICES` 但没重新构建，运行中的插件仍然是旧素材。

---

## 7. 安装与验证

```powershell
dsh plugin --profile web add "<repo-or-folder>"
```

然后完全重启 DSH Web，刷新页面。

逐项验证：

- [ ] 待机立绘完整、透明背景、没有被裁掉头/脚
- [ ] 点她：表情切换自然，气泡文字与语音对应
- [ ] 眨眼：只动眼睛，不整张图闪；贴片没有偏移到脸颊/头发
- [ ] 摸头：手落在头顶，5 帧循环，松手消失
- [ ] 从头顶下拉：弹簧压扁 → 松手弹到顶部 → 落回
- [ ] 拖身体：松手受重力掉落、边缘反弹、落地停住
- [ ] 缩放 `Aa` / 左上角手柄：人物不变形（`ASPECT` 正确）
- [ ] 静音按钮：所有语音/音效都能关
- [ ] 刷新后位置/大小保留
- [ ] 插件列表里的标题/描述/图标正确

> 如果换人后“闪”，先检查：是否还在用旧的单图 `src` 切换；当前实现是叠帧 + 眼贴，正常不应闪。若闪，确认 `client.js` 是否重新构建、页面是否加载了新 bundle。

---

## 8. 不要做的事

- 不要改 `shell.overlay` 注册、物理常数、抓取/弹簧判定，除非用户明确要求。
- 不要把所有 15 张差分都打包；只放用到的，控制 bundle 体积。
- 不要把没有透明通道的 JPG 直接改后缀；必须 RGBA PNG/WebP。
- 不要只改 `assets/` 不跑构建；`client.js` 才是运行时读取的文件。
- 不要改 `FRAMES` 里的 key 却不改模板里的 `face` 字符串。
- 不要用你没有权利的素材做公开分发。

---

## 9. 复制给另一个 AI 的提示词

```text
你在一个 DeepSeek Harness（DSH）桌宠插件仓库里工作，仓库根目录是 dsh-wakamo-pet。

任务：把当前角色替换成另一个《蔚蓝档案》角色（同一套 CHxxxx_spr 立绘差分），保持所有交互逻辑不变（物理掉落、弹簧、petpet 摸头、眨眼、缩放、静音、位置记忆）。

开始前必须：
1. 阅读 docs/AI_ASSET_SWAP.md 和 README.md。
2. 检查源立绘的尺寸/比例；如果不是 2179×2860，先改 src/client.template.js 里的 ASPECT，并重算眼贴百分比。
3. 只看脸决定 S2_01..15 的语义，不要按文件名硬套。

按以下顺序做：
1) 选帧：待机、柔和微笑、害羞、开心、鼓脸、惊讶/委屈（可选）。
2) 用 docs 里的 Python 片段导出 assets/<key>.webp（高度 760，RGBA WebP）。
3) 更新 src/build_assets.py 的 FRAMES（只保留用到的 key）。
4) 更新 src/client.template.js 的 GREETING / REACTIONS / ANNOYED / SIZE_LINE / HEADPAT / HEADPAT_LONG / IDLE_LINES 的 face。
5) 从新角色的闭眼帧重做 assets/eye-blink.png，并更新 .tp-eye-blink 的 left/top/width/height 百分比。
6) 替换 assets/voices/*.ogg（key 不变则只覆盖文件）；同步 EN/ZH 里的 line.* 文本；新增/删除 key 时同步 VOICES。
7) 调 .tp-hand 的 left/top/width，让 petpet 手落在新角色头顶。
8) 更新 locale/zh.json、locale/en.json 的 meta，以及 icon.png。
9) 运行 python src/build_assets.py，再运行 node --check client.js。
10) 报告修改的文件、构建结果、以及哪些验证项没有条件做。

约束：
- 不要手改 client.js。
- 不要改物理/弹簧/摸头逻辑。
- 不要打包未使用的差分。
- 只使用有权利使用的素材；公开分发前确认版权。
```

---

## 10. 最快路径（熟手版）

如果新角色和当前角色是同一套构图、头的位置几乎一样：

1. 只换 `assets/idle.webp` + `assets/s2_01/09/12/13.webp`。
2. 眼贴用同一 `box` 裁（头位置一样时可直接复用）。
3. 语音直接覆盖同名 `.ogg`。
4. `python src/build_assets.py`。
5. 安装测试。

大概 5–10 分钟能换完一个角色。
