(() => {
      const deploymentMeta = document.getElementById('deploymentMeta');

      async function renderDeploymentMeta() {
        if (!deploymentMeta) return;
        try {
          const response = await fetch('../build-info.json', {cache: 'no-store'});
          if (!response.ok) return;
          const info = await response.json();
          const branch = String(info.branch || '');
          const mode = String(info.environment || '').toLowerCase();

          if (!branch || branch === 'main' || mode === 'prod' || mode === 'production') return;

          const label =
            mode === 'stage' ? 'STAGE' :
            mode === 'dev' ? 'DEV' :
            mode === 'feature' || branch.startsWith('feature/') ? 'FEATURE' :
            branch.toUpperCase();

          const commit = String(info.commit || '').slice(0, 7);
          const shortBranch = branch.startsWith('feature/') ? branch.slice('feature/'.length) : branch;

          deploymentMeta.className = 'deployment-meta deployment-' + (mode || 'feature');
          deploymentMeta.innerHTML =
            '<span class="deployment-dot"></span>' +
            '<strong>' + label + '</strong>' +
            '<span class="deployment-branch">' + shortBranch + '</span>' +
            (commit ? '<code>' + commit + '</code>' : '');

          deploymentMeta.title =
            'Branch: ' + branch +
            (commit ? '\nCommit: ' + commit : '') +
            (info.deployedAt ? '\nDeployed: ' + info.deployedAt : '');

          deploymentMeta.hidden = false;
        } catch {}
      }

      const themeToggle = document.getElementById('themeToggle');
      const themeIcon = document.getElementById('themeIcon');
      const themeLabel = document.getElementById('themeLabel');

      function currentTheme() {
        return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      }

      function syncThemeButton() {
        const isDark = currentTheme() === 'dark';
        themeToggle.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
        themeLabel.textContent = isDark ? 'Light' : 'Dark';
        themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
        if (window.lucide) window.lucide.createIcons();
      }

      themeToggle.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        localStorage.setItem('cs-roadmap-theme', next);
        syncThemeButton();
      });

      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
      systemTheme.addEventListener?.('change', event => {
        if (localStorage.getItem('cs-roadmap-theme')) return;
        document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
        syncThemeButton();
      });

      const details = {
        data: {
          step: 'STEP 01 · CS', icon: 'binary', title: 'Bit · Byte · Encoding',
          summary: '컴퓨터가 숫자·문자·파일·네트워크 데이터를 어떤 단위로 저장하고 해석하는지 보는 출발점입니다.',
          route: ['Bit / Byte', 'Encoding', 'Memory'],
          keywords: ['2진수 · 16진수', 'Byte', 'Character Encoding', 'Endianness 맛보기'],
          outcomes: ['메모리와 파일이 byte로 보이는 이유', '문자 인코딩이 깨지는 이유', '네이티브 데이터 구조의 바탕']
        },
        cpu: {
          step: 'STEP 01 · CS', icon: 'cpu', title: 'CPU · Cache · Memory',
          summary: 'CPU와 메모리의 속도 차이, 캐시가 필요한 이유, 프로그램 성능이 하드웨어와 연결되는 지점을 봅니다.',
          route: ['Bit / Byte', 'CPU · Cache', 'Process'],
          keywords: ['CPU · Register', 'L1/L2/L3 Cache', 'Locality', 'Memory Latency'],
          outcomes: ['자료구조에 따라 성능이 달라지는 이유', 'JVM·DB에서 메모리 접근이 중요한 이유']
        },
        process: {
          step: 'STEP 02 · OS', icon: 'app-window', title: 'Process',
          summary: '실행 중인 프로그램을 OS가 관리하는 기본 단위입니다.',
          route: ['Program', 'Process', 'Thread / Virtual Memory'],
          keywords: ['PID', 'Process State', 'fork / exec', '/proc'],
          outcomes: ['Docker 안에서도 결국 프로세스가 실행됨', 'daemon·worker 구조의 바탕']
        },
        syscall: {
          step: 'STEP 02 · OS / CS', icon: 'shield-check', title: 'Interrupt · Syscall',
          summary: '일반 프로그램이 파일·네트워크 같은 커널 기능을 안전하게 요청하는 경계입니다.',
          route: ['Process', 'User / Kernel Mode', 'System Call'],
          keywords: ['User / Kernel Mode', 'Interrupt / Exception', 'System Call', 'strace'],
          outcomes: ['파일 I/O가 커널을 거치는 이유', 'strace에 호출이 보이는 이유']
        },
        vm: {
          step: 'STEP 02 · OS / CS', icon: 'memory-stick', title: 'Virtual Memory',
          summary: '프로그램마다 자기만의 메모리가 있는 것처럼 보이게 하는 OS의 핵심 기능입니다.',
          route: ['Process', 'Virtual Memory', 'Page Cache / cgroup'],
          keywords: ['Virtual / Physical Address', 'Page Table', 'Page Fault', 'MMU · TLB'],
          outcomes: ['JVM Heap과 RSS 차이', 'Docker Memory Limit과 OOM', 'mmap과 Page Cache 관계']
        },
        thread: {
          step: 'STEP 03 · OS', icon: 'split', title: 'Thread · Context Switch',
          summary: '한 프로세스 안에서 여러 실행 흐름이 돌아가고 CPU가 작업을 바꾸는 방식을 봅니다.',
          route: ['Process', 'Thread', 'Synchronization'],
          keywords: ['Thread', 'Scheduling', 'Context Switch', 'CPU-bound / I/O-bound'],
          outcomes: ['Thread Pool', 'Event Loop와 일반 Thread 차이', 'Thread가 많다고 항상 빠르지 않은 이유']
        },
        sync: {
          step: 'STEP 03 · OS / DB', icon: 'lock-keyhole', title: 'Lock · Atomic · Race',
          summary: '여러 작업이 같은 데이터를 동시에 바꿀 때 생기는 문제와 해결 방향입니다.',
          route: ['Thread', 'Race Condition', 'Lock / Atomic'],
          keywords: ['Critical Section', 'Mutex', 'Deadlock', 'Atomic / CAS'],
          outcomes: ['Java synchronized', 'DB Lock과 Deadlock', 'Lock Contention']
        },
        fd: {
          step: 'STEP 04 · OS / LINUX', icon: 'hash', title: 'File Descriptor',
          summary: 'Linux가 파일·소켓·파이프 같은 입출력 대상을 작은 번호로 다루는 공통 방식입니다.',
          route: ['Syscall', 'File Descriptor', 'File / Socket / Pipe'],
          keywords: ['stdin / stdout / stderr', 'open · read · write', 'Redirection', 'Pipe'],
          outcomes: ['Shell Pipeline', 'Socket', 'epoll', 'lsof']
        },
        fs: {
          step: 'STEP 04 · OS / STORAGE', icon: 'folder-tree', title: 'File System · VFS',
          summary: '파일 이름이 실제 저장장치 데이터와 연결되고 Linux가 여러 파일시스템을 공통 방식으로 다루는 구조입니다.',
          route: ['File Descriptor', 'File System', 'Page Cache'],
          keywords: ['inode', 'directory entry', 'mount', 'VFS'],
          outcomes: ['Docker Volume', 'DB Data File', 'mount와 inode 문제']
        },
        pagecache: {
          step: 'STEP 04 · LINUX / DB', icon: 'layers', title: 'Page Cache · fsync',
          summary: '파일에 쓴 데이터가 바로 디스크로 가지 않고 메모리를 거치는 이유를 봅니다.',
          route: ['File System', 'Page Cache', 'WAL / Durability'],
          keywords: ['Buffered I/O', 'Dirty Page', 'Writeback', 'fsync'],
          outcomes: ['DB WAL이 필요한 이유', '쓰기 완료와 디스크 저장이 다른 이유']
        },
        ip: {
          step: 'STEP 05 · NETWORK', icon: 'map', title: 'IP · Routing',
          summary: '데이터가 어느 주소로 가고 여러 네트워크를 지나 어떤 경로를 선택하는지 보는 출발점입니다.',
          route: ['IP Address', 'Routing', 'DNS / TCP'],
          keywords: ['IP Address', 'Subnet', 'Gateway', 'Routing Table'],
          outcomes: ['같은 네트워크와 다른 네트워크의 차이', 'Docker·Cloud Network의 바탕']
        },
        dns: {
          step: 'STEP 05 · NETWORK', icon: 'book-key', title: 'DNS',
          summary: '사람이 쓰는 도메인 이름을 실제 통신에 필요한 IP 주소로 바꾸는 과정입니다.',
          route: ['IP / Routing', 'DNS', 'TCP / HTTP'],
          keywords: ['Resolver', 'DNS Record', 'Cache', 'Name Resolution'],
          outcomes: ['도메인 장애 원인', '서비스 이름과 실제 서버 주소의 관계']
        },
        tcp: {
          step: 'STEP 05 · NETWORK / OS', icon: 'plug-zap', title: 'TCP · Socket',
          summary: '프로그램끼리 네트워크 연결을 만들고 데이터를 주고받는 기본 구조입니다.',
          route: ['IP / DNS', 'TCP · Socket', 'HTTP / epoll'],
          keywords: ['3-way Handshake', 'Socket', 'Port', 'Timeout · Backlog'],
          outcomes: ['HTTP 서버', 'DB Connection Pool', 'Nginx', 'Docker Port Mapping']
        },
        http: {
          step: 'STEP 05 · NETWORK', icon: 'globe-lock', title: 'HTTP · TLS',
          summary: '웹과 API가 요청·응답을 주고받고 HTTPS가 통신을 보호하는 기본 구조입니다.',
          route: ['DNS / TCP', 'HTTP · TLS', 'API / Reverse Proxy'],
          keywords: ['Request / Response', 'Method / Status', 'Header', 'TLS / Certificate'],
          outcomes: ['REST API', 'HTTPS', 'Reverse Proxy', '인증서 오류']
        },
        epoll: {
          step: 'STEP 05 · LINUX / NETWORK', icon: 'radio-tower', title: 'epoll · Event Loop',
          summary: '한 스레드가 많은 소켓의 준비 상태를 효율적으로 감시하는 Linux 방식입니다.',
          route: ['File Descriptor', 'Socket', 'epoll / Event Loop'],
          keywords: ['Blocking / Non-blocking', 'Readiness', 'epoll', 'Event Loop'],
          outcomes: ['Nginx', 'Netty', 'Node.js', '고성능 서버 구조']
        },
        shell: {
          step: 'STEP 06 · LINUX', icon: 'terminal', title: 'Shell · Pipe',
          summary: '작은 명령의 입력과 출력을 이어서 로그 분석이나 반복 작업을 빠르게 처리하는 방식입니다.',
          route: ['File Descriptor', 'Pipe', 'Shell Pipeline'],
          keywords: ['stdin / stdout', 'Redirection', 'grep', 'sort · uniq · awk · xargs'],
          outcomes: ['로그 필터링', '집계', '간단한 자동화', '운영 작업 효율']
        },
        observe: {
          step: 'STEP 06 · LINUX', icon: 'scan-search', title: 'Observability',
          summary: '느리다·메모리가 많다 같은 증상에서 CPU·메모리·네트워크·디스크 중 원인을 좁히는 관점입니다.',
          route: ['Process', 'System Metrics', 'Subsystem'],
          keywords: ['ps / top', 'vmstat', 'ss', 'iostat', 'strace'],
          outcomes: ['장애 대응', '성능 문제 원인 좁히기', 'Docker Troubleshooting']
        },
        container: {
          step: 'STEP 06 · LINUX', icon: 'container', title: 'Namespace · cgroup',
          summary: '프로세스를 격리하고 CPU·메모리 같은 자원 사용을 제한하는 Linux 기능입니다.',
          route: ['Process / VM', 'Namespace · cgroup', 'Docker'],
          keywords: ['PID / Mount / Network Namespace', 'cgroup v2', 'CPU Quota', 'Memory Limit'],
          outcomes: ['Docker', 'Kubernetes', 'Container OOM', 'CPU Limit']
        },
        jvm: {
          step: 'STEP 07 · RUNTIME', icon: 'coffee', title: 'JVM ↔ OS',
          summary: 'JVM도 결국 OS의 프로세스·스레드·메모리·파일·소켓 위에서 실행된다는 연결입니다.',
          route: ['OS Basics', 'JVM ↔ OS', 'Application Performance'],
          keywords: ['Heap / RSS', 'Native Memory', 'OS Thread', 'FD / Socket'],
          outcomes: ['JVM OOM', 'Thread Dump', 'Native Memory', 'GC와 OS 관계']
        },
        mvcc: {
          step: 'STEP 07 · DATABASE', icon: 'list-tree', title: 'Index · Transaction · MVCC',
          summary: 'DB가 빠르게 찾고 여러 작업이 동시에 실행되어도 데이터가 꼬이지 않게 하는 핵심 구조입니다.',
          route: ['Lock / Storage', 'Index · Transaction', 'MVCC'],
          keywords: ['B-Tree', 'ACID', 'Isolation Level', 'Lock / MVCC'],
          outcomes: ['Query Tuning', 'Deadlock', 'Long Transaction', 'Execution Plan']
        },
        wal: {
          step: 'STEP 07 · DATABASE / OS', icon: 'database-backup', title: 'Buffer Pool · WAL',
          summary: 'DB가 메모리와 로그를 함께 사용해 빠르면서도 장애 후 복구 가능하게 만드는 구조입니다.',
          route: ['Page Cache', 'Buffer Pool · WAL', 'Recovery'],
          keywords: ['Buffer Pool', 'WAL', 'Checkpoint', 'Durability'],
          outcomes: ['Crash Recovery', 'fsync 지연', 'DB 저장 구조']
        },
        distributed: {
          step: 'STEP 08 · DISTRIBUTED', icon: 'waypoints', title: 'Distributed Systems',
          summary: '한 서버의 지식을 여러 서버 환경의 실패·복제·일관성 문제로 확장합니다.',
          route: ['Network / DB', 'Distributed', 'Replication / Consensus'],
          keywords: ['Partial Failure', 'Replication', 'Consistency', 'Quorum / Consensus'],
          outcomes: ['Kafka', 'Redis Cluster', 'DB Replication', 'Timeout · Retry · Idempotency']
        },
        native: {
          step: 'STEP 09 · NATIVE', icon: 'braces', title: 'C · Pointer · ABI',
          summary: '커널 소스와 네이티브 프로그램을 읽기 위한 C 메모리 모델과 호출 규약의 핵심만 봅니다.',
          route: ['Memory Basics', 'C · ABI', 'Compile / Link'],
          keywords: ['Pointer', 'Struct Layout', 'Stack / Heap', 'Calling Convention / ABI'],
          outcomes: ['JNI', 'System Call ABI', 'Native Profiling', 'Kernel Source']
        },
        elf: {
          step: 'STEP 09 · NATIVE', icon: 'package-open', title: 'Compile · Link · ELF',
          summary: '작성한 코드가 실행 파일이 되고 라이브러리와 연결되어 프로세스로 시작되는 흐름입니다.',
          route: ['C / ABI', 'Compile · Link · ELF', 'Process'],
          keywords: ['Object File', 'Link', 'Shared Library', 'ELF / Loader / Symbol'],
          outcomes: ['undefined symbol', '공유 라이브러리 문제', '실행 파일 내부 구조']
        },
        kernel: {
          step: 'STEP 09 · KERNEL', icon: 'microchip', title: 'Scheduler · MM · VFS',
          summary: '프로세스·메모리·파일·네트워크 개념을 Linux 커널 내부 구현까지 내려가서 보는 심화 영역입니다.',
          route: ['OS / Linux Basics', 'Kernel Internals', 'Source Reading'],
          keywords: ['Scheduler', 'Memory Management', 'VFS', 'Network Stack'],
          outcomes: ['Latency Spike', 'Container OOM 내부', 'Filesystem / Network Kernel Path']
        }
      };

      const detail = document.getElementById('detail');
      const backdrop = document.getElementById('detailBackdrop');
      const close = document.getElementById('detailClose');
      const eyebrow = document.getElementById('detailEyebrow');
      const title = document.getElementById('detailTitle');
      const summary = document.getElementById('detailSummary');
      const route = document.getElementById('detailRoute');
      const keywords = document.getElementById('detailKeywords');
      const outcomes = document.getElementById('detailOutcomes');
      const detailAcademicSection = document.getElementById('detailAcademicSection');
      const detailAcademic = document.getElementById('detailAcademic');
      const detailMathSection = document.getElementById('detailMathSection');
      const detailMathBadges = document.getElementById('detailMathBadges');
      const detailMathCopy = document.getElementById('detailMathCopy');
      const iconHost = document.querySelector('.detail-icon');
      const promptButton = document.getElementById('promptButton');
      const bookButton = document.getElementById('bookButton');
      const learningModal = document.getElementById('learningModal');
      const learningModalBackdrop = document.getElementById('learningModalBackdrop');
      const learningModalClose = document.getElementById('learningModalClose');
      const learningModalKicker = document.getElementById('learningModalKicker');
      const learningModalTitle = document.getElementById('learningModalTitle');
      const learningModalBody = document.getElementById('learningModalBody');
      let activeDetail = details.vm;
      let activeConceptId = null;
      const academicSection = document.getElementById('academicCurriculum');
      const courseGrid = document.getElementById('courseGrid');
      const courseCountBadge = document.getElementById('courseCountBadge');
      const mathGrid = document.getElementById('mathGrid');
      const catalogSection = document.getElementById('curriculumCatalog');
      const catalogSearch = document.getElementById('catalogSearch');
      const catalogYear = document.getElementById('catalogYear');
      const catalogCourse = document.getElementById('catalogCourse');
      const catalogArea = document.getElementById('catalogArea');
      const catalogSubarea = document.getElementById('catalogSubarea');
      const catalogMathLevel = document.getElementById('catalogMathLevel');
      const catalogImportance = document.getElementById('catalogImportance');
      const catalogReset = document.getElementById('catalogReset');
      const catalogGrid = document.getElementById('catalogGrid');
      const catalogPager = document.getElementById('catalogPager');
      const catalogStatus = document.getElementById('catalogStatus');
      const catalogCountBadge = document.getElementById('catalogCountBadge');
      let curriculumConcepts = [];
      let curriculumTaxonomy = [];
      let curriculumCourses = [];
      let curriculumMathTopics = [];
      let curriculumSearchEntries = [];
      let academicYearFilter = '';
      let catalogPage = 1;
      const catalogPageSize = 12;

      const topSearchButton = document.getElementById('topSearchButton');
      const learningResourcesButton = document.getElementById('learningResourcesButton');
      const searchInput = document.getElementById('search');
      const searchSubmit = document.getElementById('searchSubmit');
      const searchFeedback = document.getElementById('searchFeedback');

      function renderDetail(data) {
        activeDetail = data;
        activeConceptId = data.conceptId || null;
        eyebrow.textContent = data.step;
        title.textContent = data.title;
        summary.textContent = data.summary;
        route.innerHTML = data.route.map((x, i) =>
          '<span class="route-node">' + x + '</span>' + (i < data.route.length - 1 ? '<span>→</span>' : '')
        ).join('');
        keywords.innerHTML = data.keywords.map(x => '<span class="keyword">' + x + '</span>').join('');
        outcomes.innerHTML = data.outcomes.map(x => '<li>' + x + '</li>').join('');

        const courses=(data.courseIds||[]).map(courseMeta).filter(Boolean);
        if(courses.length || (data.typicalYears||[]).length){
          detailAcademicSection.hidden=false;
          detailAcademic.innerHTML=
            '<span class="academic-year-badge">'+yearLabel(data.typicalYears)+'</span>'+
            courses.slice(0,3).map(c=>'<span class="badge domain">'+c.title+'</span>').join('');
        }else{
          detailAcademicSection.hidden=true;
          detailAcademic.innerHTML='';
        }

        const mathRows=(data.mathPrerequisites||[]).map(mathMeta).filter(Boolean);
        if(data.mathLevel || mathRows.length){
          detailMathSection.hidden=false;
          detailMathBadges.innerHTML=
            '<span class="math-level-badge '+(data.mathLevel||'low')+'">'+mathLevelLabel(data.mathLevel||'low')+'</span>'+
            mathRows.map(m=>'<span class="badge domain">'+m.code+' · '+m.title+'</span>').join('');
          detailMathCopy.textContent=
            (data.mathLevel==='high' ? '관련 수학을 먼저 또는 함께 공부하는 편이 좋습니다.' :
             data.mathLevel==='medium' ? '막히는 수학이 나올 때 해당 항목만 보충해도 됩니다.' :
             '수학 때문에 이 주제 학습을 미룰 필요는 없습니다.');
        }else{
          detailMathSection.hidden=true;
          detailMathBadges.innerHTML='';
          detailMathCopy.textContent='';
        }

        iconHost.innerHTML = '<i data-lucide="' + data.icon + '" class="icon icon-lg"></i>';
        if (window.lucide) window.lucide.createIcons();
      }




      const areaIcons = {
        foundations:'binary','data-structures':'braces','algorithms':'route',architecture:'cpu',os:'layers-3',
        linux:'terminal',network:'network',storage:'hard-drive',database:'database',runtime:'box',
        backend:'server',container:'container',distributed:'waypoints',security:'shield-check',native:'code-2',kernel:'microchip'
      };

      function areaMeta(id) {
        return curriculumTaxonomy.find(x => x.id === id) || {id,label:id,subareas:[],aliases:[]};
      }

      function courseMeta(id) {
        return curriculumCourses.find(x => x.id === id) || null;
      }

      function mathMeta(id) {
        return curriculumMathTopics.find(x => x.id === id) || null;
      }

      function yearLabel(years) {
        const list=[...new Set((years||[]).map(Number).filter(Boolean))].sort((a,b)=>a-b);
        if(!list.length) return '학년 정보 없음';
        if(list.length===1) return list[0]+'학년';
        return list[0]+'~'+list[list.length-1]+'학년';
      }

      function mathLevelLabel(level) {
        return level==='high' ? '수학 높음' : level==='medium' ? '수학 중간' : '수학 낮음';
      }

      function renderCourseMap() {
        if(!courseGrid) return;
        const rows=curriculumCourses
          .filter(c=>!academicYearFilter || (c.typicalYears||[]).includes(Number(academicYearFilter)))
          .sort((a,b)=>(Math.min(...(a.typicalYears||[9]))-Math.min(...(b.typicalYears||[9]))) || a.title.localeCompare(b.title,'ko'));

        courseCountBadge.innerHTML='<i data-lucide="book-copy" class="icon icon-sm"></i>'+curriculumCourses.length+'개 과목';
        courseGrid.innerHTML=rows.map(c=>{
          const conceptCount=curriculumConcepts.filter(x=>(x.courseIds||[]).includes(c.id)).length;
          const modules=(c.modules||[]).slice(0,5).map(x=>'<span class="course-module">'+x+'</span>').join('');
          return '<button class="course-card" type="button" data-course-id="'+c.id+'">'+
            '<span class="course-card-head"><span><h3>'+c.title+'</h3><small>'+c.titleEn+'</small></span>'+
            '<span class="academic-year-badge">'+yearLabel(c.typicalYears)+'</span></span>'+
            '<span class="course-modules">'+modules+'</span>'+
            '<span class="course-meta"><span class="math-level-badge '+c.mathLevel+'">'+mathLevelLabel(c.mathLevel)+'</span>'+
            '<span class="badge domain">'+conceptCount+'개 개념</span></span>'+
          '</button>';
        }).join('');

        document.querySelectorAll('[data-academic-year]').forEach(btn=>
          btn.classList.toggle('active',(btn.dataset.academicYear||'')===academicYearFilter)
        );
        courseGrid.querySelectorAll('[data-course-id]').forEach(btn=>btn.addEventListener('click',()=>{
          catalogSearch.value='';
          catalogYear.value='';
          catalogArea.value='';
          catalogSubarea.value='';
          catalogMathLevel.value='';
          catalogImportance.value='';
          setCatalogCourse(btn.dataset.courseId||'');
        }));
        if(window.lucide) window.lucide.createIcons();
      }

      function renderMathMap() {
        if(!mathGrid) return;
        const priorityLabel={now:'지금 확인',early:'초반에 보충','when-needed':'필요할 때',later:'나중에 필요'};
        mathGrid.innerHTML=curriculumMathTopics.map(m=>
          '<article class="math-card">'+
            '<span class="math-code">'+m.code+'</span>'+
            '<div class="math-card-body"><strong>'+m.title+'</strong><p>'+m.summary+'</p><span class="math-priority">'+(priorityLabel[m.priority]||'필요할 때')+' · '+m.schoolLevel+'</span></div>'+
            '<div class="math-card-actions">'+
              '<button class="math-action-btn" type="button" data-math-concepts="'+m.id+'"><i data-lucide="link" class="icon icon-sm"></i>연결 개념</button>'+
              '<button class="math-action-btn primary" type="button" data-math-prompt="'+m.id+'"><i data-lucide="sparkles" class="icon icon-sm"></i>AI 프롬프트</button>'+
            '</div>'+
          '</article>'
        ).join('');

        mathGrid.querySelectorAll('[data-math-concepts]').forEach(btn=>btn.addEventListener('click',()=>{
          const m=mathMeta(btn.dataset.mathConcepts);
          if(!m)return;
          catalogYear.value='';
          catalogCourse.value='';
          catalogArea.value='';
          catalogSubarea.value='';
          catalogMathLevel.value='';
          catalogImportance.value='';
          catalogSearch.value=m.title;
          catalogPage=1;
          renderCatalog();
          catalogSection.scrollIntoView({behavior:'smooth',block:'start'});
        }));

        mathGrid.querySelectorAll('[data-math-prompt]').forEach(btn=>btn.addEventListener('click',()=>{
          const m=mathMeta(btn.dataset.mathPrompt);
          if(m) openMathLearningPrompt(m);
        }));

        if(window.lucide) window.lucide.createIcons();
      }

      function conceptToDetail(c) {
        const prereqTitles=(c.prerequisites||[]).map(id=>{
          const found=curriculumConcepts.find(x=>x.id===id);
          return found ? (found.titleEn || found.titleKo) : id;
        }).slice(0,3);
        const routeParts=[...prereqTitles, c.titleEn || c.titleKo].slice(-3);
        return {
          conceptId:c.id,
          area:c.area,
          subarea:c.subarea || '',
          step:(areaMeta(c.area).label || c.area) + ' · ' + (c.subarea || ''),
          icon:areaIcons[c.area] || 'book-open',
          title:c.titleEn || c.titleKo,
          summary:c.summary || '',
          route:routeParts.length ? routeParts : [c.titleEn || c.titleKo],
          keywords:(c.learn || []).slice(0,6),
          outcomes:(c.outcomes || []).slice(0,4),
          courseIds:c.courseIds || [],
          typicalYears:c.typicalYears || [],
          mathLevel:c.mathLevel || 'low',
          mathPrerequisites:c.mathPrerequisites || []
        };
      }

      function updateCatalogSubareas() {
        const selected=catalogArea.value;
        const area=areaMeta(selected);
        const current=catalogSubarea.value;
        const list=selected ? (area.subareas || []) : [...new Set(curriculumConcepts.map(c=>c.subarea).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ko'));
        catalogSubarea.innerHTML='<option value="">전체 세부 영역</option>'+list.map(x=>'<option value="'+x+'">'+x+'</option>').join('');
        if(list.includes(current)) catalogSubarea.value=current;
      }

      function catalogMatchesQuery(c,q) {
        if(!q) return true;
        const n=normalizeSearch(q);
        const stopWords=new Set(['필요','관련','과목','개념','보기','공부']);
        const tokens=n.split(/\s+/).filter(Boolean).filter(token=>!stopWords.has(token));
        const area=areaMeta(c.area);
        const courses=(c.courseIds||[]).map(courseMeta).filter(Boolean);
        const searchable=[
          c.titleKo,c.titleEn,c.summary,c.course,c.subarea,area.label,
          ...(area.aliases||[]),...(c.aliases||[]),...(c.learn||[]),...(c.outcomes||[]),
          ...courses.flatMap(x=>[x.title,x.titleEn,...(x.aliases||[])]),
          ...((c.typicalYears||[]).flatMap(y=>[y+'학년','대학교 '+y+'학년','컴공 '+y+'학년']))
        ].filter(Boolean).map(normalizeSearch);

        const tokenMatches=(token)=>{
          if(searchable.some(v=>v===token || (token.length>3 && v.includes(token)))) return true;
          return curriculumSearchEntries.some(e=>{
            const term=normalizeSearch(e.term);
            const termMatch=term===token || (token.length>3 && term.includes(token));
            return termMatch && (e.conceptIds||[]).includes(c.id);
          });
        };

        return tokens.every(token=>tokenMatches(token));
      }

      function filteredCatalog() {
        const q=catalogSearch.value.trim();
        return curriculumConcepts.filter(c=>{
          if(catalogYear.value && !(c.typicalYears||[]).includes(Number(catalogYear.value))) return false;
          if(catalogCourse.value && !(c.courseIds||[]).includes(catalogCourse.value)) return false;
          if(catalogArea.value && c.area!==catalogArea.value) return false;
          if(catalogSubarea.value && c.subarea!==catalogSubarea.value) return false;
          if(catalogMathLevel.value && c.mathLevel!==catalogMathLevel.value) return false;
          if(catalogImportance.value && c.importance!==catalogImportance.value) return false;
          return catalogMatchesQuery(c,q);
        }).sort((a,b)=>{
          const rank={core:0,connect:1,deep:2};
          return (rank[a.importance]??3)-(rank[b.importance]??3) ||
            areaMeta(a.area).label.localeCompare(areaMeta(b.area).label,'ko') ||
            (a.titleKo||a.titleEn).localeCompare(b.titleKo||b.titleEn,'ko');
        });
      }

      function renderCatalog() {
        const rows=filteredCatalog();
        const totalPages=Math.max(1,Math.ceil(rows.length/catalogPageSize));
        if(catalogPage>totalPages) catalogPage=totalPages;
        const start=(catalogPage-1)*catalogPageSize;
        const pageRows=rows.slice(start,start+catalogPageSize);

        catalogCountBadge.innerHTML='<i data-lucide="database" class="icon icon-sm"></i>'+curriculumConcepts.length+'개 개념 · '+curriculumCourses.length+'개 과목';
        catalogStatus.innerHTML='<strong>'+rows.length+'개</strong> 결과 · '+catalogPage+' / '+totalPages+' 페이지';

        if(!pageRows.length){
          catalogGrid.innerHTML='<div class="catalog-empty">조건에 맞는 개념이 없습니다. 영역이나 검색어를 바꿔보세요.</div>';
        }else{
          catalogGrid.innerHTML=pageRows.map(c=>{
            const area=areaMeta(c.area);
            const importance=c.importance||'connect';
            const label=importance==='core'?'핵심':importance==='deep'?'심화':'연결';
            return '<button class="catalog-card" type="button" data-concept-id="'+c.id+'">'+
              '<span class="catalog-card-head">'+
                '<span class="catalog-card-icon"><i data-lucide="'+(areaIcons[c.area]||'book-open')+'" class="icon"></i></span>'+
                '<span class="catalog-card-title"><strong>'+c.titleKo+'</strong><small>'+c.titleEn+'</small></span>'+
              '</span>'+
              '<p>'+c.summary+'</p>'+
              '<span class="catalog-card-meta"><span class="badge '+importance+'">'+label+'</span>'+
              '<span class="academic-year-badge">'+yearLabel(c.typicalYears)+'</span>'+
              '<span class="math-level-badge '+(c.mathLevel||'low')+'">'+mathLevelLabel(c.mathLevel||'low')+'</span>'+
              '<span class="badge domain">'+((courseMeta((c.courseIds||[])[0])||{}).title||area.label)+'</span>'+
              '<span class="badge domain">'+c.subarea+'</span></span>'+
            '</button>';
          }).join('');
        }

        const pages=[];
        const lo=Math.max(1,catalogPage-2), hi=Math.min(totalPages,catalogPage+2);
        pages.push('<button class="page-btn" data-page="'+(catalogPage-1)+'" '+(catalogPage===1?'disabled':'')+' aria-label="이전 페이지">‹</button>');
        if(lo>1) pages.push('<button class="page-btn" data-page="1">1</button>'+(lo>2?'<span class="page-btn" aria-hidden="true">…</span>':''));
        for(let p=lo;p<=hi;p++) pages.push('<button class="page-btn '+(p===catalogPage?'active':'')+'" data-page="'+p+'">'+p+'</button>');
        if(hi<totalPages) pages.push((hi<totalPages-1?'<span class="page-btn" aria-hidden="true">…</span>':'')+'<button class="page-btn" data-page="'+totalPages+'">'+totalPages+'</button>');
        pages.push('<button class="page-btn" data-page="'+(catalogPage+1)+'" '+(catalogPage===totalPages?'disabled':'')+' aria-label="다음 페이지">›</button>');
        catalogPager.innerHTML=pages.join('');

        catalogGrid.querySelectorAll('[data-concept-id]').forEach(btn=>btn.addEventListener('click',()=>{
          const c=curriculumConcepts.find(x=>x.id===btn.dataset.conceptId);
          if(!c)return;
          activeConceptId = c.id;
          renderDetail(conceptToDetail(c));
          openDetail();
        }));
        catalogPager.querySelectorAll('[data-page]').forEach(btn=>btn.addEventListener('click',()=>{
          const page=Number(btn.dataset.page);
          if(!Number.isFinite(page)||page<1||page>totalPages)return;
          catalogPage=page;
          renderCatalog();
          catalogSection.scrollIntoView({behavior:'smooth',block:'start'});
        }));

        document.querySelectorAll('.catalog-chip').forEach(chip=>chip.classList.toggle('active',chip.dataset.area===catalogArea.value));
        if(window.lucide) window.lucide.createIcons();
      }

      async function loadCurriculumData() {
        try {
          const [conceptRes,taxRes,indexRes,courseRes,mathRes]=await Promise.all([
            fetch('./data/concepts.json',{cache:'no-store'}),
            fetch('./data/taxonomy.json',{cache:'no-store'}),
            fetch('./data/search-index.json',{cache:'no-store'}),
            fetch('./data/courses.json',{cache:'no-store'}),
            fetch('./data/math-topics.json',{cache:'no-store'})
          ]);
          if(!conceptRes.ok||!taxRes.ok||!indexRes.ok||!courseRes.ok||!mathRes.ok) throw new Error('data load failed');
          const [conceptData,taxData,indexData,courseData,mathData]=await Promise.all([
            conceptRes.json(),taxRes.json(),indexRes.json(),courseRes.json(),mathRes.json()
          ]);
          curriculumConcepts=conceptData.concepts||[];
          curriculumTaxonomy=taxData.areas||[];
          curriculumCourses=courseData.courses||[];
          curriculumMathTopics=mathData.topics||[];
          curriculumSearchEntries=indexData.entries||[];
          catalogArea.innerHTML='<option value="">전체 영역</option>'+curriculumTaxonomy.map(a=>'<option value="'+a.id+'">'+a.label+'</option>').join('');
          catalogCourse.innerHTML='<option value="">전체 과목</option>'+curriculumCourses
            .slice().sort((a,b)=>(Math.min(...(a.typicalYears||[9]))-Math.min(...(b.typicalYears||[9])))||a.title.localeCompare(b.title,'ko'))
            .map(c=>'<option value="'+c.id+'">'+yearLabel(c.typicalYears)+' · '+c.title+'</option>').join('');
          updateCatalogSubareas();
          renderCourseMap();
          renderMathMap();
          renderCatalog();
        } catch(error) {
          catalogStatus.textContent='커리큘럼 데이터를 불러오지 못했습니다.';
          catalogGrid.innerHTML='<div class="catalog-empty">데이터를 불러오지 못했습니다. 새로고침 후 다시 확인해주세요.</div>';
        }
      }

      function setCatalogCourse(courseId,{scroll=true}={}) {
        catalogCourse.value=courseId||'';
        catalogPage=1;
        renderCatalog();
        if(scroll) catalogSection.scrollIntoView({behavior:'smooth',block:'start'});
      }

      function setCatalogYear(year,{scroll=true}={}) {
        catalogYear.value=year ? String(year) : '';
        catalogPage=1;
        renderCatalog();
        if(scroll) catalogSection.scrollIntoView({behavior:'smooth',block:'start'});
      }

      function setCatalogMathLevel(level,{scroll=true}={}) {
        catalogMathLevel.value=level||'';
        catalogPage=1;
        renderCatalog();
        if(scroll) catalogSection.scrollIntoView({behavior:'smooth',block:'start'});
      }

      function setCatalogArea(areaId,{scroll=true}={}) {
        catalogArea.value=areaId||'';
        catalogPage=1;
        updateCatalogSubareas();
        renderCatalog();
        if(scroll) catalogSection.scrollIntoView({behavior:'smooth',block:'start'});
      }

      catalogYear.addEventListener('change',()=>{catalogPage=1;renderCatalog();});
      catalogCourse.addEventListener('change',()=>{catalogPage=1;renderCatalog();});
      catalogArea.addEventListener('change',()=>{catalogPage=1;updateCatalogSubareas();renderCatalog();});
      catalogSubarea.addEventListener('change',()=>{catalogPage=1;renderCatalog();});
      catalogMathLevel.addEventListener('change',()=>{catalogPage=1;renderCatalog();});
      catalogImportance.addEventListener('change',()=>{catalogPage=1;renderCatalog();});
      catalogSearch.addEventListener('input',()=>{catalogPage=1;renderCatalog();});
      catalogReset.addEventListener('click',()=>{
        catalogSearch.value=''; catalogYear.value=''; catalogCourse.value=''; catalogArea.value=''; catalogMathLevel.value=''; catalogImportance.value=''; catalogPage=1;
        updateCatalogSubareas(); catalogSubarea.value=''; renderCatalog();
      });
      document.querySelectorAll('.catalog-chip').forEach(chip=>chip.addEventListener('click',()=>setCatalogArea(chip.dataset.area||'')));
      document.querySelectorAll('[data-academic-year]').forEach(btn=>btn.addEventListener('click',()=>{
        academicYearFilter=btn.dataset.academicYear||'';
        renderCourseMap();
      }));

      const searchAliases = {
        '가상메모리': 'vm',
        '가상 메모리': 'vm',
        'memory': 'vm',
        'docker 메모리': 'vm',
        'docker memory': 'vm',
        'docker': 'container',
        'cgroup': 'container',
        'namespace': 'container',
        'tcp': 'tcp',
        'socket': 'tcp',
        'linux pipe': 'shell',
        'pipe': 'shell',
        '파이프': 'shell',
        'wal': 'wal',
        'db wal': 'wal',
        'syscall': 'syscall',
        'system call': 'syscall',
        'dns': 'dns',
        'http': 'http',
        'tls': 'http',
        'epoll': 'epoll',
        'thread': 'thread',
        'process': 'process',
        'file descriptor': 'fd',
        'fd': 'fd',
        'jvm': 'jvm'
      };

      function normalizeSearch(value) {
        return value.trim().toLowerCase().replace(/\s+/g, ' ');
      }

      function curriculumQueryFilters(query) {
        const normalized=normalizeSearch(query);
        const yearMatch=normalized.match(/(?:대학교\s*|컴공\s*)?([1-4])학년/);
        const year=yearMatch ? Number(yearMatch[1]) : null;

        const queryTokens=normalized.split(/[^a-z0-9가-힣+.-]+/i).filter(Boolean);
        const course=curriculumCourses.find(c=>
          [c.title,c.titleEn,...(c.aliases||[])].some(name=>{
            const n=normalizeSearch(name);
            if(!n) return false;
            if(normalized===n) return true;
            if(n.length<=3) return queryTokens.includes(n);
            return normalized.includes(n);
          })
        ) || null;

        const mathTopic=curriculumMathTopics.find(m=>
          normalized===normalizeSearch(m.title) ||
          normalized===normalizeSearch(m.title+' 필요') ||
          normalized===normalizeSearch(m.code)
        ) || null;

        let mathLevel=null;
        if(/수학\s*(낮음|거의 없음|부담 낮음)/.test(normalized)) mathLevel='low';
        else if(/수학\s*(중간|병행)/.test(normalized)) mathLevel='medium';
        else if(/수학\s*(높음|선수학습|선수 학습)/.test(normalized)) mathLevel='high';

        if(year || course || mathTopic || mathLevel) return {
          year,
          course:course?.id||null,
          mathTopic:mathTopic?.id||null,
          mathLevel
        };
        return null;
      }

      function findConceptId(query) {
        const normalized = normalizeSearch(query);
        if (!normalized) return null;

        const filters=curriculumQueryFilters(query);
        if(filters) return {filters};

        if (searchAliases[normalized]) return searchAliases[normalized];

        const exactArea=curriculumTaxonomy.find(a=>
          normalizeSearch(a.label)===normalized || (a.aliases||[]).some(x=>normalizeSearch(x)===normalized)
        );
        if(exactArea) return {area:exactArea.id};

        if(curriculumConcepts.length){
          const exact=curriculumConcepts.find(c=>
            normalizeSearch(c.titleKo)===normalized ||
            normalizeSearch(c.titleEn)===normalized ||
            (c.aliases||[]).some(x=>normalizeSearch(x)===normalized)
          );
          if(exact) return {concept:exact.id};
          const indexed=curriculumSearchEntries.find(e=>normalizeSearch(e.term)===normalized);
          if(indexed?.conceptIds?.length) return {concept:indexed.conceptIds[0]};
        }

        const tokens = normalized.split(' ').filter(Boolean);
        let best = null;
        let bestScore = 0;

        for (const [id, data] of Object.entries(details)) {
          const haystack = [
            data.title,
            data.summary,
            ...(data.route || []),
            ...(data.keywords || []),
            ...(data.outcomes || [])
          ].join(' ').toLowerCase();

          const score = tokens.reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0);
          if (score > bestScore) {
            best = id;
            bestScore = score;
          }
        }
        if(bestScore > 0) return best;
        if(curriculumConcepts.length){
          const fuzzy=curriculumConcepts.find(c=>catalogMatchesQuery(c,query));
          if(fuzzy) return {concept:fuzzy.id};
        }
        return null;
      }

      function activateConcept(id, {scroll = true, feedback = true} = {}) {
        const button = document.querySelector('.concept[data-id="' + id + '"]');
        const data = details[id];
        if (!button || !data) return false;

        document.querySelectorAll('.concept').forEach(x => x.classList.remove('active'));
        button.classList.add('active');
        renderDetail(data);

        if (scroll) {
          button.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
        openDetail();

        if (feedback) {
          searchFeedback.textContent = '"' + data.title + '" 위치로 이동했습니다.';
          searchFeedback.className = 'search-feedback success';
        }
        return true;
      }

      function runSearch(rawQuery) {
        const query = rawQuery ?? searchInput.value;
        const found = findConceptId(query);
        if (!normalizeSearch(query)) {
          searchFeedback.textContent = '찾고 싶은 개념이나 기술을 입력해주세요.';
          searchFeedback.className = 'search-feedback error';
          searchInput.focus();
          return;
        }
        if(found && typeof found==='object' && found.filters){
          const filters=found.filters;
          catalogSearch.value='';
          catalogYear.value=filters.year ? String(filters.year) : '';
          catalogCourse.value=filters.course || '';
          catalogMathLevel.value=filters.mathLevel || '';
          catalogArea.value='';
          updateCatalogSubareas();
          if(filters.mathTopic){
            const m=mathMeta(filters.mathTopic);
            catalogSearch.value=m?.title||'';
          }
          catalogPage=1;
          renderCatalog();
          catalogSection.scrollIntoView({behavior:'smooth',block:'start'});
          const parts=[];
          if(filters.year) parts.push(filters.year+'학년');
          if(filters.course) parts.push(courseMeta(filters.course)?.title||'과목');
          if(filters.mathLevel) parts.push(mathLevelLabel(filters.mathLevel));
          if(filters.mathTopic) parts.push(mathMeta(filters.mathTopic)?.title||'수학');
          searchFeedback.textContent='필터 적용: '+parts.join(' · ');
          searchFeedback.className='search-feedback success';
          return;
        }
        if(found && typeof found==='object' && found.area){
          catalogSearch.value='';
          setCatalogArea(found.area);
          searchFeedback.textContent='"'+query+'" 영역 전체를 표시했습니다.';
          searchFeedback.className='search-feedback success';
          return;
        }
        if(found && typeof found==='object' && found.concept){
          const c=curriculumConcepts.find(x=>x.id===found.concept);
          if(c){
            activeConceptId = c.id;
            catalogSearch.value=query;
            catalogYear.value='';
            catalogCourse.value='';
            catalogMathLevel.value='';
            catalogArea.value='';
            updateCatalogSubareas();
            catalogPage=1;
            renderCatalog();
            renderDetail(conceptToDetail(c));
            catalogSection.scrollIntoView({behavior:'smooth',block:'start'});
            openDetail();
            searchFeedback.textContent='"'+c.titleKo+'"를 찾았습니다.';
            searchFeedback.className='search-feedback success';
            return;
          }
        }
        if(typeof found==='string' && activateConcept(found)) return;
        searchFeedback.textContent = '"' + query + '"와 연결된 개념을 아직 찾지 못했습니다.';
        searchFeedback.className = 'search-feedback error';
        return;
      }

      function focusSearch() {
        document.querySelector('.search-card')?.scrollIntoView({behavior: 'smooth', block: 'center'});
        window.setTimeout(() => searchInput.focus({preventScroll: true}), 350);
      }

      function moveToTarget(targetId, sourceButton) {
        const target = document.getElementById(targetId);
        if (!target) return;

        document.querySelectorAll('.side-btn').forEach(x => x.classList.remove('active'));
        document.querySelectorAll('.mobile-filter button').forEach(x => x.classList.remove('active'));
        if (sourceButton) sourceButton.classList.add('active');

        target.scrollIntoView({behavior: 'smooth', block: 'start'});
        const card = target.classList.contains('stage') ? target.querySelector('.stage-card') : null;
        if (card) {
          card.classList.add('nav-flash');
          window.setTimeout(() => card.classList.remove('nav-flash'), 1200);
        }
      }

      topSearchButton.addEventListener('click', focusSearch);
      searchSubmit.addEventListener('click', () => runSearch());
      searchInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') runSearch();
      });
      document.querySelectorAll('.sample[data-query]').forEach(button => {
        button.addEventListener('click', () => {
          const query = button.dataset.query || '';
          searchInput.value = query;
          runSearch(query);
        });
      });
      document.querySelectorAll('[data-target]').forEach(button => {
        button.addEventListener('click', () => moveToTarget(button.dataset.target, button));
      });

      function openLearningResources() {
        learningModal.classList.add('open');
        learningModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        learningModalKicker.textContent = '학습 자료';
        learningModalTitle.textContent = '책을 완독하지 않아도 됩니다';
        learningModalBody.innerHTML =
          '<p class="modal-note">지금 궁금한 개념과 연결된 부분만 먼저 찾는 방식으로 사용합니다.</p>' +
          '<div class="book-guide-list">' +
            '<div class="book-guide-item"><strong>CS · OS 큰 그림</strong><p>혼자 공부하는 컴퓨터 구조+운영체제 · 쉽게 배우는 운영체제</p></div>' +
            '<div class="book-guide-item"><strong>Linux · Native</strong><p>리눅스 시스템 프로그래밍 · 컴퓨터 시스템: 프로그래머의 관점</p></div>' +
            '<div class="book-guide-item"><strong>Network</strong><p>윤성우의 열혈 TCP/IP 소켓 프로그래밍 · 컴퓨터 네트워킹 하향식 접근</p></div>' +
            '<div class="book-guide-item"><strong>Database · Distributed</strong><p>Real MySQL 8.0 · 데이터 중심 애플리케이션 설계</p></div>' +
          '</div>' +
          '<p class="modal-note" style="margin-top:.8rem">개념을 선택한 뒤 우측의 ‘책 키워드’를 누르면 해당 개념에서 먼저 찾아볼 목차 키워드를 보여줍니다.</p>';
        if (window.lucide) window.lucide.createIcons();
      }

      learningResourcesButton.addEventListener('click', openLearningResources);

      const bookGroups = [
        {
          match: /NETWORK|TCP|DNS|HTTP/i,
          books: [
            ['윤성우의 열혈 TCP/IP 소켓 프로그래밍', 'TCP/IP, Socket, Client/Server, I/O 관련 목차를 찾아봅니다.'],
            ['컴퓨터 네트워킹 하향식 접근', 'Application, Transport, Network 계층의 해당 주제를 찾아봅니다.']
          ]
        },
        {
          match: /DATABASE|DB/i,
          books: [
            ['Real MySQL 8.0', 'Index, Transaction, Lock, InnoDB, Execution Plan 관련 목차를 찾아봅니다.'],
            ['데이터 중심 애플리케이션 설계', '저장, 복제, 트랜잭션, 일관성으로 확장할 때 봅니다.']
          ]
        },
        {
          match: /NATIVE|KERNEL/i,
          books: [
            ['컴퓨터 시스템: 프로그래머의 관점', 'Memory, Linking, Exceptional Control Flow, Virtual Memory를 찾아봅니다.'],
            ['리눅스 시스템 프로그래밍', 'Process, File I/O, Memory Mapping, epoll, System Call 관련 목차를 찾아봅니다.']
          ]
        },
        {
          match: /LINUX|CONTAINER/i,
          books: [
            ['리눅스 시스템 프로그래밍', 'Process, File Descriptor, Pipe, Memory, System Call 관련 목차를 찾아봅니다.'],
            ['혼자 공부하는 컴퓨터 구조+운영체제', '프로세스, 메모리, 파일 시스템의 큰 그림을 먼저 잡을 때 봅니다.']
          ]
        },
        {
          match: /OS|CS|MEMORY/i,
          books: [
            ['혼자 공부하는 컴퓨터 구조+운영체제', '현재 키워드와 같은 이름의 절을 먼저 찾아봅니다.'],
            ['쉽게 배우는 운영체제', 'Process, Scheduling, Memory, Synchronization, File System 관련 목차를 찾아봅니다.']
          ]
        },
        {
          match: /DISTRIBUTED/i,
          books: [
            ['데이터 중심 애플리케이션 설계', 'Replication, Partition, Transaction, Consistency 관련 목차를 찾아봅니다.']
          ]
        }
      ];

      function openMathLearningPrompt(mathTopic) {
        const usedBy=(mathTopic.usedBy||[]).join(', ');
        const prompt=`나는 컴퓨터공학을 공부하기 위해 "${mathTopic.title}"을 공부하려고 해.
내 수학 기초는 거의 없다고 생각해줘.

현재 로드맵 설명:
${mathTopic.summary}

이 수학은 주로 다음 CS 주제에서 필요해:
${usedBy || '컴퓨터공학 기초'}

공식을 먼저 외우게 하지 말고 반드시 다음 순서로 가르쳐줘.

1. 왜 이 개념이 필요한지부터 설명
   - 일상적인 상황이나 아주 작은 숫자 예시를 사용
   - "이 개념이 없으면 무엇이 불편한가?"를 먼저 보여줘

2. 직관적으로 눈에 보이게 설명
   - 가능하면 그림을 말로 묘사하거나 표, 수직선, 좌표, 간단한 그래프를 사용
   - 숫자가 실제로 어떻게 변하는지 단계별로 보여줘

3. 핵심 원리를 설명
   - 외울 문장보다 왜 그렇게 되는지를 중심으로 설명
   - 전문 용어는 처음 나올 때 쉬운 말로 한 줄 설명

4. 공식이 있다면 원리를 이해한 다음에만 소개
   - 공식의 각 기호가 무엇을 뜻하는지 설명
   - 왜 그 모양의 공식이 되는지 직관과 연결
   - 공식 암기를 학습 목표로 삼지 마

5. 지금 꼭 필요한 최소 계산만 연습
   - 가장 쉬운 예제부터 2~3개
   - 계산 과정을 한 단계씩 보여줘
   - 계산 실수보다 원리를 이해했는지를 중요하게 봐줘

6. 컴퓨터공학에서 어떻게 쓰이는지 연결
   - 특히 ${usedBy || '관련 CS 개념'}와 연결해서 구체적인 예를 들어줘
   - "이 수학을 알면 해당 CS 개념의 무엇이 이해되는가?"를 설명해줘

7. 지금 알아야 하는 것과 나중에 봐도 되는 것을 구분
   - 현재 CS 학습에 필요 없는 어려운 증명이나 고급 공식은 뒤로 미뤄줘

8. 내가 직접 풀 수 있는 쉬운 문제 3개를 줘
   - 정답을 바로 보여주지 말고 먼저 힌트만 줘
   - 내가 답하면 풀이를 이어서 설명해줘

9. 마지막에 "이제 원래 CS 공부로 돌아가도 되는 기준"을 체크리스트로 만들어줘

10. 책이나 강의를 직접 찾을 수 있도록 마지막에 검색 키워드 5~8개를 추천해줘

초등학생도 이해할 수 있는 쉬운 단어부터 시작해줘.
긴 문단은 쓰지 말고 짧은 단위로 나눠줘.
한 번에 너무 깊게 들어가지 말고 내가 질문하면 다음 단계로 이어가줘.`;

        learningModal.classList.add('open');
        learningModal.setAttribute('aria-hidden','false');
        document.body.style.overflow='hidden';
        learningModalKicker.textContent='수학 · 원리 중심 AI 학습 프롬프트';
        learningModalTitle.textContent=mathTopic.code+' · '+mathTopic.title;
        learningModalBody.innerHTML=
          '<p class="modal-note">공식 암기보다 왜 필요한지·원리·CS 응용을 중심으로 공부하도록 만든 프롬프트입니다.</p>'+
          '<pre class="prompt-box" id="generatedMathPrompt"></pre>'+
          '<div class="copy-feedback" id="mathCopyFeedback"></div>'+
          '<div class="modal-actions"><button class="modal-primary" id="copyMathPromptButton" type="button"><i data-lucide="copy" class="icon icon-sm"></i>AI 프롬프트 복사</button></div>';

        document.getElementById('generatedMathPrompt').textContent=prompt;
        document.getElementById('copyMathPromptButton').addEventListener('click',async()=>{
          try{
            await navigator.clipboard.writeText(prompt);
            document.getElementById('mathCopyFeedback').textContent='복사했습니다.';
          }catch{
            document.getElementById('mathCopyFeedback').textContent='자동 복사가 막혔습니다. 위 내용을 직접 선택해서 복사해주세요.';
          }
        });
        if(window.lucide) window.lucide.createIcons();
      }

      function openLearningModal(type) {
        learningModal.classList.add('open');
        learningModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (type === 'prompt') {
          const keywordText = activeDetail.keywords.join(', ');
          const selectedConcept =
            (activeConceptId && curriculumConcepts.find(c => c.id === activeConceptId)) ||
            curriculumConcepts.find(c =>
              c.titleEn === activeDetail.title ||
              c.titleKo === activeDetail.title
            ) ||
            null;
          const isDataStructure =
            selectedConcept?.area === 'data-structures' ||
            activeDetail.area === 'data-structures' ||
            /자료구조|data structure/i.test(activeDetail.step || '');
          learningModalKicker.textContent = isDataStructure ? '자료구조 시각화 학습 프롬프트' : 'AI 학습 프롬프트';
          learningModalTitle.textContent = activeDetail.title + ' 학습 시작';

          const prompt = isDataStructure
            ? `나는 지금 "${activeDetail.title}" 자료구조를 공부하려고 해.
나는 이 주제를 거의 모르는 초보라고 생각해줘.

로드맵에서 먼저 보라고 한 키워드는:
${keywordText}

다음 방식으로 가르쳐줘.

1. 먼저 "${activeDetail.title}"가 무엇인지 3~5줄로 아주 쉽게 설명
2. 이 자료구조가 왜 필요한지 설명
3. 내부 구조를 눈으로 이해할 수 있게 설명
4. HTML Canvas를 사용해서 이 자료구조를 시각적으로 보여주는 예제를 만들어줘
5. 가능하면 삽입, 삭제, 탐색 또는 접근 동작에 따라 값이나 연결 관계가 어떻게 바뀌는지 단계별로 Canvas에서 보여줘
6. 장점과 단점을 구분해서 정리
7. 조회, 탐색, 삽입, 삭제의 시간복잡도를 표로 정리
8. 언제 쓰면 좋은지와 언제 피하면 좋은지 설명
9. 비슷한 자료구조와 차이점을 짧게 비교
10. 실제 개발에서 어디에 쓰이는지 예시
11. 마지막에 이해했는지 확인할 질문 3개

Canvas 예제 조건:
- HTML 한 파일로 바로 실행 가능하게 작성
- 외부 라이브러리 없이 순수 HTML/CSS/JavaScript만 사용
- 시각화는 반드시 <canvas> 기반으로 작성
- 배열이면 칸, 연결 리스트면 노드와 화살표, 트리면 부모·자식, 그래프면 노드·간선처럼 구조에 맞는 표현 사용
- 값이 이동하거나 연결이 바뀌는 과정이 보이도록 구성
- 시각화 색상과 라벨은 가독성을 우선
- 코드 아래에 코드가 무엇을 보여주는지 짧게 설명

초등학생도 이해할 수 있는 쉬운 단어를 사용해줘.
전문 용어는 처음 나올 때 한 줄로 뜻을 설명해줘.
긴 문단은 쓰지 말고 짧게 정리해줘.
한 번에 너무 깊게 들어가지 말고, 내가 질문하면 다음 단계로 이어가줘.`
            : `나는 지금 "${activeDetail.title}"을 공부하려고 해.
나는 이 주제를 거의 모르는 초보라고 생각해줘.

로드맵에서 먼저 보라고 한 키워드는:
${keywordText}

다음 방식으로 가르쳐줘.

1. 먼저 전체 그림을 3~5줄로 아주 쉽게 설명
2. 위 키워드를 이해하기 좋은 순서로 정리
3. 각 키워드가 왜 필요한지 짧게 설명
4. 지금 꼭 알아야 하는 것과 나중에 봐도 되는 것을 구분
5. 실제 개발에서 어디에 연결되는지 예시
6. 이해했는지 확인할 짧은 질문 3개

초등학생도 이해할 수 있는 쉬운 단어를 사용해줘.
전문 용어는 처음 나올 때 한 줄로 뜻을 설명해줘.
긴 문단은 쓰지 말고 짧게 정리해줘.
한 번에 너무 깊게 들어가지 말고, 내가 질문하면 다음 단계로 이어가줘.`;

          learningModalBody.innerHTML =
            '<p class="modal-note">복사해서 ChatGPT나 사용하는 AI에 그대로 붙여넣으면 됩니다.</p>' +
            '<pre class="prompt-box" id="generatedPrompt"></pre>' +
            '<div class="copy-feedback" id="copyFeedback"></div>' +
            '<div class="modal-actions"><button class="modal-primary" id="copyPromptButton" type="button"><i data-lucide="copy" class="icon icon-sm"></i>프롬프트 복사</button></div>';
          document.getElementById('generatedPrompt').textContent = prompt;
          document.getElementById('copyPromptButton').addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(prompt);
              document.getElementById('copyFeedback').textContent = '복사했습니다.';
            } catch {
              document.getElementById('copyFeedback').textContent = '자동 복사가 막혔습니다. 위 내용을 직접 선택해서 복사해주세요.';
            }
          });
        } else {
          learningModalKicker.textContent = '책 · 강의에서 찾을 위치';
          learningModalTitle.textContent = activeDetail.title + ' 학습 키워드';
          const group = bookGroups.find(item => item.match.test(activeDetail.step)) || bookGroups[4];
          const keywordHtml = activeDetail.keywords.map(x => '<span class="keyword">' + x + '</span>').join('');
          const bookHtml = group.books.map(([name, desc]) =>
            '<div class="book-guide-item"><strong>' + name + '</strong><p>' + desc + '</p></div>'
          ).join('');
          learningModalBody.innerHTML =
            '<p class="modal-note">책을 처음부터 읽기보다 아래 단어를 목차·색인·강의 검색에서 먼저 찾습니다.</p>' +
            '<h3 class="detail-label"><i data-lucide="search" class="icon icon-sm"></i>찾을 키워드</h3>' +
            '<div class="keyword-list">' + keywordHtml + '</div>' +
            '<h3 class="detail-label" style="margin-top:1rem"><i data-lucide="book-open" class="icon icon-sm"></i>우선 찾아볼 책</h3>' +
            '<div class="book-guide-list">' + bookHtml + '</div>';
        }
        if (window.lucide) window.lucide.createIcons();
      }

      function closeLearningModal() {
        learningModal.classList.remove('open');
        learningModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }

      promptButton.addEventListener('click', () => openLearningModal('prompt'));
      bookButton.addEventListener('click', () => openLearningModal('book'));
      learningModalClose.addEventListener('click', closeLearningModal);
      learningModalBackdrop.addEventListener('click', closeLearningModal);

      function openDetail() {
        if (window.matchMedia('(max-width: 60rem)').matches) {
          document.body.classList.add('detail-open');
        }
      }

      function closeDetail() {
        document.body.classList.remove('detail-open');
      }

      document.querySelectorAll('.concept').forEach(button => {
        button.addEventListener('click', () => {
          activateConcept(button.dataset.id, {scroll: false, feedback: false});
        });
      });

      close.addEventListener('click', closeDetail);
      backdrop.addEventListener('click', closeDetail);

      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          closeDetail();
          closeLearningModal();
        }
        if (event.key === '/' && !/input|select|textarea/i.test(document.activeElement.tagName)) {
          event.preventDefault();
          focusSearch();
        }
      });

      if (window.lucide) window.lucide.createIcons();
      syncThemeButton();
      renderDeploymentMeta();
      loadCurriculumData();
    })();
