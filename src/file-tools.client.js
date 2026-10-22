    const FILE_TOOLS_CSS = `
      .tp-root[data-processing="true"]:not([data-dragging="true"]):not([data-falling="true"]):not([data-spring="true"]):not([data-petting="true"]):not([data-resizing="true"]) .tp-stack {
        animation: tp-working 2.8s ease-in-out infinite;
      }
      @keyframes tp-working {
        0%, 100% { transform: translateY(0) rotate(-.35deg); }
        50% { transform: translateY(-3px) rotate(.35deg); }
      }
      .tp-file-format { pointer-events:auto; font:inherit; font-size:11px; max-width:65px;
        color:var(--dsw-alias-label-primary); background:var(--dsw-alias-bg-layer-2); border:0; }
      .tp-root[data-file-hover="true"] .tp-figure { outline:2px dashed #ca739e; outline-offset:4px; }
      .tp-file-panel { position:absolute; z-index:100; right:0; bottom:0; width:340px; max-width:calc(100vw - 32px);
        max-height:70vh; overflow:auto; pointer-events:auto; box-sizing:border-box; padding:14px;
        border:1px solid var(--dsw-alias-border-l1,#aaa); border-radius:8px;
        color:var(--dsw-alias-label-primary,#222); background:var(--dsw-alias-bg-layer-2,#fff);
        box-shadow:0 4px 24px #0002; font:13px/1.5 system-ui; }
      .tp-file-panel header,.tp-file-row { display:flex; align-items:center; justify-content:space-between; gap:8px; }
      .tp-file-panel h3 { margin:0; font-size:14px; }
      .tp-file-panel button { cursor:pointer; font:inherit; padding:5px 9px; border-radius:4px;
        border:1px solid var(--dsw-alias-border-l1,#bbb); background:transparent; color:inherit; }
      .tp-file-panel button:disabled { cursor:default; opacity:.5; }
      .tp-file-panel p { margin:8px 0; overflow-wrap:anywhere; }
      .tp-file-panel input { width:100%; box-sizing:border-box; font:inherit; padding:8px; margin:6px 0 10px; }
      .tp-file-result { border-top:1px solid var(--dsw-alias-border-l1,#ddd); padding-top:8px; margin-top:8px; }
      .tp-file-path { font-size:11px; opacity:.8; user-select:text; }
      .tp-file-error { color:#b83d4e; }
      @media(prefers-reduced-motion:reduce) {
        .tp-root[data-processing="true"] .tp-stack { animation:none !important; }
      }
    `

    function useFileTools(onStatus, rootRef) {
      const [format, setFormatValue] = React.useState(() => {
        try {
          const value = localStorage.getItem('tachibana-pet:audio-format')
          if (['mp3', 'wav', 'flac', 'm4a', 'ogg', 'opus'].includes(value)) return value
        } catch {}
        return 'mp3'
      })
      const [state, setState] = React.useState({ phase: 'idle', results: [], name: '', remaining: 0 })
      const [hover, setHover] = React.useState(false)
      const [password, setPassword] = React.useState('')
      const running = React.useRef(false)
      const controller = React.useRef(null)
      const passwordReply = React.useRef(null)
      const alive = React.useRef(true)
      const statusRef = React.useRef(onStatus)
      const dropRef = React.useRef(drop)
      dropRef.current = drop
      statusRef.current = onStatus

      React.useEffect(() => {
        let owned = false
        const release = () => {
          owned = false
          setHover(false)
        }
        const intercept = event => {
          if (!Array.from(event.dataTransfer?.types || []).includes('Files')) return
          const root = rootRef.current
          if (!root) return
          const rect = root.getBoundingClientRect()
          const inside = root.contains(event.target) ||
            (event.clientX >= rect.left && event.clientX <= rect.right &&
             event.clientY >= rect.top && event.clientY <= rect.bottom)
          if (!inside) {
            if (owned) release()
            return
          }
          event.preventDefault()
          event.stopImmediatePropagation()
          if (!owned) {
            owned = true
            // The host's document-level attachment overlay may already be open.
            // Its public dragend listener resets that overlay and its drag depth.
            window.dispatchEvent(new Event('dragend'))
            owned = true
          }
          event.dataTransfer.dropEffect = running.current ? 'none' : 'copy'
          setHover(!running.current)
          if (event.type === 'drop') {
            release()
            void dropRef.current(event)
          }
        }
        const leave = event => {
          if (event.clientX <= 0 || event.clientY <= 0 ||
            event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) release()
        }
        for (const type of ['dragenter', 'dragover', 'drop']) {
          document.addEventListener(type, intercept, true)
        }
        document.addEventListener('dragleave', leave, true)
        window.addEventListener('dragend', release)
        return () => {
          for (const type of ['dragenter', 'dragover', 'drop']) {
            document.removeEventListener(type, intercept, true)
          }
          document.removeEventListener('dragleave', leave, true)
          window.removeEventListener('dragend', release)
        }
      }, [])

      React.useEffect(() => {
        alive.current = true
        return () => {
          alive.current = false
          controller.current?.abort()
          passwordReply.current?.(null)
        }
      }, [])

      async function request(body, signal) {
        const response = await fetch('wakamo/file-tools', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json', 'X-Wakamo-Action': 'file-tools' },
          body: JSON.stringify(body), signal,
        })
        let result
        try { result = await response.json() } catch {
          throw Error('文件处理服务未就绪，请完全重启 DeepSeek Harness')
        }
        if (!response.ok) throw Object.assign(Error(result.message || '文件处理失败'), { code: result.code })
        return result
      }

      function cancel() {
        controller.current?.abort()
        passwordReply.current?.(null)
        passwordReply.current = null
        setPassword('')
      }

      async function drop(event) {
        event.preventDefault()
        event.stopPropagation()
        setHover(false)
        if (running.current) return
        const files = Array.from(event.dataTransfer.files || [])
        if (!files.length) return
        if (files.length > 20) {
          setState({ phase: 'done', results: [{ error: '一次最多处理 20 个文件' }], name: '', remaining: 0 })
          return
        }
        running.current = true
        const abort = new AbortController()
        controller.current = abort
        const results = []
        const notify = (phase, name, remaining) => {
          if (!alive.current) return
          setState({ phase, name, remaining, results: [...results] })
        }
        try {
          for (let i = 0; i < files.length && !abort.signal.aborted; i++) {
            const file = files[i]
            const name = file.name
            let secret = ''
            try {
              const path = window.__DSH_HOST_PATHS__?.pathFor(file)
              if (!path) throw Error('请在 DeepSeek 桌面端从资源管理器拖入文件；浏览器不提供源文件路径')
              notify('busy', name, files.length - i)
              statusRef.current('busy', name)
              for (;;) {
                try {
                  const result = await request({ path, format, password: secret }, abort.signal)
                  results.push({ name, ...result })
                  statusRef.current('success', name)
                  break
                } catch (error) {
                  if (error.code !== 'PASSWORD_REQUIRED') throw error
                  notify('password', name, files.length - i)
                  setState(value => ({ ...value, message: error.message }))
                  statusRef.current('password', name)
                  secret = await new Promise(resolve => { passwordReply.current = resolve })
                  passwordReply.current = null
                  if (secret === null || abort.signal.aborted) throw new DOMException('已取消', 'AbortError')
                  notify('busy', name, files.length - i)
                  statusRef.current('busy', name)
                }
              }
            } catch (error) {
              if (abort.signal.aborted || error.name === 'AbortError') {
                results.push({ name, error: '已取消；源文件未修改' })
                break
              }
              results.push({ name, error: error.message || '文件处理失败' })
              statusRef.current('error', name)
            } finally { secret = '' }
          }
        } finally {
          running.current = false
          controller.current = null
          if (alive.current) {
            setPassword('')
            notify('done', '', 0)
            statusRef.current(abort.signal.aborted ? 'cancelled' :
              results.some(result => result.error) ? 'error' : 'done', '')
          }
        }
      }

      return {
        state, format, hover, password, setPassword, drop, cancel,
        setFormat(value) {
          setFormatValue(value)
          try { localStorage.setItem('tachibana-pet:audio-format', value) } catch {}
        },
        dragOver(event) {
          if (!Array.from(event.dataTransfer.types).includes('Files')) return
          event.preventDefault()
          event.stopPropagation()
          event.dataTransfer.dropEffect = running.current ? 'none' : 'copy'
          setHover(!running.current)
        },
        dragLeave() { setHover(false) },
        close() { if (!running.current) setState(value => ({ ...value, phase: 'idle' })) },
        submitPassword(event) {
          event.preventDefault()
          const reply = passwordReply.current
          passwordReply.current = null
          const value = password
          setPassword('')
          reply?.(value)
        },
        async open(id) {
          try { await request({ action: 'open', id }) } catch (error) {
            setState(value => ({ ...value, message: error.message }))
          }
        },
      }
    }

    function FileToolsPanel({ tools }) {
      const { state } = tools
      if (state.phase === 'idle') return null
      const busy = state.phase === 'busy' || state.phase === 'password'
      return h('section', {
        className: 'tp-file-panel', role: 'region', 'aria-label': '若藻文件处理',
        onPointerDown: event => event.stopPropagation(),
        onKeyDown: event => event.stopPropagation(),
      },
        h('header', null,
          h('h3', null, state.phase === 'password' ? '需要压缩包密码' :
            busy ? `正在处理（剩余 ${state.remaining}）` : '处理结果'),
          h('button', { type: 'button', onClick: busy ? tools.cancel : tools.close },
            busy ? '取消' : '关闭')),
        state.name ? h('p', null, state.name) : null,
        state.message ? h('p', { role: 'status' }, state.message) : null,
        state.phase === 'password' ? h('form', { onSubmit: tools.submitPassword },
          h('input', {
            type: 'password', value: tools.password, autoComplete: 'off', autoFocus: true,
            'aria-label': '压缩包密码', maxLength: 512,
            onChange: event => tools.setPassword(event.target.value),
          }),
          h('button', { type: 'submit' }, '解压'),
        ) : null,
        state.phase === 'busy' ? h('p', { role: 'status', 'aria-live': 'polite' }, '处理中…') : null,
        state.results.map((result, index) => h('div', { key: index, className: 'tp-file-result' },
          h('p', null, result.name || '文件'),
          result.error ? h('p', { className: 'tp-file-error' }, result.error) :
            h(React.Fragment, null,
              h('div', { className: 'tp-file-row' },
                h('span', null, result.kind === 'archive' ? '解压完成' : '转换完成'),
                h('button', { type: 'button', onClick: () => tools.open(result.id) }, '打开文件夹')),
              h('p', { className: 'tp-file-path' }, result.output))),
        ),
      )
    }
