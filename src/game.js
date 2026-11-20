'use strict';
// ====== 조선의 위기 디펜스 : 클라이언트 + 호스트 시뮬레이션 ======
const VER = 'v0.33';
const UPDATES = [
  { v: 'v0.33', d: '11/20', t: ['🎖 영웅 숙련도 개편! 판이 끝나면 남은 식량이 쌓이고, 그 식량으로 패시브(피해량·최대 체력·방어력·치명타·이동 속도·체력 재생·범위·스킬 가속·경험치·식량 획득)를 Lv.5까지 키워요. 모든 영웅·온라인에도 적용! 목표(첫 승리·처치·레벨·무기 업그레이드 등)를 이루면 새 패시브가 열리고 칸이 늘어나요. 로비의 🎖 버튼에서 확인','🏹 투사체 늘리기: 능력 카드 「일제 사격」(활·쇠뇌·로켓·돌팔매·화차·대포가 더 많이 나가요)과, 영웅 숙련도의 「투사체」 패시브(2레벨마다 +1, 적 1,000명 처치로 해금)가 생겼어요','🔥 봉화 시험: 라운드 중간에 주황 봉화가 나타나요. 밟고 원 안에서 30초 버티면 모두의 무기가 한 단계 올라요','🔱 증강: 서브미션을 성공할 때마다 공격력·공격 속도·급소·이동 속도·체력 재생 중 하나가 그 판 동안 영구히 올라요','⚔ 무기 진화 개편: 모든 라운드에 적장이 나와요. 무기 Lv.5 + 짝 능력(카드의 ★ 표시)을 가진 채 적장을 쓰러뜨리면 문제가 나오고, 맞히면 무기가 진화해요 (틀리면 보급 카드). 진화할 수 없을 땐 일반 카드 문제가 나와요','⛩ 제단: 맵의 보라색 제단 가까이 서 있으면 게이지가 차고, 가득 차면 회복·군량·경험치·광역 피해·방패막 중 하나가 나와요', '📌 라운드마다 지형·병종에 따른 특징이 생겼어요: ⛰산성 · 🌾벌판 · 🐎기병 · 🌊바다 · 🌲유격 (판 시작 화면에 나와요)', '🎁 업적을 달성하면 칭호와 함께 꾸미기를 받아요! 레벨업 연출 8종(불꽃놀이·황금 폭죽·꽃비·번개 기둥·별무리·눈꽃·용 승천·무지개 파동)과 이름표 테두리 10종이 있어요. 도감의 「도전·업적」에서 미리 보고 골라 써요', '👥 설정에 「친구·봇 이펙트 작게/크게」가 생겼어요. 처음엔 친구와 봇의 이펙트가 작게 보여요', '✨ 영웅 꾸미기가 화려해졌어요! 불꽃·얼음·번개·벚꽃 입자, 황금 날개·불사조·뇌운(전설), 그리고 걸을 때 남는 👣 이동 흔적(무지개 길·황금 길 등)이 새로 생겼어요. 보관함·뽑기에서 미리보기를 볼 수 있어요', '🔌 연결이 끊기거나 화면이 닫혀도 15분 안에는 처음 화면의 「방 ○○○○ 이어하기」로 같은 영웅으로 돌아올 수 있어요 (방장이 방을 열어 둬야 해요)', '⏸ 잠시멈춤 창에 「🏠 처음으로」와 「⛶ 전체화면」 버튼이 생겼어요', '⚔️ 일기토 중에는 서브미션·날씨·알림 팝업이 잠깐 사라져서 보스 체력이 잘 보여요 (끝나면 다시 나와요)', '📈 내 레벨이 올라갈수록 강한 적(방패병·대포)과 정예 적이 더 자주 나와요', '🚶 피난민 호위가 바뀌었어요! 피난민이 맵 끝에서 나와 성으로 들어가면 성공(성이 없는 판에서는 영웅을 만나면 성공)이에요', '📅 일일 도전(하루 한 판, 날마다 새 규칙)과 🏅 업적·칭호가 생겼어요! 도감 화면의 「도전·업적」에서 볼 수 있어요', '🌧 협동 이벤트 3종: 성 위험하면 🏰 성벽 수리 작전, 🌧🌫🌙 날씨 변화, 연속 실패하면 😞 사기 하락', '🔥 어려움에서는 적 장수 난입 · 양쪽 습격 · 갑옷 입은 적(스킬로 깨기)이 나와요', '🎯 혼자 하기(게임 시작)에서도 서브미션이 나와요! 40초쯤마다 제한시간 30초 미션 — 성공하면 이득, 실패하면 페널티 (무한 모드는 제외)', '📱 폰에서 방 화면을 못 내려 게임을 시작할 수 없던 문제를 고쳤어요! (시작 버튼은 항상 아래에 보여요) 방 화면·업데이트 노트에서 로고가 글자를 가리던 것도 정리했어요', '⏩ 탈출에서 한 친구가 오래(25초) 못 오면 늦은 친구를 앞으로 데려가 함께 이동해요', '🚩 탈출: 살아있는 친구 모두가 오른쪽 끝에 닿아야 다음 구간으로 넘어가요! 늦은 친구가 있으면 "OO 친구가 아직 도착하지 못했습니다!" 라고 알려줘요 (봇은 제외)', '🎯 서브미션은 40초마다, 제한시간 30초로 모든 목표(성 수비·버티기·적장·기습·탈출)에서 나와요', '🎵 장마다 다른 전투 음악(임진·정유·정묘·병자) + 로비·준비·브리핑·결과 화면 음악이 생겼어요', '🔉 배경음을 전체적으로 작게 줄였어요 (설정에서 더 키우거나 줄일 수 있어요)', '🎵 일기토(보스전)에 전용 음악이 생겼어요! 끝나면 원래 배경음으로 돌아와요', '📖 퀴즈를 틀리면 정답과 설명을 7초 동안 보여 준 뒤에 카드가 열려요', '🎯 서브미션이 한 판 안에서 계속 이어져요 (성공 → 10초 뒤 다음 미션 · 실패하면 페널티 · 3연속 성공하면 지원군!)', '⚔ 일기토에서 못 이기면 적장이 병력을 휘몰아치거나(대규모 웨이브), 성에 큰 타격을 줘요', '🃏 퀴즈 푸는 친구가 카드를 골라요! 능력 카드는 모두에게, 무기 카드는 고른 친구만(다른 친구는 가진 무기가 +1). 다른 친구는 카드를 눌러 추천해요', '🎯 협동 서브미션 7종: 보급기지 습격 · 식량 수송대 차단 · 피난민 호위 · 쌍둥이 봉화 · 약초 수집 · 돌격 막아내기 · 빠른 처치 경쟁 (성공하면 우리 편에 유리!)', '🎲 협동전은 5분 단판! 어떤 시나리오가 걸릴지는 시작해야 알 수 있어요 (탈출은 ➡ 오른쪽으로 계속 달리세요! 안내, 적도 오른쪽에서 많이 나와요)', '⚔ 보스전에서 얻은 무기가 모두 나가고, 활 사거리를 대포보다 짧게 조정했어요', '📱 폰·태블릿에서 버튼/글자/카드가 겹치지 않게 화면을 정리했어요', '🧠 레벨 업 퀴즈가 바뀌었어요! 같이 하기에서는 한 판에 한 친구(랜덤)가 문제를 풀고, 다른 친구들도 같은 문제를 보며 힌트를 줄 수 있어요.', '맞히면 모두에게 카드 4장이 열리고, 틀리면 카드 2장만 열려요. 혼자 할 때도 똑같아요.', '문제를 크게 늘렸어요! 선사 시대부터 지금 싸우는 전쟁 시대까지의 문제가 섞여 나와요 (임진왜란 판은 임진왜란까지, 병자호란 판은 병자호란까지).'] },
  { v: 'v0.32', d: '11/20', t: ['🌟 전설 영웅 4명 더 등장! 곽재우(홍의장군) · 휴정(서산대사) · 유정(사명대사) · 진린(명나라 수군 도독, 교과서 밖 보충)', '곽재우: 이동이 빠르고, 스킬 \'홍의 분신\'으로 적을 잠깐 멈춰 세워요 · 휴정: 근처 동료가 천천히 회복하고, 스킬 \'격문\'으로 동료 공격력을 올려요', '유정: 단단하고, 스킬 \'호국 결계\'로 6초 동안 사라지지 않는 결계를 펼쳐 적을 느리게 하고 다치게 해요 · 진린: 스킬 \'명군 지원 포격\'으로 여러 곳에 포탄을 떨어뜨려요', '전설 영웅 조각은 권율 → 김시민 → 곽재우 → 휴정 → 유정 → 진린 순서로 모여요. 영웅 그림도 새로 바뀌었어요.'] },
  { v: 'v0.31', d: '11/20', t: ['🌟 전설 영웅 김시민 등장! 진주대첩의 수성 명장 — 성 근처에서 받는 피해가 줄고, 스킬 \'진주성 철벽\'으로 성을 고치고 동료에게 방패막을 쳐 줘요', '영웅마다 고유 패시브와 스킬 이펙트가 생겼어요: 권율(주변 동료 공격력↑ · 돌이 쏟아지는 행주 돌비), 이순신(체력이 낮을수록 강해짐 · 학의 날개 모양 학익진), 김시민', '협동 보상 조각은 권율 → 김시민 순서로 모여요 (다음 패치마다 전설 영웅이 늘어요)', '전설·히든 영웅은 자기만의 색 후광이 둘러요'] },
  { v: 'v0.30', d: '11/20', t: ['🎁 협동전을 깨면 🎟 뽑기권과 🧩 전설 영웅 조각을 받아요! 로비의 "보관함·뽑기"에서 확인해요.', '🌟 전설 영웅 권율 등장! 조각 10개를 모으면 열려요 (행주대첩의 명장 · 시작 무기 화차 · 스킬 행주 돌비). 패치마다 전설 영웅이 늘어날 예정이에요.', '✨ 뽑기로 영웅 발밑 꾸미기(기운)를 얻어요. 확률은 화면에 적혀 있고, 10번째엔 희귀 이상·30번째엔 전설이 확정! 돈은 전혀 들지 않아요.', '🔥 새 협동 미션: 쌍둥이 봉화(두 발판에 한 명씩 동시에 서기)·속전속결(시간 안에 기지 격파). 성 방어 라운드는 이중 전선이에요.', '🏁 협동 난이도 1 연습 · 2 도전(기본) · 3 극한. 높을수록 적이 강하고 제한 시간이 짧지만 보상이 커요.'] },
  { v: 'v0.29', d: '11/20', t: ['🤝 협동전 모드 추가! 방장이 "협동전으로 시작"을 누르면 친구마다 역할(🛡수비·🔥유격·🌾보급)이 생기고, 역할 버튼으로 각자 능력을 써요.', '🏕 성 방어 라운드마다 멀리 보급기지 2곳이 생겨요. 시간 안에 함께 부수지 못하면 져요.', '🤖 협동전 빈자리를 봇이 채워 줘요! 봇도 역할대로 움직이고 능력·퀴즈·카드·투표를 알아서 해요. (방 설정의 "협동전 빈자리"에서 고르세요)'] },
  { v: 'v0.28', d: '11/20', t: ['📶 같이하기 중 연결이 끊겨도 3분 안에 다시 들어오면 영웅 그대로 이어서 해요 (끊긴 동안은 다치지 않아요).', '🛑 방장이 나가려 하면 "모두 나가게 돼요" 확인이 떠요.', '🌙 게임하는 동안 화면이 꺼지지 않게 했어요.', '⏸ 방장이 멈추면 친구 화면에 안내가 뜨고, 90초 뒤 자동으로 다시 시작해요.', '👀 투표·카드를 고르는 중인 친구 이름이 보여요. 방장 화면이 멈추면 "방장 화면이 멈춘 것 같아요"가 떠요.'] },
  { v: 'v0.27', d: '11/20', t: ['⚔ 일기토 무대가 넓어졌어요(반지름 320).', '💪 영웅이 강할수록 적장도 단단해져요 (약한 영웅일 땐 그대로).', '🛡 일기토에서 받는 피해를 조금 줄였어요.', '📍 화면 위쪽 안내(습격 시간·멈춤·알림)가 겹치지 않고 차례로 쌓여요. 왼쪽 위 칸 간격도 넓혔어요.', '⚔ 영웅 체력이 늘수록 적장의 공격도 세져요. 가만히 맞으면서 싸우면 이기기 어려워요 (보통 이상).', '📋 결과 화면에서 버튼 줄이 위아래로 튀던 것을 고쳤어요(화면 맨 아래에 고정).', '🔊 설정에서 효과음·배경음 크기를 따로 조절할 수 있어요. 효과음 기본은 60%예요.'] },
  { v: 'v0.26', d: '11/20', t: ['👥 온라인 협동 보정: 사람이 늘수록 적이 단단해지고(체력↑) 정예와 적장이 더 자주 나와요. 적 숫자는 조금만 늘어서 렉을 줄였어요', '🔗 방장은 "초대 링크 복사"로 친구에게 방 주소를 보낼 수 있어요 (링크를 열면 방 코드가 자동으로 들어가요)', '📡 온라인 전송량을 절반 가까이 줄였어요'] },
  { v: 'v0.25', d: '11/20', t: ['📜 라운드가 끝나면 "역사 한 컷" 카드가 나와요: 실제 역사와 게임 속 설정을 나눠서 보여줘요', '🧠 레벨업 퀴즈를 맞히면 군량(또는 체력 회복)을 받고, 3문제 연속 정답이면 보너스가 더 커져요', '🔥 영웅마다 스킬이 달라졌어요 (화살비·함성·호국염불·집중포화·학익진)', '⚔ 적장마다 일기토 스타일이 달라요 (돌격형·포격형·파쇄형·결계형·지휘형). 이기면 스타일별 보상!'] },
  { v: 'v0.24', d: '11/20', t: ['⚔ 적장 일기토: 적장이 나타나면 경고 화면 뒤에 원형 무대에서 1:1 승부! 붉은 표시를 피하고(함성 버튼 = 구르기) 공격하세요. 이기면 적장을 쓰러뜨려요', '🎵 배경음이 생겼어요 (설정에서 끌 수 있어요)', '🌱 라운드 초반 준비 시간: 처음 30초는 쉬운 적만 적게 나오고, 큰 습격까지 남은 시간이 위에 표시돼요. 낮은 레벨은 레벨업에 필요한 경험치가 적어 빨리 올라요', '🛡 성 체력이 66%·33%가 되면 의병이 잠시 성을 지켜 줘요 (쉬움 4초·보통 3초·어려움 1.5초). 🌾 군량으로 성 수리 버튼(체력 30% 회복)도 생겼어요', '난이도 재조정: 쉬움은 누구나 깰 수 있게(성 체력 2배·적장 약함), 보통은 그 중간, 어려움은 적 강화·방어 이벤트 짧음·수리 비쌈. 성 수리는 체력 30% 회복(쉬움 35%·어려움 25%)', '탈출 라운드: 첫 매복이 늦고 약하며, 앞쪽에 체력 회복 상자가 있어요', '🎖 공훈 보상: 전투에서 이기면 3가지 중 1개를 골라요. 다음 라운드부터 계속 쌓여요 (체력·공격·군량·성벽·혼·회복)', '전장 변수가 생겼어요: 풍년(군량↑) · 의병 합류(병사 2명 시작) · 질풍(적이 빠른 대신 혼↑)', '적이 거점만 집중 공격하지 않아요. 가까운 영웅을 먼저 쫓는 적이 많아요. 성은 잠시 맞지 않으면 천천히 회복해요', '연속 라운드의 목표가 겹치지 않도록 바꿨고, 초반 라운드(옥포 해전 등) 난이도를 낮췄어요'] },
  { v: 'v0.23', d: '11/20', t: ['♾ 무한 모드 개편: 한 전장에서 라운드마다 1분, 99라운드까지! 레벨·카드가 계속 쌓여요', '라운드가 오를수록 적이 강해지고 정예와 적장이 더 많이 나와요. 가끔 밤이 와요', '99라운드는 최종 보스 (도요토미 히데요시 또는 홍타이지). 쓰러뜨리면 클리어!', '일반 모드 적장: 더 단단해지고(체력↑·갑옷), 붉은 원 범위 공격을 해요. 2분마다 나오고 고니시·와키자카 같은 장수가 번갈아 나와요', '업데이트 노트 팝업에서 닫기 버튼이 항상 보여요'] },
  { v: 'v0.22', d: '11/19', t: ['적 대포병 등장! 멀리서 쏘는 포탄이 떨어지는 자리에 붉은 원이 보여요. 원 밖으로 피하세요 (범위 피해)', '시간이 지날수록 중갑병·대포병·정예가 더 많이 나와요 (보통·어려움은 더 빠르게). 강한 적은 조선인의 혼을 더 많이 줘요', '적 조총병·궁수는 체력이 약하지만 한 방이 더 아파요. 보병·기병은 체력이 늘고 공격은 약해졌어요 (기병은 빠른 속도 그대로)', '아군 조총병·화포는 공격이 조금 더 세졌어요'] },
  { v: 'v0.21', d: '11/19', t: ['♾ 무한 모드! 30라운드를 깨면 끝없이 이어져요 (방에서 바로 시작할 수도 있어요). 버틴 시간·처치 수·퀴즈 정답으로 점수를 매겨요', '📖 도감과 🏆 랭킹이 생겼어요 (시작 화면 아래 버튼): 시너지·영웅·적장 도감', '레벨 업 때 퀴즈가 나와요! 이번 시대·지난 시대·더 먼저 배운 시대 문제가 섞여 나오고, 맞히면 보너스 카드 1장', '라운드가 끝나면 복기 카드를 10초 동안 읽어야 다음으로 넘어갈 수 있어요', '무기를 Lv.5까지 키우면 공격 이펙트가 금빛으로 빛나요', '⛶ 전체화면 버튼 추가 (카카오톡 안 브라우저는 막혀 있어서 크롬·삼성 인터넷으로 열어야 해요)', '소집 병사 밸런스 조정: 창병·기마병을 약하게, 레벨1 병사 1명이 적 보병 3명과 겨우 비길 정도예요', '창병은 적 보병과, 기마병은 적 기병과 같은 속도로 움직여요', '사거리 순서: 궁병 < 조총병 < 화포. 내 캐릭터 사거리 표시도 다시 보여요'] },
  { v: 'v0.20', d: '11/19', t: ['시작화면이 옆으로 밀리고 일본 장수 그림이 줄지어 보이던 문제를 고쳤어요 (태블릿·폰도 확인)', '업데이트 노트가 팝업으로 바뀌었어요 (새 버전일 때 한 번 나와요)', '창병·기마병이 거점 앞으로 나가 적을 막아요! 다치면 쓰러졌다가 잠시 뒤 다시 일어나요', '날아오는 화살·총알도 앞에 선 병사가 막아 줘요'] },
  { v: 'v0.19', d: '11/19', t: ['영웅마다 고유 무기 1개로 시작 (궁수=활, 화포수=대포 …)', '무기 12종 · 능력 12종! 무기 4개, 능력 4개까지 고를 수 있어요', '짝이 맞는 무기끼리, 능력끼리 시너지! 둘 다 Lv5면 특수 능력', '모든 라운드를 깨면 히든 영웅 이순신 등장', '탈출: 병사·곡식 없음, 쓰러지면 끝! 뒤로 처진 적은 사라져요', '밤이 더 어두워졌어요'] },
  { v: 'v0.18', d: '11/19', t: ['야간 전투가 더 어두워졌고, 지친 우리는 느려지고 적은 더 빨라져요', '탈출: 적이 앞을 막아서고, 위아래에서 몰려오고, 매복이 갑자기 나타나요 (뒤에서 오는 적은 없어요)'] },
  { v: 'v0.17', d: '11/19', t: ['무기가 다양해졌어요: 창 찌르기·환도 베기·편곤·불경 독송 (최대 4가지까지 들 수 있어요)', '징은 모두의 공격력을 올리고, 말은 달리며 적을 밀쳐요', '모든 라운드를 깨면 히든 영웅 이순신 등장', '곡식은 공명첩으로! 종묘제례악을 얻으면 흩어진 조선의 혼이 모여들어요', '최고 레벨·진화 무기는 이펙트가 더 화려해요', '카드의 교과서 쪽수 표시를 없앴어요'] },
  { v: 'v0.16', d: '11/19', t: ['자동 저장 + 저장 슬롯 3개 (이어하기)', '전투 전에 역사 이야기를 읽고 퀴즈를 풀어요', '카드를 다 올리면 회복·함성 같은 선택지가 나와요', '업데이트 노트 추가'] },
  { v: 'v0.15', d: '11/19', t: ['탈출 미션: 5분 동안 계속 달리며 몰려오는 적을 물리쳐요', '깃발을 지나면 체력이 조금 회복돼요', '조선인의 혼·자석, 무기 진화, 적장 등장 연출, 야간 전투'] },
  { v: 'v0.13', d: '11/19', t: ['시야가 넓어지고 캐릭터가 작아졌어요', '적이 훨씬 많이 몰려와요'] }
];
const W = 960, H = 540;
const Z = 0.72, SPS = 0.66; // 시야 넓히기(줌) / 캐릭터 크기 비율
const $ = (id) => document.getElementById(id);
const Q = new URLSearchParams(location.search);
const FAST = Q.get('fast') ? +Q.get('fast') : 0; // 테스트용: 전투 시간(초)
const DEFAULT_RELAY = 'wss://history-defense-relay.kimsky4409.workers.dev/ws'; // 선생님 Cloudflare 릴레이 (게임 화면의 '선생님 설정'에서 바꿀 수 있어요)

// ---------- 네트워크 ----------
const Net = {
  ws: null, id: 'me', host: true, mode: 'single', room: '', peers: ['me'],
  onData: () => {}, onJoin: () => {}, onLeave: () => {}, onClosed: () => {}, onDrop: null, gotClosed: false,
  connect(url, room, create) {
    return new Promise((res, rej) => {
      let ws; try { ws = new WebSocket(url + (url.includes('?') ? '&' : '?') + 'room=' + encodeURIComponent(room) + (create ? '&create=1' : '')); } catch (e) { rej('주소가 올바르지 않아요'); return; }
      let ok = false; Net.ws = ws; Net.gotClosed = false;
      ws.onmessage = (ev) => { const m = JSON.parse(ev.data);
        if (m.sys === 'hello') { ok = true; Net.id = m.id; Net.host = m.host === m.id; Net.mode = 'online'; Net.room = room; Net.peers = m.peers; res(); }
        else if (m.sys === 'err') rej({ exists: '이미 있는 방 코드예요', noroom: '그런 방이 없어요', full: '방이 가득 찼어요(최대 4명)' }[m.code] || '입장 실패');
        else if (m.sys === 'join') { Net.peers.push(m.id); Net.onJoin(m.id); }
        else if (m.sys === 'leave') { Net.peers = Net.peers.filter((x) => x !== m.id); Net.onLeave(m.id); }
        else if (m.sys === 'closed') { Net.gotClosed = true; Net.onClosed(); }
        else if (m.d) Net.onData(m.from, m.d); };
      ws.onerror = () => { if (!ok) rej('연결에 실패했어요. 릴레이 주소를 확인해 주세요'); };
      ws.onclose = () => { if (!ok || Net.gotClosed) return; if (Net.host || !Net.onDrop) Net.onClosed(); else Net.onDrop(); };
    });
  },
  send(to, d) { if (Net.ws && Net.ws.readyState === 1) Net.ws.send(JSON.stringify({ to, d })); }
};

// ---------- 병종 / 적 / 카드 정의 ----------
const UT = { // 소집 병사
  bow:    { n: '궁병',   c: '#e6c84a', ch: '궁', rg: 200, dmg: 10,  rt: 1.0, aoe: 0 },
  spear:  { n: '창병',   c: '#58b86a', ch: '창', rg: 130, dmg: 11, rt: 0.8, aoe: 0 },
  gun:    { n: '조총병', c: '#d9d9d9', ch: '총', rg: 240, dmg: 46, rt: 0.4, aoe: 0 },
  cannon: { n: '화포',   c: '#e98a3c', ch: '포', rg: 290, dmg: 36, rt: 0.35, aoe: 48 },
  cav:    { n: '기마병', c: '#6fb3ff', ch: '마', rg: 120, dmg: 8, rt: 1.3, aoe: 0 }
};
const LVM = [1, 2.3, 5.2, 12];
const ROLE = { // 영웅(플레이어) — 시작할 때 고유 무기 1개만 들고 시작
  archer: { n: '궁수',   c: '#f2d65a', rg: 260, dmg: 12, rt: 1.5, hp: 120, sp: 120, aoe: 0,  tag: ['시작 무기: 활', '멀리서 관통'], d: '활로 일직선의 적을 꿰뚫어요' },
  militia:{ n: '의병',   c: '#6fd07d', rg: 100, dmg: 18, rt: 1.4, hp: 200, sp: 125, aoe: 0,  tag: ['시작 무기: 환도', '튼튼'], d: '환도로 앞의 적을 한꺼번에 베어요' },
  monk:   { n: '승병',   c: '#d98cff', rg: 85,  dmg: 26, rt: 0.9, hp: 260, sp: 110, aoe: 0,  tag: ['시작 무기: 불경', '아군 회복'], d: '불경 소리로 적을 느리게 하고 동료를 회복해요' },
  gunner: { n: '화포수', c: '#ff9a5a', rg: 250, dmg: 38, rt: 0.55, hp: 110, sp: 105, aoe: 55, tag: ['시작 무기: 대포', '폭발 범위'], d: '대포 한 방으로 무리를 날려요' },
  gwonyul:{ n: '권율', c: '#ff7a3a', rg: 340, dmg: 30, rt: 0.9, hp: 280, sp: 112, aoe: 40, tag: ['전설 영웅', '시작 무기: 화차', '패시브: 동료 공격력 +10%'], d: '행주대첩의 명장! 화차로 불화살을 쏟아부어요 (협동전 보상 조각 10개로 열려요)' },
  gwakjaeu:{ n: '곽재우', c: '#ff4a3a', rg: 200, dmg: 26, rt: 0.65, hp: 230, sp: 128, aoe: 0, tag: ['전설 영웅', '시작 무기: 환도', '패시브: 이동 +25%'], d: '홍의장군! 붉은 옷으로 날쌔게 달리며 싸워요 (협동전 보상 조각 12개 모으면 열려요)' },
  hyujeong:{ n: '휴정', c: '#ffd34d', rg: 190, dmg: 18, rt: 0.9, hp: 260, sp: 108, aoe: 25, tag: ['전설 영웅', '시작 무기: 불경', '패시브: 근처 동료 회복'], d: '서산대사! 동료를 북돋우는 후방 지원 영웅이에요 (협동전 보상 조각 12개 모으면 열려요)' },
  yujeong:{ n: '유정', c: '#c28aff', rg: 220, dmg: 30, rt: 1.0, hp: 420, sp: 100, aoe: 35, tag: ['전설 영웅', '시작 무기: 철퇴', '패시브: 받는 피해 -15%'], d: '사명대사! 아주 단단한 승병장이에요 (협동전 보상 조각 14개 모으면 열려요)' },
  jinrin:{ n: '진린', c: '#ff9a3a', rg: 360, dmg: 34, rt: 0.95, hp: 300, sp: 100, aoe: 60, tag: ['전설 영웅', '교과서 밖 보충', '시작 무기: 대포', '패시브: 폭발 범위 +15%'], d: '명나라 수군 도독! 조선 수군과 함께 싸운 연합군 장수예요 (협동전 보상 조각 14개 모으면 열려요)' },
  gimsimin:{ n: '김시민', c: '#4aa3ff', rg: 300, dmg: 28, rt: 0.8, hp: 330, sp: 104, aoe: 30, tag: ['전설 영웅', '시작 무기: 대포', '패시브: 성 근처 피해 -30%'], d: '진주대첩의 수성 명장! 성을 지키는 데 강해요 (협동전 보상 조각 12개로 열려요)' },
  admiral:{ n: '이순신', c: '#ffd84a', rg: 250, dmg: 38, rt: 0.55, hp: 300, sp: 118, aoe: 0,  tag: ['히든 영웅', '시작 무기: 거북선', '패시브: 체력 낮을수록 강해져요'], d: '거북선의 포로 사방의 적을 쓸어요 (모든 라운드를 깨면 열려요)' }

};
const DIFF = { easy: { n: '쉬움', sc: 0.45, hp: 0.6, sp: 0.55, dm: 0.5, fd: 50, hh: 1.4, bs: 2, bb: 0.5, rc: 40, rh: 0.35, bi: 4, pr: 0.2 }, normal: { n: '보통', sc: 0.7, hp: 0.9, sp: 0.78, dm: 0.8, fd: 20, hh: 1.15, bs: 1.4, bb: 0.75, rc: 50, rh: 0.3, bi: 3, pr: 0.3 }, hard: { n: '어려움', sc: 1, hp: 1.2, sp: 1.0, dm: 1.1, fd: -10, hh: 1, bs: 1, bb: 1.1, rc: 70, rh: 0.25, bi: 1.5, pr: 0.45 } };
const ET = { // 적
  grunt:  { n: '보병',   hp: 30,  sp: 38, dm: 5,  r: 9,  st: 0,   f: 8,  xp: 1 },
  shoot:  { n: '조총·궁수', hp: 13, sp: 34, dm: 5,  r: 8,  st: 120, f: 9,  xp: 1 },
  cav:    { n: '기병',   hp: 70,  sp: 82, dm: 7,  r: 11, st: 0,   f: 10, xp: 2 },
  cannon: { n: '대포병', hp: 14,  sp: 28, dm: 4,  r: 10, st: 200, f: 14, xp: 4 },
  tank:   { n: '중갑',   hp: 150, sp: 26, dm: 14, r: 14, st: 0,   f: 18, xp: 6 },
  camp:   { n: '보급창고', hp: 700, sp: 0, dm: 0, r: 26, st: 0, f: 30, xp: 8 },
  boss:   { n: '적장',   hp: 3600, sp: 22, dm: 38, r: 24, st: 0,  f: 100, xp: 30 }
};
const CARDS = [
  // 무기 12 (+ 히든)
  { id: 'bow',    n: '활',        d: '멀리 쏘아 일직선의 적을 꿰뚫어요', t: '무기 · 조선 군사들은 활(각궁) 솜씨가 뛰어났어요' },
  { id: 'cannon', n: '대포',      d: '큰 포탄 한 방! 터지면 주변도 맞아요', t: '무기 · 천자총통·지자총통 같은 화포를 배와 성에서 썼어요' },
  { id: 'sword',  n: '환도 베기', d: '가까운 적들을 크게 휘둘러 베어요', t: '무기 · 환도는 조선 군사들이 허리에 차던 칼이에요' },
  { id: 'buddha', n: '불경 독송', d: '독경 소리가 퍼져 적을 느리게 하고 다치게 해요. 동료는 회복!', t: '무기 · 임진왜란 때 서산대사·사명대사가 승병을 이끌었어요' },
  { id: 'spear',  n: '창 찌르기', d: '가까운 적을 길게 찔러 줄줄이 꿰뚫어요', t: '무기 · 레벨이 오르면 더 길게, 여러 갈래로 찔러요' },
  { id: 'flail',  n: '편곤',      d: '쇠도리깨를 휘둘러 적을 크게 밀쳐내요', t: '무기 · 도리깨 모양 무기, 임진왜란 때 명에서 전해져 기병이 많이 썼어요' },
  { id: 'bomb',   n: '비격진천뢰', d: '폭탄을 던져 적 무리를 크게 터뜨려요', t: '무기 · 조선의 폭발 무기, 터지면서 쇳조각이 흩어져요' },
  { id: 'hwacha', n: '화차',      d: '주기적으로 주변 적에게 화살 비를 쏟아요', t: '무기 · 여러 발을 한꺼번에 쏘는 수레' },
  { id: 'musket', n: '조총',      d: '멀리 있는 적을 빠르게 한 발씩 정확히 쏴요', t: '무기 · 임진왜란 때 일본군이 먼저 대규모로 썼고, 조선도 곧 만들어 쓰기 시작했어요' },
  { id: 'rocket', n: '신기전',    d: '불화살 로켓이 날아가 여러 적 위에서 터져요', t: '무기 · 신기전은 로켓처럼 날아가는 화살이에요' },
  { id: 'stone',  n: '돌팔매',    d: '돌을 던져 적을 멈칫(기절)하게 해요', t: '무기 · 돌을 던져 싸우는 석전은 우리 옛 전통 놀이이자 싸움이었어요' },
  { id: 'nu',     n: '쇠뇌',      d: '화살 여러 대를 부채꼴로 한꺼번에 쏴요', t: '무기 · 쇠뇌는 방아쇠로 쏘는 활이에요' },
  { id: 'turtle', n: '거북선',    d: '거북선의 포가 사방의 적에게 포탄을 퍼부어요', t: '히든 무기 · 이순신이 이끈 거북선, 임진왜란 바다에서 활약했어요' },
  // 능력 12
  { id: 'armor',  n: '갑옷',      d: '최대 체력 +40%, 체력 회복', t: '능력 · 몸을 지키는 튼튼한 갑옷' },
  { id: 'horse',  n: '말',        d: '이동 속도 +25%, 달리다 부딪힌 보병을 밀치고 살짝 다치게 해요', t: '능력 · 말을 타면 빠르게 달릴 수 있어요' },
  { id: 'gong',   n: '징 울림',   d: '사기 상승! 모두의 공격력이 +12%씩 올라요', t: '능력 · 징과 북은 군대에서 신호를 보내고 사기를 높이는 데 쓰였어요' },
  { id: 'powder', n: '화약',      d: '폭발 무기의 범위가 커져요', t: '능력 · 화약 무기의 힘' },
  { id: 'train',  n: '훈련',      d: '모든 무기가 더 빨리 나가요', t: '능력 · 꾸준한 훈련이 실력을 만들어요' },
  { id: 'forge',  n: '단련',      d: '모든 무기의 공격력 +30%', t: '능력 · 쇠를 두드려 더 날카로운 무기를 만들어요' },
  { id: 'guard',  n: '방패',      d: '받는 피해가 줄어요 (-8%씩)', t: '능력 · 방패는 화살과 칼을 막아 줘요' },
  { id: 'medic',  n: '의원술',    d: '체력이 조금씩 저절로 차올라요', t: '능력 · 허준은 선조 때부터 동의보감을 쓰기 시작했어요' },
  { id: 'volley', n: '일제 사격', d: '활·쇠뇌·로켓·돌팔매·화차·대포가 한 번에 더 많이 나가요', t: '능력 · 여럿이 한꺼번에 쏘면 위력이 커져요 (게임 규칙)' },
  { id: 'crit',   n: '급소 노리기', d: '가끔 두 배의 큰 피해를 줘요', t: '능력 · 오랜 훈련으로 약한 곳을 정확히 노려요' },
  { id: 'study',  n: '학문',      d: '경험치를 더 많이 얻어요 (+15%씩)', t: '능력 · 성균관과 서당에서 글과 병법을 배웠어요' },
  { id: 'spirit', n: '의병 정신', d: '체력이 낮을수록 공격력이 올라요', t: '능력 · 나라가 위태로울 때 백성이 스스로 일어나 싸운 의병' },
  { id: 'scout',  n: '척후',      d: '조선인의 혼을 더 멀리서 줍고 조금 더 빨라져요', t: '능력 · 척후병은 적의 움직임을 먼저 살펴요' },
  // 상자·사건·대체 선택지
  { id: 'wall',   n: '성벽 보수', d: '거점 최대 체력 +20%, 조금 회복', t: '성을 튼튼히' },
  { id: 'food',   n: '군량 비축', d: '군량 획득 +30%', t: '보급이 힘' },
  { id: 'volun',  n: '의병 모집', d: '무료 병사 2명 즉시 소집', t: '백성이 자발적으로 조직한 군대' },
  { id: 'rage',   n: '함성 고취', d: '20초 동안 모두의 공격력 +40%', t: '사기 진작' },
  { id: 'heal',   n: '의원',      d: '모든 동료 체력 50% 회복', t: '부상자 돌보기' }
];
const WEAP = { bow: 1, cannon: 1, sword: 1, buddha: 1, spear: 1, flail: 1, bomb: 1, hwacha: 1, musket: 1, rocket: 1, stone: 1, nu: 1, turtle: 1 };
const ABIL = { volley: 1, armor: 1, horse: 1, gong: 1, powder: 1, train: 1, forge: 1, guard: 1, medic: 1, crit: 1, study: 1, spirit: 1, scout: 1 };
const WMAX = 4, AMAX = 4; // 무기 최대 4, 능력 최대 4 (빌드 선택!)
const START = { gwakjaeu: 'sword', hyujeong: 'buddha', yujeong: 'flail', jinrin: 'cannon', gimsimin: 'cannon', gwonyul: 'hwacha', archer: 'bow', militia: 'sword', monk: 'buddha', gunner: 'cannon', admiral: 'turtle' };
// 시너지: 짝이 모두 있으면 보너스, 둘 다 Lv5면 특수 능력!
const SYN = [
  { k: 'bow_nu', w: 1, a: 'bow', b: 'nu', n: '궁노 합동', d: '두 무기 공격력 +15%', sd: '활은 3갈래, 쇠뇌는 화살이 더 늘어나요', t: '활과 쇠뇌를 함께 쓰는 사수 부대' },
  { k: 'musket_cannon', w: 1, a: 'musket', b: 'cannon', n: '화약 병기', d: '두 무기 공격력 +15%', sd: '조총은 관통, 대포는 두 발씩!', t: '조총과 화포를 함께 쓰는 화기 부대' },
  { k: 'hwacha_rocket', w: 1, a: 'hwacha', b: 'rocket', n: '신기전 화차', d: '두 무기 공격력 +15%', sd: '화살 비와 로켓이 두 배!', t: '화차에서 신기전을 쏘아 올려요' },
  { k: 'sword_spear', w: 1, a: 'sword', b: 'spear', n: '창검진', d: '두 무기 공격력 +15%', sd: '창은 5갈래, 환도는 두 번 휘둘러요', t: '창병과 도검병이 함께 서는 진' },
  { k: 'flail_buddha', w: 1, a: 'flail', b: 'buddha', n: '승병 철퇴', d: '두 무기 공격력 +15%', sd: '철퇴가 4개로 늘고 독경이 적을 멈춰 세워요', t: '승병이 철퇴와 독경으로 싸워요' },
  { k: 'stone_bomb', w: 1, a: 'stone', b: 'bomb', n: '투척전', d: '두 무기 공격력 +15%', sd: '돌이 터지고 폭탄이 두 발!', t: '던져서 싸우는 무기들' },
  { k: 'armor_guard', a: 'armor', b: 'guard', n: '철벽 수비', d: '최대 체력 +10%', sd: '쓰러져도 한 번 되살아나요 (탈출 제외)', t: '갑옷과 방패' },
  { k: 'horse_scout', a: 'horse', b: 'scout', n: '기마 척후', d: '이동 속도 +8%', sd: '이동 +25%, 말의 충돌 피해 2배', t: '말을 탄 척후병' },
  { k: 'gong_spirit', a: 'gong', b: 'spirit', n: '승전고', d: '공격력 +6%', sd: '모든 무기 공격력 +30%', t: '북소리로 의병의 사기를 높여요' },
  { k: 'powder_forge', a: 'powder', b: 'forge', n: '화약 장인', d: '폭발 범위 +10%', sd: '폭발 범위 +40%, 공격력 +15%', t: '화약과 쇠를 다루는 장인' },
  { k: 'train_crit', a: 'train', b: 'crit', n: '백발백중', d: '공격 속도 +8%', sd: '급소 확률 +25%', t: '훈련으로 얻은 정확한 솜씨' },
  { k: 'medic_study', a: 'medic', b: 'study', n: '동의보감', d: '회복·경험치 조금 증가', sd: '회복 2.5배, 경험치 +25%', t: '의학을 배우고 익혀 사람을 살려요' }
];
function calcSyn(p) {
  const c = p.cards; p.sy = {}; p.sa = {}; p.sn = p.sn || {};
  for (const y of SYN) { const a = c[y.a] || 0, b = c[y.b] || 0; if (!a || !b) continue; const sp = a >= 5 && b >= 5;
    if (y.w) p.sy[y.a] = p.sy[y.b] = 1; else p.sa[y.k] = sp ? 2 : 1;
    const lv = sp && !y.w ? 2 : 1; if ((p.sn[y.k] || 0) < lv) { p.sn[y.k] = lv; if (G) G.info = { id: Date.now() + Math.random(), tt: (sp ? '✨ 특수 능력! ' : '🔗 시너지! ') + y.n + (G.order.length > 1 ? ' (' + p.name + ')' : ''), tx: sp ? y.sd : y.d + ' · ' + y.t }; } }
}
// ----- 무기 진화: 무기 Lv5 + 짝 능력 1개 이상 + 적장을 쓰러뜨린 뒤 나오는 문제 정답 -----
const WPAIR = { bow: 'train', nu: 'crit', cannon: 'powder', musket: 'forge', rocket: 'powder', hwacha: 'forge', sword: 'armor', spear: 'guard', flail: 'spirit', buddha: 'medic', stone: 'scout', bomb: 'gong', turtle: 'armor' }; // 게임 균형용 짝 (역사 설명 아님)
function evoElig(p) { const c = p.cards || {}, o = []; for (const k in WEAP) if ((c[k] | 0) >= 5 && !c['evo_' + k] && (c[WPAIR[k]] | 0) >= 1) o.push(k); return o; }
function cardName(id) { const c = CARDS.find((x) => x.id === id); return c ? c.n : id; }
function startEvoQuiz() { // 적장 처치 → 문제 → 정답이면 진화! (아무도 진화할 수 없으면 일반 카드 문제)
  const ids = G.order; if (!ids.some((i) => evoElig(G.pl[i]).length)) { G.lvq = (G.lvq | 0) + 1; return; }
  const hs = ids.map((i) => G.pl[i]).filter((p) => !p.bot && !p.away); let cand = hs.length ? hs : [G.pl[ids[0]]]; const el = cand.filter((p) => evoElig(p).length); if (el.length) cand = el;
  const mn = Math.min(...cand.map((p) => p.qturn || 0)), pk = cand.filter((p) => (p.qturn || 0) === mn), qr = pk[rint(pk.length)]; qr.qturn = (qr.qturn || 0) + 1;
  const qz = nextQuiz(); qz.by = qr.id; qz.bn = qr.name; qz.evo = 1; G.qzr = qr.id;
  const fb = ['heal', 'rage', G.obj !== 'e' ? 'food' : null, G.obj !== 'e' ? 'volun' : null, G.castle ? 'wall' : null].filter(Boolean); qr.offer = fb.sort(() => Math.random() - 0.5).slice(0, 4); qr.qz = Object.assign({}, qz); qr.qs = 0; qr.qrw = ''; qr.offT = 30; G.chs = {};
  for (const id of ids) { const p = G.pl[id]; if (p === qr) continue; p.offer = p.bot ? null : qr.offer.slice(); p.qz = p.bot ? null : Object.assign({}, qz); p.qs = 0; p.qrw = ''; p.offT = 45; }
}
function evoFinish() { // 정답! 진화할 수 있는 모든 영웅의 무기가 진화해요
  const nm = []; for (const id of G.order) { const p = G.pl[id]; for (const k of evoElig(p)) { applyCard(p, 'evo_' + k); nm.push((G.order.length > 1 ? p.name + ': ' : '') + '★' + cardName(k)); G.fx.push([p.x, p.y, 90, 'lvl']); } }
  for (const id of G.order) { const o = G.pl[id]; o.offer = null; o.qz = null; } G.chs = {};
  G.info = { id: Date.now() + Math.random(), tt: '⭐ 무기 진화!', tx: nm.join(' · ') || '진화했어요' };
}
const BOSSN = [ // [이름, 설명] 라운드별 적장 — 교과서 밖 보충이므로 교사 확인 필요
  ['고니시 유키나가', '일본군 1군 선봉장'], ['고니시 유키나가', '일본군 1군 선봉장'], ['고니시 유키나가', '일본군 1군 선봉장'], ['도도 다카토라', '일본 수군 장수'], ['와키자카 야스하루', '일본 수군 장수'],
  ['호소카와 다다오키', '일본군 장수'], ['안코쿠지 에케이', '일본군 승려 장수'], ['고니시 유키나가', '일본군 1군 장수'], ['우키타 히데이에', '일본군 총대장'], ['가토 기요마사', '일본군 2군 장수'],
  ['도도 다카토라', '일본 수군 장수'], ['고니시 유키나가', '일본군 장수'], ['가토 기요마사', '일본군 장수'], ['구로다 나가마사', '일본군 장수'], ['구루시마 미치후사', '일본 수군 장수'],
  ['구루시마 미치후사', '일본 수군 장수'], ['가토 기요마사', '일본군 장수'], ['시마즈 요시히로', '일본군 장수'], ['고니시 유키나가', '일본군 장수'], ['시마즈 요시히로', '일본군 장수'],
  ['아민', '후금군 장수'], ['아민', '후금군 장수'], ['아민', '후금군 장수'], ['아민', '후금군 장수'], ['아민', '후금군 장수'],
  ['용골대', '청군 장수'], ['홍타이지', '청의 황제'], ['마푸타', '청군 장수'], ['용골대', '청군 장수'], ['홍타이지', '청의 황제']
];
// ===== 협동 인원 보정: 적 '수'는 조금만 늘리고(렉 방지), 대신 단단하고 정예·적장이 더 나와요 =====
// [적 수 배율, 적 체력 배율, 적 공격 배율, 정예 확률 가산, 추가 적장 수]  (1명·2명·3명·4명)
const COOP = [{ c: 1, h: 1, dm: 1, el: 0, gen: 0 }, { c: 1.25, h: 1.35, dm: 1.1, el: 0.06, gen: 0 }, { c: 1.45, h: 1.7, dm: 1.2, el: 0.12, gen: 1 }, { c: 1.6, h: 2.05, dm: 1.3, el: 0.18, gen: 2 }];
const coopOf = () => COOP[Math.min(4, Math.max(1, G.order.length)) - 1];
const enCap = () => (Net.mode === 'online' ? Math.min(220, isLow() ? 130 : 260) : (isLow() ? 130 : 260));
const startCards = (role) => ({ [START[role] || 'spear']: 1 });
const EVENTS = [
  { t: '작전 회의', q: '어떻게 할까요?', o: [{ n: '성을 굳게 지킨다', d: '거점 체력 +25% 회복', k: 'wall' }, { n: '나가서 반격한다', d: '30초간 모든 공격력 +40%', k: 'atk' }] },
  { t: '백성의 도움', q: '백성이 도움을 청합니다!', o: [{ n: '백성을 보호한다', d: '군량 +80', k: 'food' }, { n: '의병으로 받아들인다', d: '무료 병사 3명 소집', k: 'volun' }] },
  { t: '정찰 보고', q: '적의 움직임을 알았어요!', o: [{ n: '길목을 막는다', d: '25초간 적 이동 속도 -40%', k: 'slow' }, { n: '기습 공격', d: '화면의 적 일부에게 큰 피해', k: 'raid' }] }
];

// ---------- 지형 / 길 ----------
const THEME = { plain: ['#cde8e4', '#e8dfbf'], mount: ['#d0e6e0', '#dedcbb'], sea: ['#cfe6ea', '#a9d3d6'], river: ['#d0e8e2', '#cfe0c4'] };
// 라운드 목표: d=성 수성 / e=탈출 / s=버티기 / b=적장 격파 / r=기습(보급창고 파괴)
const ROUND_OBJ = ['d', 'e', 's', 'r', 'b', 'd', 's', 'r', 'd', 'b', 's', 'd', 's', 'b', 'd', 's', 'r', 'e', 'r', 'b', 'd', 's', 'e', 'd', 's', 'e', 'd', 's', 'b', 'd'];
const MER = { hp: ['❤️', '튼튼한 몸', '영웅 체력 +10%'], dmg: ['⚔️', '날카로운 칼날', '공격력 +6%'], fd: ['🌾', '넉넉한 군량', '라운드 시작 군량 +20'], wall: ['🧱', '든든한 성벽', '성 체력 +12%'], xp: ['✨', '배움의 열기', '혼(경험치) 획득 +10%'], reg: ['🩹', '약초 주머니', '영웅 체력이 천천히 회복'] };
const MODS = { rich: ['🌾', '풍년', '군량 획득이 30% 늘어요'], vol: ['🤝', '의병 합류', '병사 2명과 함께 시작해요'], haste: ['💨', '질풍', '적이 조금 빨라지고 혼을 더 얻어요'] };
const OBJINFO = { d: { n: '성을 지켜라', ic: '🏯', t: '성이 무너지지 않게 시간이 끝날 때까지 지켜요' }, e: { n: '탈출하라', ic: '🚩', t: '5분 동안 오른쪽으로 계속 달려요! 앞뒤 양옆에서 몰려오는 적을 물리치세요' }, s: { n: '끝까지 버텨라', ic: '⏳', t: '쓰러지지 않고 시간이 끝날 때까지 버텨요' }, b: { n: '적장을 쓰러뜨려라', ic: '⚔️', t: '나타나는 적장을 쓰러뜨리면 승리해요' }, r: { n: '보급창고를 부숴라', ic: '🔥', t: '적의 보급창고를 모두 부수면 승리해요' } };
const ESC_STORY = { 1: '동래성이 함락되었다… 장수는 왜의 침략 소식을 도성(한양)에 알리러, 5분 동안 필사적으로 달린다!' };
const objText = (rd, ob) => (ob === 'e' && ESC_STORY[rd]) || OBJINFO[ob].t;
const WORLD = { d: [2400, 1500], b: [2400, 1500], s: [2400, 1500], e: [3600, 1400], r: [3000, 1800] };
const CR = 50; // 성 반경
function slotPos(i, ax, ay) { const ring = Math.floor(i / 6), a = (i % 6) / 6 * Math.PI * 2 + ring * 0.52 - Math.PI / 2, r = [62, 98, 134][ring]; return [ax + Math.cos(a) * r, ay + Math.sin(a) * r * 0.78 + 8]; }
const SLOTN = 18, UPC = [70, 110, 170, 250, 350];
const slotsOpen = (u) => Math.min(SLOTN, 8 + 2 * (u || 0));

// =====================================================================
//  호스트 시뮬레이션 (방장 기기에서만 실행)
// =====================================================================
let G = null; // 호스트 상태
const rnd = (a, b) => a + Math.random() * (b - a);
const rint = (n) => Math.floor(Math.random() * n);
function newG() {
  return { ph: 'lobby', rd: 0, pl: {}, order: [], sel: { start: 0, dur: FAST || 300 }, dif: DIFF.normal, paused: false, shots: [], fx: [], bonus: 0, log: [], ans: {}, res: null, ev: null, nid: 1, sn: 0, souls: [], pj: [], magT: 0, nl: 0 };
}
function addPlayer(id, name, role) {
  const R0 = ROLE[role] || ROLE.archer;
  G.pl[id] = { id, name: name || '의병' + (G.order.length + 1), role: role || 'archer', x: 300, y: 270, hp: R0.hp, mx: R0.hp, lv: 1, down: 0, cd: 0, atk: 0, cards: startCards(role || 'archer'), offer: null, offT: 0, mvx: 0, mvy: 0, st: {}, fz: 0 };
  G.order.push(id);
}
const CR_ORD = ['guard', 'ranger', 'supply'];
const CLV = [null, { hp: 1, dm: 1, cs: 12, dl: 1, bs: 1, ft: 16 }, { hp: 1.2, dm: 1.15, cs: 10, dl: 0.9, bs: 0.92, ft: 20 }, { hp: 1.45, dm: 1.3, cs: 8, dl: 0.78, bs: 0.85, ft: 24 }]; // 협동 난이도 1 연습 · 2 도전 · 3 극한
const CRD = { guard: { n: '방패 수비대', ic: '🛡', ab: '방벽', cd: 28, d: '성이 4초간 안전 + 성 체력 8% 회복 + 가까운 적 밀어내기', ps: '내 체력 +25%' }, ranger: { n: '불화살 유격대', ic: '🔥', ab: '불화살', cd: 22, d: '주변 적에게 큰 피해! 보급기지에는 최대 체력의 20%', ps: '공격력 +10% · 이동 +12%' }, supply: { n: '군량 보급대', ic: '🌾', ab: '보급', cd: 26, d: '모든 영웅 체력 30% 회복 + 군량 +30, 쓰러진 동료도 일으켜요', ps: '체력이 천천히 차올라요' } };
function gwAura(p) { for (const id of G.order) { const h = G.pl[id]; if (h && h.role === 'gwonyul' && h.hp > 0 && !(h.down > 0) && !h.away && Math.hypot(h.x - p.x, h.y - p.y) < 300) return true; } return false; }
function hjAura(p) { for (const id of G.order) { const h = G.pl[id]; if (h && h.role === 'hyujeong' && h.hp > 0 && !(h.down > 0) && !h.away && Math.hypot(h.x - p.x, h.y - p.y) < 300) return true; } return false; }
function heroStats0(p) { // 카드·시너지 반영 스탯
  const b = ROLE[p.role], c = p.cards, n = (k) => c[k] || 0, sa = p.sa || {};
  const lowHp = 1 - Math.max(0, p.hp) / p.mx;
  const dmg = (p.cr === 'ranger' ? 1.1 : 1) * (p.role === 'admiral' ? 1 + 0.5 * lowHp : 1) * (gwAura(p) ? 1.1 : 1) * (p.bfT > 0 ? 1.3 : 1) * (1 + 0.06 * ((p.mer && p.mer.dmg) || 0)) * (1 + 0.3 * n('forge')) * (1 + 0.12 * n('gong')) * (G.buffAtk > 0 ? 1.4 : 1) * (G.t < (G.moraleT || 0) ? 0.85 : 1) * (1 + 0.12 * n('spirit') * lowHp) * (1 + (sa.gong_spirit ? 0.06 : 0) + (sa.gong_spirit === 2 ? 0.3 : 0) + (sa.powder_forge === 2 ? 0.15 : 0));
  const WR = { bow: 260, nu: 290, cannon: 380, musket: 370, rocket: 400, stone: 270, turtle: 360, hwacha: 340, spear: 150, flail: 120, bomb: 340 };
  let rg = 0; for (const k in WR) if (c[k]) rg = Math.max(rg, WR[k]); if (c.sword) rg = Math.max(rg, 133 + 12 * c.sword + (c.evo_sword ? 45 : 0)); if (c.buddha) rg = Math.max(rg, 105 + 16 * c.buddha + (c.evo_buddha ? 40 : 0));
  return { rg, dmg, as: (1 + 0.12 * n('train')) * (1 + (sa.train_crit ? 0.08 : 0)),
    sp: b.sp * 1.2 * (p.role === 'gwakjaeu' ? 1.25 : 1) * (p.spT > 0 ? 1.5 : 1) * (p.cr === 'ranger' ? 1.12 : 1) * (1 + 0.25 * n('horse')) * (1 + 0.06 * n('scout')) * (1 + (sa.horse_scout ? 0.08 : 0) + (sa.horse_scout === 2 ? 0.25 : 0)) * (1 - 0.3 * (G.nl || 0)),
    aoe: (p.role === 'jinrin' ? 0.15 : 0) + 1 + 0.12 * n('powder') + (sa.powder_forge ? 0.1 : 0) + (sa.powder_forge === 2 ? 0.4 : 0),
    dr: Math.min(0.55, 0.08 * n('guard')), crit: Math.min(0.8, 0.06 * n('crit') + (sa.train_crit === 2 ? 0.25 : 0)),
    reg: ((p.cr === 'supply' ? 0.004 : 0) + (hjAura(p) ? 0.004 : 0) + 0.004 * n('medic') + 0.003 * ((p.mer && p.mer.reg) || 0) + (sa.medic_study ? 0.002 : 0)) * (sa.medic_study === 2 ? 2.5 : 1), mxm: (p.cr === 'guard' ? 1.25 : 1) * (1 + 0.4 * n('armor') + (sa.armor_guard ? 0.1 : 0)) * (1 + 0.1 * ((p.mer && p.mer.hp) || 0)) };
}
// ----- 영웅 숙련도(영구 성장): 판이 끝나면 남은 식량을 모아 패시브를 올려요. 이 기기의 모든 영웅·모든 판(온라인 포함)에 적용돼요 -----
const PAS = { dm: ['⚔', '피해량', '피해량 +4%'], mx: ['❤', '최대 체력', '최대 체력 +5%'], dr: ['🛡', '방어력', '받는 피해 -2%'], cr: ['💥', '치명타 확률', '치명타 확률 +2%'], sp: ['👟', '이동 속도', '이동 속도 +3%'], pj: ['🏹', '투사체', '2레벨마다 투사체 +1'], rg: ['💚', '체력 재생', '초당 체력 +0.15%'], ao: ['🌀', '범위 크기', '범위 +4%'], cd: ['⏱', '스킬 가속', '재사용 대기 -4%'], xp: ['📘', '경험치', '경험치 +3%'], fd: ['🌾', '식량 획득', '식량 +4%'] };
const PAS_BASE = ['dm', 'mx'], PAS_COST = [100, 200, 350, 550, 800], PAS_MAX = 5;
const PAS_GOALS = [ // [id, 이름, 달성 조건, 열리는 것(패시브 키 또는 '+' = 칸 1개 늘어남)]
  ['g_win', '첫 승리', (s) => s.win >= 1, 'dr'], ['g_k500', '적 500명 처치', (s) => s.kills >= 500, 'cr'], ['g_lv8', '한 판에서 레벨 8 도달', (s) => s.bestLv >= 8, 'sp'], ['g_pt', '누적 20분 플레이', (s) => s.time >= 1200, 'rg'],
  ['g_alt', '제단 5번 켜기', (s) => s.alt >= 5, 'ao'], ['g_k2k', '적 2,000명 처치', (s) => s.kills >= 2000, 'cd'], ['g_lv15', '한 판에서 레벨 15 도달', (s) => s.bestLv >= 15, 'xp'], ['g_boss', '적장 5명 쓰러뜨리기', (s) => s.boss >= 5, 'fd'], ['g_k1k', '적 1,000명 처치', (s) => s.kills >= 1000, 'pj'],
  ['s_w2', '무기를 2레벨로 업그레이드', (s) => s.bestW >= 2, '+'], ['s_w5', '무기를 5레벨로 업그레이드', (s) => s.bestW >= 5, '+'], ['s_k15k', '적 15,000명 처치', (s) => s.kills >= 15000, '+'], ['s_t15', '15분 생존 (무한 모드)', (s) => s.bestT >= 900, '+']];
function pasLoad() { let d = {}; try { d = JSON.parse(localStorage.getItem('jd_pas') || '{}') || {}; } catch (e) {} d.food = Math.max(0, d.food | 0); d.lv = d.lv || {}; d.eq = Array.isArray(d.eq) ? d.eq : ['dm', 'mx']; d.st = Object.assign({ kills: 0, alt: 0, boss: 0, bestLv: 0, bestT: 0, bestW: 0, win: 0, time: 0 }, d.st || {}); d.ok = d.ok || {}; return d; }
function pasSave(d) { try { localStorage.setItem('jd_pas', JSON.stringify(d)); } catch (e) {} }
function pasSlots(d) { return 2 + PAS_GOALS.filter((g) => g[3] === '+' && d.ok[g[0]]).length; }
function pasOpen(d, k) { return PAS_BASE.includes(k) || PAS_GOALS.some((g) => g[3] === k && d.ok[g[0]]); }
function pasActive() { const d = pasLoad(), o = {}; for (const k of d.eq.slice(0, pasSlots(d))) if (PAS[k] && pasOpen(d, k) && (d.lv[k] | 0) > 0) o[k] = Math.min(PAS_MAX, d.lv[k] | 0); return o; }
function pasClean(ps) { const o = {}; if (ps && typeof ps === 'object') for (const k of Object.keys(ps).slice(0, 6)) if (PAS[k]) { const v = Math.max(0, Math.min(PAS_MAX, ps[k] | 0)); if (v) o[k] = v; } return o; }
function pasLv(p, k) { return (p && p.ps && p.ps[k]) | 0; }
function pasMax(k) { let m = 0; for (const id of G.order) m = Math.max(m, pasLv(G.pl[id], k)); return m; }
function pasText(ps) { const k = Object.keys(ps || {}); return k.length ? k.map((x) => PAS[x][1] + ' Lv.' + ps[x]).join(' · ') : '아직 없어요'; }
function pasTip() { const el = $('pasTip'); if (!el) return; const d = pasLoad(), ps = pasActive(); el.innerHTML = `🎖 <b>영웅 숙련도</b> · 🌾 ${d.food} · 칸 ${Object.keys(ps).length}/${pasSlots(d)}<br><small>${esc(pasText(ps))} — 모든 영웅에게 적용돼요 (🎖 버튼에서 키워요)</small>`; }
function pasSettle(i) { // i: {food, win, kc, lv, t, al, bk, wl, es}
  const d = pasLoad(), st = d.st, bank = Math.max(0, i.food | 0) + (i.win ? 60 : 20); d.food += bank;
  st.kills += i.kc | 0; st.alt += i.al | 0; st.boss += i.bk | 0; st.bestLv = Math.max(st.bestLv, i.lv | 0); st.bestW = Math.max(st.bestW, i.wl | 0); st.time += Math.floor((i.t | 0) / 1); if (i.win) st.win++; if (i.es) st.bestT = Math.max(st.bestT, i.t | 0);
  const nw = [], slotsBefore = pasSlots(d); for (const g of PAS_GOALS) if (!d.ok[g[0]] && g[2](st)) { d.ok[g[0]] = Date.now(); nw.push(g); if (g[3] !== '+' && d.eq.length < pasSlots(d) && !d.eq.includes(g[3])) d.eq.push(g[3]); }
  pasSave(d); return { bank, nw, slots: pasSlots(d), up: pasSlots(d) > slotsBefore };
}
function pasResHtml(a) { return `🎖 <b>식량 🌾${a.bank}</b>을 모았어요 (영웅 숙련도에서 패시브를 키울 수 있어요)` + (a.nw.length ? '<br>🔓 ' + a.nw.map((g) => '<b>' + esc(g[1]) + '</b> → ' + (g[3] === '+' ? '패시브 칸 +1' : esc(PAS[g[3]][1]) + ' 해금')).join(' · ') : ''); }
const AUGS = [['🔥', '공격력 +10%', 'dm', 0.1], ['⚡', '공격 속도 +10%', 'as', 0.1], ['🎯', '급소 확률 +8%', 'cr', 0.08], ['👟', '이동 속도 +8%', 'sp', 0.08], ['💚', '체력 재생 +0.2%/초', 'rg', 0.002]];
function addAug() { const a = AUGS[rint(AUGS.length)]; G.aug = G.aug || {}; G.aug[a[2]] = (G.aug[a[2]] || 0) + a[3]; return a[0] + ' 증강! ' + a[1]; }
function heroStats(p) { const S = heroStats0(p), sg = G && G.sig, L = (k) => pasLv(p, k);
  if (L('dm')) S.dmg *= 1 + 0.04 * L('dm'); if (L('mx')) S.mxm *= 1 + 0.05 * L('mx'); if (L('sp')) S.sp *= 1 + 0.03 * L('sp'); if (L('ao')) S.aoe *= 1 + 0.04 * L('ao'); if (L('cr')) S.crit = Math.min(0.8, S.crit + 0.02 * L('cr')); if (L('rg')) S.reg += 0.0015 * L('rg');
  const ag = (G && G.aug) || {}; if (ag.dm) S.dmg *= 1 + ag.dm; if (ag.as) S.as *= 1 + ag.as; if (ag.cr) S.crit = Math.min(0.8, S.crit + ag.cr); if (ag.sp) S.sp *= 1 + ag.sp; if (ag.rg) S.reg += ag.rg;
  if (sg === 'sea' && S.rg) S.rg *= 1.12; if (sg === 'cav') S.sp *= 1.08; if (sg === 'guer') S.dmg *= 1.1; return S; }
let CRIT = 0; // 지금 공격 중인 영웅의 급소 확률
function hurt(p, v) { if (p.away) return; let m = 1 - Math.min(0.55, 0.08 * ((p.cards && p.cards.guard) || 0)); if (pasLv(p, 'dr')) m *= 1 - 0.02 * pasLv(p, 'dr'); if (p.sdT > 0) m *= 0.4; if (p.role === 'yujeong') m *= 0.85; if (p.role === 'gimsimin' && G.castle && Math.hypot(p.x - G.ax, p.y - G.ay) < 320) m *= 0.7; p.hp -= v * m; }
function xpMul() { let m = G.sig === 'plain' ? 1.15 : 1; for (const id of G.order) { const p = G.pl[id], sa = p.sa || {}; m = Math.max(m, 1 + 0.1 * ((p.mer && p.mer.xp) || 0) + 0.15 * (p.cards.study || 0) + (sa.medic_study ? 0.05 : 0) + (sa.medic_study === 2 ? 0.2 : 0)); } return m * (1 + 0.03 * pasMax('xp')) * (G.mod === 'haste' ? 1.25 : 1); }
function roadY(x, ww, wh) { return wh * 0.5 + Math.sin(x / ww * Math.PI * 4) * 130; }
function escGo(hs2) { // 탈출: 살아있는 사람 친구 모두가 오른쪽 끝에 닿아야 다음 구간으로 넘어가요 (봇은 제외)
  const edge = G.ww - 800, hu = hs2.filter((h) => !h.bot && !h.away); G.esw = null;
  if (!hu.length) return Math.max(...hs2.map((h) => h.x)) > edge;
  const lag = hu.filter((h) => h.x <= edge); if (lag.length === 0) { G.escW0 = null; return true; }
  const lead = hu.filter((h) => h.x > edge);
  if (lead.length) { if (G.escW0 == null) G.escW0 = G.t; const left = 25 - (G.t - G.escW0); G.esl = Math.ceil(Math.max(0, left));
    if (left <= 0) { const tx = Math.min(...lead.map((h) => h.x)); for (const h of lag) { h.x = tx - 20; h.y = lead[0].y + rnd(-50, 50); G.fx.push([h.x, h.y, 60, 'sum']); } G.escW0 = null; G.info = { id: Date.now() + Math.random(), tt: '⏩ 시간이 지났어요!', tx: '늦은 친구도 함께 다음 구간으로 이동해요' }; return true; }
    G.esw = lag.map((h) => h.name); for (const h of hu) h.x = Math.min(h.x, G.ww - 140); } else G.escW0 = null;
  return false;
}
const ESHIFT = 1600; // 탈출: 영웅이 오른쪽 끝에 가까워지면 세상을 통째로 왼쪽으로 옮겨 끝없이 달리게 해요
function startRound(i) {
  const rd = R[i], P = G.sel.dur, i0 = i - (i < 10 ? 0 : i < 20 ? 10 : i < 25 ? 20 : 25), ob = (G.cm && G.cmObj) || ROUND_OBJ[i];
  G.rd = i; G.sig = rd.cl; G.sc = i + (G.cyc || 0) * R.length; G.paused = false; G.ph = 'brief'; G.res = null; G.ans = {}; G.ev = null; G.obj = ob; G.castle = ob === 'd' || ob === 'b';
  G.path = rd.th; G.t = 0; G.dur = P; G.fl = 0; G.sf = 0; G.en = []; G.shots = []; G.fx = [];
  const [ww, wh] = WORLD[ob]; G.ww = ww; G.wh = wh; G.ax = ob === 'e' ? 160 : ob === 'r' ? 300 : ww / 2; G.ay = ob === 'e' ? roadY(160, ww, wh) : ob === 'r' ? wh / 2 + 150 : wh / 2;
  const k = 2 + (i >= 13 ? 1 : 0) + (i >= 22 ? 1 : 0), b0 = rnd(0, 6.283); G.dirs = []; for (let j = 0; j < k; j++) G.dirs.push(b0 + j * 6.283 / k);
  G.lives = G.castle ? 99 : G.obj === 'e' ? 0 : G.order.length + 2; G.waveT = G.endless ? 22 : 40; G.firstRaid = !G.endless; G.ambN = 0; G.bm = [false, false]; G.bInv = 0; G.bInvHp = 0; G.repCd = 0; G.gi = 0; G.bossOut = false; G.bossDead = false; G.finalDead = false; G.campPos = []; G.dmx = 1; G.er = -1; G.nightRd = false; G.bpi0 = rint(5); G.bossI = 0; G.bossTimes = (ob === 'd' || ob === 's') ? (P >= 170 ? [120, 240].filter((x) => x < P - 15) : [Math.max(P * 0.5, P - 60)]) : []; if ((ob === 'd' || ob === 's') && coopOf().gen) { const ex = coopOf().gen, at = [Math.max(35, P * 0.3), Math.max(60, P * 0.68)]; for (let q = 0; q < ex; q++) G.bossTimes.push(at[q]); G.bossTimes.sort((a, b) => a - b); }
  G.goals = ob === 'e' ? [[ww * 0.3, roadY(ww * 0.3, ww, wh)]] : [];
  G.s3 = 0; G.wx = null; G.wxEm = 1; G.wxHm = 1; G.wxSp = 1; G.wxNext = 60; G.moraleT = 0; G.skUntil = 0; G.hdT = 45; G.hd2 = null; G.info = null; G.sm = null; G.spSlow = 0; G.spFast = 0; G.kc = 0; G.ambT = (G.endless ? 8 : 34) * (G.sig === 'guer' ? 0.75 : 1); G.runX = 0; G.souls = []; G.pj = []; G.magT = 0; G.nl = 0; G.nIn = false; G.evR = null; G.evShow = 0; G.units = new Array(SLOTN).fill(null); G.sumN = 0; G.sumMiss = 0; G.buffAtk = 0; G.slowT = 0; G.evDone = [false, false];
  G.baseMax = Math.round((G.sig === 'mount' ? 1.1 : 1) * (G.cm ? CLV[G.cl || 2].bs : 1) * 600 * G.dif.bs * (1 + 0.2 * (G.wallN || 0)) * (1 + 0.12 * Math.max(0, ...G.order.map((id) => (G.pl[id].mer && G.pl[id].mer.wall) || 0)))); G.baseHp = G.baseMax;
  G.mod = (G.endless || i === 0) ? null : [null, 'rich', 'vol', 'haste'][(i * 7 + 3) % 4]; if (G.daily && G.dailyMod) G.mod = G.dailyMod; G.co = coopOf(); G.dmx = (i < 6 && !G.endless ? 0.85 : 1) * G.co.dm * (G.cm ? CLV[G.cl || 2].dm : 1);
  G.food = 110 + G.bonus + G.dif.fd + 20 * Math.max(0, ...G.order.map((id) => (G.pl[id].mer && G.pl[id].mer.fd) || 0)); G.bonus = 0; G.foodMul = G.mod === 'rich' ? 1.3 : 1; G.spawnT = 1.5; G.bossDone = false; G.xp = 0; G.need = 4; G.lvC = 0; G.crates = ob === 'e' ? [{ x: 760, y: roadY(760, ww, wh), k: 'gmc' }] : []; G.crateT = 5; G.altN = 0; G.aug = {}; G.bc = null; G.bcN = 0; G.evoQ = 0; G.bossOut = false; G.altars = []; for (let i = 0, n = 2 + (G.sc >= 10 ? 1 : 0); i < n; i++) { const x = rnd(ww * 0.2, ww * 0.85), y = ob === 'e' ? roadY(x, ww, wh) + rnd(-140, 140) : rnd(wh * 0.2, wh * 0.8); G.altars.push({ x: Math.max(120, Math.min(ww - 120, x)), y: Math.max(120, Math.min(wh - 120, y)), g: 0, d: 0 }); } G.upg = 0; G.tt = 1;
  if (G.endless) G.dur = 1e9;
  const hs = (1 + 0.09 * G.dif.sc * G.sc) * (rd.df ? 1.1 : 1) * G.dif.hp * (i < 6 && !G.endless ? 0.88 : 1) * (G.cm ? CLV[G.cl || 2].hp : 1);
  if (ob === 'r') { const n = 3 + (i >= 16 ? 1 : 0), pos = [[ww * 0.42, wh * 0.26], [ww * 0.72, wh * 0.7], [ww * 0.88, wh * 0.28], [ww * 0.55, wh * 0.88]]; for (let j = 0; j < n; j++) { G.campPos.push(pos[j]); spawn('camp', hs * 0.9, pos[j]); } G.campTotal = n; }
  G.cmOn = false; if (G.cmOn) { const pos = [[ww * 0.14, wh * 0.2], [ww * 0.86, wh * 0.8]]; for (const q of pos) { G.campPos.push(q); spawn('camp', hs * (G.rd < 6 ? 0.55 : 0.75), q); } G.campTotal = 2; }
  G.cmS = !!G.cm && ob === 's'; G.cmR = !!G.cm && ob === 'r'; G.cmD = false; G.cmG = 0; G.cmOc = [0, 0]; G.cmPl = G.cmS ? [[G.ax - 260, G.ay], [G.ax + 260, G.ay]] : []; G.cmM = G.cmOn || G.cmS || G.cmR; G.cmDl = G.cmOn ? Math.round(G.dur * CLV[G.cl || 2].dl) : 0; if (G.cmR) G.dur = Math.min(G.dur, Math.round(140 * CLV[G.cl || 2].dl));
  if (ob !== 'e') for (let j = 0; j < Math.min(5, Math.floor(i0 / 4)) + (G.mod === 'vol' ? 2 : 0); j++) doSummon(true);
  G.order.forEach((id, n) => { const p = G.pl[id]; p.cr = G.cm ? CR_ORD[n % 3] : ''; if (p.bot && p.cr) p.name = BOT_NM[p.cr]; p.cc = 0; p.cards = startCards(p.role); p.sn = {}; p.rv = 0; calcSyn(p); p.lv = 1; p.mx = Math.round(ROLE[p.role].hp * G.dif.hh * heroStats(p).mxm); p.hp = p.mx; p.down = 0; p.cd = 0; p.offer = null; p.mo = null; p.fz = 3; const a = n * 1.2; if (G.castle) { p.x = G.ax - 120 + Math.cos(a) * 30; p.y = G.ay + 70 + Math.sin(a) * 40; } else { p.x = G.ax + Math.cos(a) * 60; p.y = G.ay + 110 + Math.sin(a) * 40; } });
}
function beginBattle() { G.ph = 'battle'; if (G.sig && SIGD[G.sig] && !G.endless && !G.cm) G.info = { id: Date.now() + Math.random(), tt: SIGD[G.sig][0] + ' 이번 판 특징: ' + SIGD[G.sig][1], tx: SIGD[G.sig][2] }; if (G.cm && !G.cmM) { const O = OBJINFO[G.obj]; G.info = { id: Date.now() + Math.random(), tt: '🎲 이번 시나리오: ' + O.ic + ' ' + O.n, tx: G.obj === 'e' ? '➡ 오른쪽으로 계속 달리세요! 5분 동안 버티면 탈출 성공!' : O.t }; } if (G.cmM) G.info = { id: Date.now() + Math.random(), tt: G.cmOn ? '🤝 협동 미션 · 이중 전선' : G.cmS ? '🤝 협동 미션 · 쌍둥이 봉화' : '🤝 협동 미션 · 속전속결', tx: G.cmOn ? '성도 지키고, 멀리 있는 보급기지 2곳도 시간 안에 부수세요! 각자 역할 버튼을 써요' : G.cmS ? '두 발판에 서로 다른 영웅이 동시에 서야 봉화가 차올라요! 시간 안에 올리세요' : '시간 안에 모든 기지를 부수세요! 늦으면 져요' }; const ok = Object.keys(G.ans).filter((id) => G.ans[id] === R[G.rd].q[2]).length; G.food += ok * 15; if (G.es) G.es.q += ok; }
function summonCost() { return Math.round(40 * (1 + 0.1 * G.sumN)); }
function doSummon(free) {
  let slot = -1; for (let i = 0; i < slotsOpen(G.upg); i++) if (!G.units[i]) { slot = i; break; } if (slot < 0) return false;
  const cost = summonCost(); if (!free && G.food < cost) return false;
  const rd = R[G.rd], clueU = CLUE[rd.cl].u, w = {};
  const pool = G.rd < 20 ? ['bow', 'spear', 'gun', 'cannon', 'cav'] : ['bow', 'spear', 'gun', 'cannon', 'cav'];
  for (const k of pool) { w[k] = 1; if (k === clueU) w[k] *= 2.6; if (G.units.some((u) => u && u.t === k && u.lv === 1)) w[k] *= 1.5; }
  if (G.sumMiss >= 3) for (const k of pool) if (G.units.some((u) => u && u.t === k)) w[k] *= 3;
  let tot = 0; for (const k in w) tot += w[k]; let x = Math.random() * tot, pick = 'bow'; for (const k in w) { x -= w[k]; if (x <= 0) { pick = k; break; } }
  const pair = G.units.some((u) => u && u.t === pick && u.lv === 1); G.sumMiss = pair ? 0 : G.sumMiss + 1;
  G.units[slot] = { t: pick, lv: 1, cd: rnd(0, 0.5) };
  if (!free) { G.food -= cost; G.sumN++; }
  { const q = slotPos(slot, G.ax, G.ay); G.fx.push([q[0], q[1], 26, 'sum']); }
  return true;
}
function doMerge(a, b) {
  if (a === b) return; const A = G.units[a], B = G.units[b];
  if (!A) return;
  if (!B) { G.units[b] = A; G.units[a] = null; return; }
  if (A.t === B.t && A.lv === B.lv && B.lv < 4) { B.lv++; B.hp = 1e9; G.units[a] = null; { const q = slotPos(b, G.ax, G.ay); G.fx.push([q[0], q[1], 34, 'merge']); } }
  else { G.units[a] = B; G.units[b] = A; }
}
function applyCard(p, id) {
  p.cards[id] = (p.cards[id] || 0) + 1;
  calcSyn(p); { const old = p.mx; p.mx = Math.round(ROLE[p.role].hp * G.dif.hh * heroStats(p).mxm); if (p.mx > old) p.hp = Math.min(p.mx, p.hp + (p.mx - old) + (id === 'armor' ? p.mx * 0.3 : 0)); }
  if (id === 'wall') { G.baseMax = Math.round(G.baseMax * 1.2); G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.12); G.wallN = (G.wallN || 0) + 1; }
  if (id === 'food') G.foodMul += 0.3;
  if (id === 'rage') G.buffAtk = 20;
  if (id === 'volun') { doSummon(true); doSummon(true); }
  if (id === 'heal') for (const q of G.order) { const h = G.pl[q]; h.hp = Math.min(h.mx, h.hp + h.mx * 0.5); }
}
const POOL = {}; for (const k in WEAP) if (k !== 'turtle') POOL[k] = 1; for (const k in ABIL) POOL[k] = 1;
const QALL = (() => { const m = { '삼국 시대': 2, '남북국 시대': 3, '고려 시대': 4, '조선 초기': 5 }; const a = QB.map((x, i) => ({ id: 'b' + i, era: x[0], q: [x[1], x[2], x[3], x[4]] })); ER.forEach((x, i) => a.push({ id: 'e' + i, era: m[x[4]] != null ? m[x[4]] : 5, q: x })); R.forEach((r, i) => a.push({ id: 'r' + i, era: 6 + r.ch, ch: r.ch, q: r.q })); return a; })();
function nextQuiz() { // 이번 시대 · 지난 시대 · 더 먼저 배운 시대 문제를 섞어 한 문제를 골라요
  const ch = R[G.rd].ch, mx = 6 + ch; if (!G.qseen) G.qseen = {};
  const pool = QALL.filter((x) => x.era <= mx), A = pool.filter((x) => x.era === mx), B = pool.filter((x) => x.era >= 6 && x.era < mx), C = pool.filter((x) => x.era < 6);
  const bk = [A, B, C], rr = Math.random(); let b = rr < 0.35 ? 0 : rr < 0.55 ? 1 : 2; if (!bk[b].length) b = bk.findIndex((x) => x.length);
  let c = bk[b].filter((x) => !G.qseen[x.id]); if (!c.length) { for (const x of bk[b]) delete G.qseen[x.id]; c = bk[b]; }
  const it = c[rint(c.length)]; G.qseen[it.id] = 1; const q = it.q, idx = q[1].map((_, k) => k).sort(() => Math.random() - 0.5);
  return { q: q[0], o: idx.map((k) => q[1][k]), a: idx.indexOf(q[2]), w: q[3], tag: it.era === mx ? '이번 시대 문제 · ' + QERA[it.era] : '🕰 ' + QERA[it.era] };
}
function startQuiz() { // 한 판에 한 명(랜덤)이 문제를 풀고, 맞히면 모두 카드 4장·틀리면 2장이 열려요
  const ids = G.order, hs = ids.map((i) => G.pl[i]).filter((p) => !p.bot && !p.away), cand = hs.length ? hs : [G.pl[ids[0]]];
  const mn = Math.min(...cand.map((p) => p.qturn || 0)), pk = cand.filter((p) => (p.qturn || 0) === mn), qr = pk[rint(pk.length)]; qr.qturn = (qr.qturn || 0) + 1;
  const qz = nextQuiz(); qz.by = qr.id; qz.bn = qr.name; G.qzr = qr.id;
  offerCards(qr); qr.qz = Object.assign({}, qz); qr.qs = 0; qr.qrw = ''; qr.offT = 30; G.chs = {};
  for (const id of ids) { const p = G.pl[id]; if (p === qr) continue; p.offer = p.bot ? null : qr.offer.slice(); p.qz = p.bot ? null : Object.assign({}, qz); p.qs = 0; p.qrw = ''; p.offT = 45; }
}

// ===== 협동 서브미션 (v0.34): 30초 안팎마다 새 임무가 이어져요 =====
const SMD = {
  camp: ['🔥 보급기지 습격', '적 보급기지를 부수세요! 성공하면 적이 20초 동안 느리게 나와요'],
  conv: ['🌾 식량 수송대 차단', '몰래 지나가는 식량부대 4명을 모두 잡으세요! 성공하면 군량이 크게 올라요'],
  ref: ['🚶 피난민 호위', '맵 끝에서 피난민이 나와요! 성(성이 없으면 영웅)까지 무사히 도착하도록 적을 막아 주세요! 성공하면 혼(경험치)이 많이 올라요'],
  twin: ['🔥 쌍둥이 봉화', '서로 다른 두 영웅이 두 봉화 발판에 동시에 서세요! 성공하면 전원 회복 + 공격 버프'],
  herb: ['🌿 약초 수집', '지도에 나타난 약초 4개를 모으세요! 성공하면 전원 체력이 크게 회복돼요'],
  rush: ['🛡 돌격 막아내기', '30초 동안 아무도 쓰러지지 않고 버티세요! 성공하면 카드가 열려요'],
  rep: ['🏰 성벽 수리 작전', '성이 위험해요! 영웅이 성 가까이에서 8초 동안 버티며 수리하세요! 성공하면 성 체력 30% 회복'],
  fast: ['⚡ 빠른 처치 경쟁', '30초 안에 적을 많이 처치하세요! 성공하면 공격력이 30초 동안 올라요']
};

function hsNow() { const rd = R[G.rd]; return (1 + 0.09 * G.dif.sc * G.sc) * (rd.df ? 1.1 : 1) * G.dif.hp * (G.cm ? CLV[G.cl || 2].hp : 1); }
function waveAround(n, r) { const hs = hsNow(), al = aliveHeroes(), c = al.length ? al[rint(al.length)] : { x: G.ax, y: G.ay }; for (let i = 0; i < n && G.en.length < 260; i++) { const a = rnd(0, 6.283); spawn(i % 5 === 0 ? 'cav' : 'grunt', hs, clampW(c.x + Math.cos(a) * r + rnd(-60, 60), c.y + Math.sin(a) * r * 0.7 + rnd(-60, 60))); } }
function smPenalty(k) {
  const al = aliveHeroes(), hurtAll = (f) => { for (const h of al) h.hp = Math.max(1, h.hp - h.mx * f); };
  if (k === 'camp') { waveAround(14, 620); G.spFast = G.t + 15; return '적 증원 도착! 15초 동안 적이 빨리 나와요'; }
  if (k === 'conv') { const l = Math.round(G.food * 0.25); G.food = Math.max(0, G.food - l); return '군량 -' + l; }
  if (k === 'ref') { hurtAll(0.2); return '슬픔에 잠겨 영웅 체력 -20%'; }
  if (k === 'twin') { waveAround(12, 600); return '봉화를 놓쳐 적이 습격해요!'; }
  if (k === 'herb') { hurtAll(0.15); return '독한 안개… 영웅 체력 -15%'; }
  if (k === 'rush') { if (G.castle) { G.baseHp = Math.max(1, G.baseHp - G.baseMax * 0.15); return '성 체력 -15%'; } hurtAll(0.15); return '영웅 체력 -15%'; }
  if (k === 'fast') { waveAround(12, 640); return '적이 더 몰려와요!'; }
  if (k === 'rep') { G.baseHp = Math.max(1, G.baseHp - G.baseMax * 0.1); waveAround(8, 560); return '성 체력 -10% · 적이 습격해요'; }
  return '';
}
function smStreak(S) { S.stk = (S.stk | 0) + 1; if (S.stk >= 3) { S.stk = 0; G.s3 = (G.s3 | 0) + 1; doSummon(true); doSummon(true); return ' 🎉 3연속 성공! 지원군 합류!'; } return ''; }
function smInfo(tt, tx) { G.info = { id: Date.now() + Math.random(), tt, tx }; }
function smEnd(S, ok, msg) { const m = S.cur; if (ok) { S.ok++; S.fl = 0; if (G.t < (G.moraleT || 0)) { G.moraleT = 0; msg += ' · 😊 사기 회복!'; } msg += smStreak(S); msg += ' · ' + addAug(); } else { S.no++; S.stk = 0; S.fl = (S.fl | 0) + 1; msg = msg + ' · ' + smPenalty(m.k); if (S.fl >= 2) { G.moraleT = G.t + 25; msg += ' · 😞 사기 하락! 25초 동안 공격력 -15% (미션 성공하면 회복)'; } } smInfo((ok ? '✅ 미션 성공! ' : '⌛ 미션 실패… ') + SMD[m.k][0], msg); if (m.e) { const i = G.en.indexOf(m.e); if (i >= 0 && m.e.hp > 0) G.en.splice(i, 1); } for (const c of m.cv || []) { const i = G.en.indexOf(c); if (i >= 0) G.en.splice(i, 1); } S.cur = null; S.nt = Math.max(4, 40 - (G.t - m.t0)); }
function smStart(S, hs2, hs) {
  const np = hs2.length, base = G.castle ? [G.ax, G.ay] : [hs2.reduce((a, h) => a + h.x, 0) / np, hs2.reduce((a, h) => a + h.y, 0) / np];
  const ks = Object.keys(SMD).filter((k) => k !== S.last && (k !== 'twin' || (np >= 2 && !G.cmS)) && (k !== 'rep' || (G.castle && G.baseHp < G.baseMax * 0.8)) && (G.obj !== 'e' || k === 'rush' || k === 'fast')); const k = (G.castle && G.baseHp < G.baseMax * 0.55 && S.last !== 'rep') ? 'rep' : ks[rint(ks.length)], a = rnd(0, 6.283), P = (r, aa) => clampW(base[0] + Math.cos(aa) * r, base[1] + Math.sin(aa) * r, 40);
  const m = { k, t: 30, a: 0, b: 1, pts: [], t0: G.t }; S.last = k; S.cur = m;
  if (k === 'camp') { const e = spawn('camp', hs, P(rnd(520, 640), a)); e.sm = 1; e.gt = 1e9; e.hp = e.mx = 380 + 50 * np; m.e = e; m.b = 1; }
  else if (k === 'conv') { m.cv = []; const p0 = P(640, a), tg = [-Math.sin(a), Math.cos(a)]; for (let i = 0; i < 4; i++) { const e = spawn('grunt', hs, clampW(p0[0] + tg[0] * -i * 38, p0[1] + tg[1] * -i * 38)); e.sm = 2; e.cv = [tg[0] * 52, tg[1] * 52]; e.hp = e.mx = 45; e.d0 = 0; m.cv.push(e); } m.b = 4; m.t = 30; }
  else if (k === 'ref') { const ed = clampW(base[0] + Math.cos(a) * 4000, base[1] + Math.sin(a) * 4000, 30); m.cs = G.castle ? 1 : 0; m.u = { x: ed[0], y: ed[1], hp: 100 }; m.g = m.cs ? [G.ax, G.ay] : [base[0], base[1]]; m.amb = false; m.t = 40; m.b = 100; }
  else if (k === 'twin') { const c = P(330, a), nx = -Math.sin(a) * 80, ny = Math.cos(a) * 80; m.pa = clampW(c[0] + nx, c[1] + ny); m.pb = clampW(c[0] - nx, c[1] - ny); m.pg = 0; m.b = 100; }
  else if (k === 'herb') { m.h = []; for (let i = 0; i < 4; i++) m.h.push(P(rnd(240, 440), a + i * 1.57 + rnd(-0.3, 0.3))); m.b = 4; m.t = 30; }
  else if (k === 'rush') { m.t = 30; m.rt = 1; m.b = 30; }
  else if (k === 'rep') { m.t = 30; m.b = 8; m.a = 0; m.sec = 0; }
  else if (k === 'fast') { m.t = 30; m.k0 = G.kc || 0; m.need = 14 + 5 * np; m.b = m.need; }
  smInfo('🎯 서브미션! ' + SMD[k][0], SMD[k][1]);
}
function smPts(m) {
  const r = (v) => Math.round(v);
  if (m.k === 'camp') return m.e && m.e.hp > 0 ? [[r(m.e.x), r(m.e.y), '🔥']] : [];
  if (m.k === 'conv') return m.cv.filter((c) => c.hp > 0).map((c) => [r(c.x), r(c.y), '🌾']);
  if (m.k === 'ref') return [[r(m.u.x), r(m.u.y), '🚶'], [r(m.g[0]), r(m.g[1]), m.cs ? '🏰' : '🚩']];
  if (m.k === 'twin') return [[r(m.pa[0]), r(m.pa[1]), m.on ? '🟢' : '🔥'], [r(m.pb[0]), r(m.pb[1]), m.on ? '🟢' : '🔥']];
  if (m.k === 'rep') return [[r(G.ax), r(G.ay), '🏰']];
  if (m.k === 'herb') return m.h.map((q) => [r(q[0]), r(q[1]), '🌿']);
  return [];
}
function subStep(dt, hs2, hs) {
  if (G.endless) { G.sm = null; return; }
  const S = G.sm = G.sm || { cur: null, nt: G.cm ? 15 : 20, last: '', ok: 0, no: 0 };
  if (G.du || G.ev || G.order.some((id) => G.pl[id].offer) || !hs2.length) return;
  if (!S.cur) { S.nt -= dt; if (S.nt <= 0 && G.t < G.dur - 32) smStart(S, hs2, hs); return; }
  const m = S.cur; m.t -= dt; const np = hs2.length;
  if (m.k === 'camp') { if (m.e.hp <= 0 || !G.en.includes(m.e)) { G.spSlow = G.t + 20; return smEnd(S, true, '적이 20초 동안 느리게 나와요!'); } m.a = 0; }
  else if (m.k === 'conv') { let dead = 0; for (const c of m.cv) { if (c.hp <= 0 || !G.en.includes(c)) dead++; else { c.d0 += 52 * dt; if (c.d0 > 1100 || c.x < 5 || c.y < 5 || c.x > G.ww - 5 || c.y > G.wh - 5) { c.hp = 0; c.esc = 1; } } } m.a = m.cv.filter((c) => c.hp <= 0 && !c.esc).length; const esc = m.cv.filter((c) => c.esc).length; if (esc > 0) { G.en = G.en.filter((e) => !e.esc); return smEnd(S, false, '식량부대가 도망쳤어요'); } if (m.a >= 4) { const f = Math.round(130 * G.foodMul); G.food += f; return smEnd(S, true, '군량 +' + f); } }
  else if (m.k === 'ref') { const u = m.u; let thr = 0; for (const e of G.en) { if (e.t === 'camp' || e.cv) continue; const d = Math.hypot(e.x - u.x, e.y - u.y); if (d < 40 && thr < 3) { thr++; u.hp -= ET[e.t].dm * 1.2 * dt; } else if (d < 90) thr = Math.max(thr, 0.5); }
    if (!m.cs) { let bh = null, bd = 1e12; for (const h of hs2) { const d = Math.hypot(h.x - u.x, h.y - u.y); if (d < bd) { bd = d; bh = h; } } if (bh) m.g = [bh.x, bh.y]; }
    const gd = Math.hypot(m.g[0] - u.x, m.g[1] - u.y); if (u.sx == null) { u.sx = u.x; u.sy = u.y; u.d0 = Math.max(1, gd); u.sp = Math.max(50, u.d0 / 22); }
    if (thr < 0.5) { u.x += (m.g[0] - u.x) / (gd || 1) * u.sp * dt; u.y += (m.g[1] - u.y) / (gd || 1) * u.sp * dt; }
    m.a = Math.max(0, Math.min(99, Math.round((1 - gd / u.d0) * 100))); if (!m.amb && m.a >= 40) { m.amb = true; const ax2 = u.x + (m.g[0] - u.x) / (gd || 1) * 230, ay2 = u.y + (m.g[1] - u.y) / (gd || 1) * 230; for (let i = 0; i < 7; i++) spawn('grunt', hs, clampW(ax2 + rnd(-120, 120), ay2 + rnd(-120, 120))); }
    if (u.hp <= 0) return smEnd(S, false, '피난민이 쓰러졌어요'); if (gd < (m.cs ? 70 : 55)) { gainXp(Math.max(4, Math.round(G.need * 0.7))); return smEnd(S, true, (m.cs ? '피난민이 성에 들어갔어요! ' : '피난민이 영웅을 만났어요! ') + '혼(경험치) 보너스!'); } }
  else if (m.k === 'twin') { const near = (pt) => hs2.filter((h) => Math.hypot(h.x - pt[0], h.y - pt[1]) < 62), A = near(m.pa), B = near(m.pb); const okp = A.length && B.length && (A.length > 1 || B.length > 1 || A[0] !== B[0]) && !(A.length === 1 && B.length === 1 && A[0] === B[0]); m.on = okp ? 1 : 0; m.pg = okp ? Math.min(100, m.pg + dt * 100 / 6) : Math.max(0, m.pg - dt * 8); m.a = Math.round(m.pg); if (m.pg >= 100) { for (const h of hs2) h.hp = Math.min(h.mx, h.hp + h.mx * 0.35); G.buffAtk = Math.max(G.buffAtk || 0, 15); return smEnd(S, true, '전원 회복 + 공격 15초 강화!'); } }
  else if (m.k === 'herb') { m.h = m.h.filter((q) => { for (const h of hs2) if (Math.hypot(h.x - q[0], h.y - q[1]) < 48) { m.a++; G.fx.push([q[0], q[1], 40, 'sum']); return false; } return true; }); if (m.a >= 4) { for (const h of hs2) h.hp = Math.min(h.mx, h.hp + h.mx * 0.6); return smEnd(S, true, '전원 체력 60% 회복!'); } }
  else if (m.k === 'rush') { m.a = Math.round(30 - m.t); if (G.order.some((id) => G.pl[id].down > 0)) { return smEnd(S, false, '쓰러진 친구가 있어서 실패'); } m.rt -= dt; if (m.rt <= 0) { m.rt = 5; const h = hs2[rint(np)], a = rnd(0, 6.283); for (let i = 0; i < 7 + np; i++) spawn(i % 4 === 0 ? 'cav' : 'grunt', hs, clampW(h.x + Math.cos(a + rnd(-0.5, 0.5)) * 640, h.y + Math.sin(a + rnd(-0.5, 0.5)) * 440)); } if (m.t <= 0) { G.lvq = (G.lvq | 0) + 1; return smEnd(S, true, '카드가 열려요!'); } return; }
  else if (m.k === 'rep') { if (hs2.some((h) => Math.hypot(h.x - G.ax, h.y - G.ay) < 170)) m.sec += dt; m.a = Math.min(8, Math.floor(m.sec)); if (m.sec >= 8) { G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.3); return smEnd(S, true, '성 체력 30% 회복!'); } }
  else if (m.k === 'fast') { m.a = Math.min(m.need, (G.kc || 0) - m.k0); if (m.a >= m.need) { G.buffAtk = Math.max(G.buffAtk || 0, 30); return smEnd(S, true, '공격력 30초 강화!'); } }
  if (m.t <= 0) smEnd(S, false, m.k === 'camp' ? '기지가 아직 남아 있어요' : '시간이 다 됐어요');
}
const WXD = { rain: ['🌧 비가 내려요!', '영웅 이동 -15% · 적은 25% 느려져요. 25초 뒤 그쳐요'], fog: ['🌫 안개가 짙어요!', '시야가 흐려지고 적이 25% 더 많이 몰려와요 (25초)'], night: ['🌙 밤이 되었어요!', '어두워지고 적이 10% 빨라져요 (25초)'] };
function wxSet(k) { G.wx = { k, end: G.t + 25 }; G.wxEm = k === 'rain' ? 0.75 : k === 'night' ? 1.1 : 1; G.wxHm = k === 'rain' ? 0.85 : 1; G.wxSp = k === 'fog' ? 1.25 : 1; smInfo(WXD[k][0], WXD[k][1]); }
function wxEnd() { G.wx = null; G.wxEm = 1; G.wxHm = 1; G.wxSp = 1; G.wxNext = G.t + rnd(70, 100); smInfo('☀ 날씨가 개었어요', '다시 맑아졌어요'); }
function evStep(dt, hs2, hs) {
  if (G.endless || G.du || G.ev || !hs2.length || G.order.some((id) => G.pl[id].offer)) return;
  if (G.wx) { if (G.t >= G.wx.end) wxEnd(); } else if (G.t >= G.wxNext && G.t < G.dur - 30 && !(G.sm && G.sm.cur && G.t - G.sm.cur.t0 < 4)) wxSet(['rain', 'fog', 'night'][rint(3)]);
  if (G.dif !== DIFF.hard) return;
  const np = hs2.length, ctr = G.castle ? [G.ax, G.ay] : [hs2.reduce((a, h) => a + h.x, 0) / np, hs2.reduce((a, h) => a + h.y, 0) / np];
  for (const e of G.en) if (e.hb != null && e.hp > 0) { e.hb -= dt; if (e.hb <= 0) { e.hb = 4; G.fx.push([e.x, e.y, 150, 'boom']); for (const h of hs2) if (Math.hypot(h.x - e.x, h.y - e.y) < 150) h.hp = Math.max(1, h.hp - h.mx * 0.12); } }
  if (G.hd2) { G.hd2.t -= dt; if (G.hd2.t <= 0) { const a = G.hd2.a; G.hd2 = null; for (let s = 0; s < 2; s++) for (let i = 0; i < 8 + 2 * np; i++) { const aa = a + s * Math.PI + rnd(-0.3, 0.3); spawn(i % 5 === 0 ? 'cav' : 'grunt', hs, clampW(ctr[0] + Math.cos(aa) * 560, ctr[1] + Math.sin(aa) * 400)); } } return; }
  G.hdT -= dt; if (G.hdT > 0 || G.t >= G.dur - 25) return; G.hdT = rnd(50, 65); const k = rint(3);
  if (k === 0) { const a = rnd(0, 6.283), e = spawn('tank', hs, clampW(ctr[0] + Math.cos(a) * 600, ctr[1] + Math.sin(a) * 420)); e.hp = e.mx = e.mx * (4 + np); e.hb = 4; for (let i = 0; i < 8; i++) spawn('grunt', hs, clampW(e.x + rnd(-90, 90), e.y + rnd(-90, 90))); smInfo('⚠ 적 장수가 난입했어요!', '큰 적이 4초마다 땅을 내리쳐 주변 영웅이 다쳐요. 멀리서 쓰러뜨리세요!'); }
  else if (k === 1) { G.hd2 = { t: 3, a: rnd(0, 6.283) }; smInfo('⚠ 양쪽에서 습격이 와요! (3초 뒤)', '둘로 갈라진 적이 양옆에서 몰려와요. 가운데로 모여요!'); }
  else { const h = hs2[rint(np)], a = rnd(0, 6.283); for (let i = 0; i < 10 + 2 * np; i++) { const e = spawn(i % 4 === 0 ? 'cav' : 'grunt', hs, clampW(h.x + Math.cos(a + rnd(-0.6, 0.6)) * 560, h.y + Math.sin(a + rnd(-0.6, 0.6)) * 400)); e.arm = 1; } smInfo('🛡 갑옷 입은 적이 몰려와요!', '평범한 공격은 거의 안 통해요! 영웅 스킬을 쓰면 6초 동안 갑옷이 깨져요'); }
}
function applyShared(q, id) { // 대표가 고른 카드: 능력·보급은 모두에게, 무기는 대표만(다른 친구는 가진 무기 +1)
  const card = CARDS.find((x) => x.id === id), nm = card ? card.n : id; let t = '';
  if (id.startsWith('evo_')) { applyCard(q, id); t = '진화는 대표 친구만!'; }
  else if (WEAP[id]) { applyCard(q, id); for (const oid of G.order) { if (oid === q.id) continue; const o = G.pl[oid], ws = Object.keys(WEAP).filter((k) => POOL[k] && (o.cards[k] || 0) > 0 && o.cards[k] < 5); if (ws.length) applyCard(o, ws[rint(ws.length)]); } t = '친구들은 가진 무기가 한 단계 올라요'; }
  else if (ABIL[id]) { applyCard(q, id); const an = (o) => Object.keys(ABIL).filter((k) => o.cards[k]).length; for (const oid of G.order) { if (oid === q.id) continue; const o = G.pl[oid], L = o.cards[id] || 0; if (L < 5 && (L > 0 || an(o) < AMAX)) applyCard(o, id); } t = '모두에게 적용!'; }
  else { applyCard(q, id); t = '모두에게 적용!'; }
  G.info = { id: Date.now() + Math.random(), tt: '🃏 ' + q.name + ' 친구가 「' + nm + '」 선택!', tx: t };
  for (const oid of G.order) { const o = G.pl[oid]; o.offer = null; o.qz = null; } G.chs = {};
}
function resolveQuiz(ok) {
  for (const id of G.order) { const q = G.pl[id]; if (q.offer && q.qz && q.qs === 0) { q.qs = ok ? 1 : 2; q.offer = q.offer.slice(0, ok ? 4 : 2); q.offT = Math.min(q.offT, 16) + (ok ? 0 : 7); q.qrd = ok ? 0 : 7; } }
  const qr = G.pl[G.qzr]; if (qr && !ok) { qr.qstk = 0; qr.qrw = ''; }
}
function offerCards(p) {
  const c = p.cards, wn = Object.keys(WEAP).filter((k) => c[k]).length, an = Object.keys(ABIL).filter((k) => c[k]).length;
  const ok = (id) => POOL[id] && (c[id] || 0) < 5 && !(WEAP[id] && !c[id] && wn >= WMAX) && !(ABIL[id] && !c[id] && an >= AMAX);
  const wt = {}; for (const cd of CARDS) if (ok(cd.id)) wt[cd.id] = c[cd.id] ? 1.2 : 1;
  for (const y of SYN) { if (c[y.a] && wt[y.b]) wt[y.b] += 2; if (c[y.b] && wt[y.a]) wt[y.a] += 2; } // 짝이 되는 카드가 더 자주 나와요
  const o = [];
  while (o.length < 4 && Object.keys(wt).length) { const ks = Object.keys(wt); let tot = 0; for (const k of ks) tot += wt[k]; let x = Math.random() * tot, pick = ks[0]; for (const k of ks) { x -= wt[k]; if (x <= 0) { pick = k; break; } } o.push(pick); delete wt[pick]; }
  // 더 올릴 카드가 없으면 회복·보급 같은 선택지로 채워요 (게임이 멈추지 않게)
  const fb = ['heal', 'rage', G.obj !== 'e' ? 'food' : null, G.obj !== 'e' ? 'volun' : null, G.castle ? 'wall' : null].filter(Boolean); while (o.length < 4 && fb.length) o.push(fb.splice(rint(fb.length), 1)[0]);
  p.offer = o; p.offT = 14; }
function applyEvent(k) {
  if (k === 'camp') for (const q of G.order) { const h = G.pl[q]; h.hp = Math.min(h.mx, h.hp + h.mx * 0.35); }
  if (k === 'wall') G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.25);
  if (k === 'atk') G.buffAtk = 30;
  if (k === 'food') G.food += 80;
  if (k === 'volun') { doSummon(true); doSummon(true); doSummon(true); }
  if (k === 'slow') G.slowT = 25;
  if (k === 'raid') for (const e of G.en) if (Math.random() < 0.6) { e.hp -= 90; G.fx.push([e.x, e.y, 20, 'hit']); }
}
function spawn(type, hs, pos) {
  const kind = type, T = ET[kind]; if (type === 'cannon') type = 'shoot'; const np = G.order.length, CO = G.co || COOP[0], sc = hs * (type === 'boss' ? (1 + 0.7 * (np - 1)) : CO.h);
  const el = type !== 'boss' && type !== 'camp' && (G.endless || G.t >= 30) && Math.random() < (G.co ? G.co.el : 0) + Math.min(G.dif === DIFF.hard ? 0.42 : G.dif === DIFF.easy ? 0.14 : 0.3, 0.015 + 0.004 * G.sc + (G.dif === DIFF.hard ? 0.26 : G.dif === DIFF.easy ? 0.06 : 0.16) * progOf() + 0.12 * lvScale()), hm = el ? 2.8 : 1;
  const e = { el: el ? 1 : 0, id: G.nid++, t: type, hp: T.hp * sc * hm, mx: T.hp * sc * hm, sp: T.sp * 1.2 * rnd(0.9, 1.1) * (G.sig === 'mount' ? 0.9 : 1), st: 0, x: pos[0], y: pos[1], ef: 0, ox: rnd(-34, 34), oy: rnd(-26, 26), ro: rnd(0, 36), gt: rnd(2, 5) };
  if (type === 'shoot') { const gf = CH[R[G.rd].ch].foe === '왜군'; e.rg = gf ? 380 : 260; e.pk = gf ? 'gun' : 'bow'; e.gt = rnd(1, 3); if (kind === 'cannon') { e.pk = 'cannon'; e.rg = 430; e.gt = rnd(2, 4); } }
  G.en.push(e); return e;
}
function clampW(x, y, m) { m = m || 30; return [Math.max(m, Math.min(G.ww - m, x)), Math.max(m, Math.min(G.wh - m, y))]; }
function aliveHeroes() { return G.order.map((id) => G.pl[id]).filter((p) => !(p.down > 0)); }
function progOf() { return G.endless ? (G.t % 60) / 60 : G.t / G.dur; }
const BOSS_EXTRA = [['도요토미 히데요시', '일본을 통일하고 조선 침략을 명령한 최고 지도자']];
function bossList(ch) { const seen = {}, out = []; BOSSN.forEach((b, i) => { if (b && (ch === undefined || R[i].ch === ch) && !seen[b[0]]) { seen[b[0]] = 1; out.push(b); } }); return out; }
function spawnBoss(hs, scale, fixed) { // 적장 등장: 장수 풀에서 번갈아 나와요
  const q = spawnPos() || [G.ax + 500, G.ay]; let nm;
  if (fixed) nm = fixed; else { const pool = G.endless ? bossList() : bossList(R[G.rd].ch); G.bpi = (G.bpi | 0) + 1; nm = pool[(G.bpi + (G.bpi0 | 0)) % pool.length]; }
  const e = spawn('boss', hs * scale * G.dif.bb, q); e.bn = nm; e.bi = G.bpi | 0; e.bk = rnd(3, 5); G.bn = nm; G.fx.push([q[0], q[1], 60, 'boss']); if (!G.endless && !fixed && G.ph === 'battle' && !G.du) beginDuel(e); return e; }


// ===== 영웅 스킬: 영웅마다 다른 액티브 스킬 (역사적 사실이 아니라 게임 규칙이에요) =====
const SKILL = {
  archer:  { n: '화살비',   cd: 14, d: '가까운 적 10마리에게 화살을 쏟아부어요' },
  militia: { n: '함성',     cd: 15, d: '주변 적에게 피해를 주고 잠깐 멈춰 세워요' },
  monk:    { n: '호국염불', cd: 18, d: '주변 동료를 회복시키고 적을 느리게 해요' },
  gunner:  { n: '집중포화', cd: 16, d: '가까운 적 무리에 큰 폭발을 일으켜요' },
  gwonyul: { n: '행주 돌비', cd: 16, d: '하늘에서 돌이 쏟아져 주변 적에게 피해를 주고 느리게 해요' },
  admiral: { n: '학익진',   cd: 18, d: '학의 날개처럼 넓게 펼친 파도로 적에게 피해를 주고 느리게 해요' },
  gwakjaeu: { n: '홍의 분신', cd: 17, d: '붉은 옷 분신이 나타나 주변 적을 헷갈리게 해 2초 멈춰 세우고, 나는 5초 동안 더 빨라져요' },
  hyujeong: { n: '격문', cd: 20, d: '나라를 지키자는 글로 동료를 북돋아 체력을 회복시키고 6초 동안 공격력을 올려요' },
  yujeong: { n: '호국 결계', cd: 22, d: '6초 동안 사라지지 않는 결계를 펼쳐 안의 적을 느리게 하고 계속 다치게 해요' },
  jinrin: { n: '명군 지원 포격', cd: 22, d: '명나라 수군의 대포가 여러 곳에 포탄을 떨어뜨려요' },
  gimsimin: { n: '진주성 철벽', cd: 20, d: '성 체력을 회복하고, 주변 동료에게 5초간 방패막을 쳐요. 가까운 적은 밀려나요' }
};
function cmText() {
  const mm = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  if (V.cmm === 'c') return V.cmn > 0 ? `🏕 보급기지 ${V.cmn}/2 · ⏱ ${mm(V.cdl)} 안에 부숴요!` : '🏕 보급기지 모두 격파! 성을 지켜요';
  if (V.cmm === 'b') return V.cgd ? '🔥 봉화가 올랐어요! 응원군이 달려왔어요' : `🔥 봉화 ${V.cg}% · 두 발판에 한 명씩 서야 차올라요`;
  if (V.cmm === 'r') return V.cmn > 0 ? `⚡ 속전속결 · 기지 ${V.cmn}곳 · ⏱ ${mm(V.cdl)}` : '';
  return '';
}
function beaconStep(dt) {
  const FT = CLV[G.cl || 2].ft, hs_ = G.order.map((id) => G.pl[id]).filter((p) => p.hp > 0 && !(p.down > 0) && !p.away);
  const occ = G.cmPl.map(([x, y]) => hs_.filter((p) => Math.hypot(p.x - x, p.y - y) < 90).length); G.cmOc = occ.map((n) => (n > 0 ? 1 : 0));
  if (occ[0] > 0 && occ[1] > 0) G.cmG = Math.min(100, G.cmG + dt * 100 / FT); else if ((G.cl || 2) >= 2) G.cmG = Math.max(0, G.cmG - dt * 3);
  if (G.cmG >= 100) { G.cmD = true; for (const id of G.order) { const h = G.pl[id]; h.hp = Math.min(h.mx, h.hp + h.mx * 0.35); G.fx.push([h.x, h.y, 50, 'lvl']); } G.food += 120; for (const e of G.en) if (e.t !== 'boss' && e.t !== 'camp') dmgEnemy(e, 220 + 10 * G.sc); for (const q of G.cmPl) G.fx.push([q[0], q[1], 160, 'boom']); G.info = { id: Date.now() + Math.random(), tt: '🔥 봉화가 올랐어요!', tx: '응원군이 달려와 적을 쓸어내고, 모두 체력 35% 회복 · 군량 +120' }; }
}
function castCr(p) {
  const D = CRD[p.cr]; p.cc = D.cd; const d2 = (e, x, y) => Math.hypot(e.x - x, e.y - y);
  if (p.cr === 'guard') { G.bInv = Math.max(G.bInv, 4); G.bInvHp = G.baseHp; G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.08); for (const e of G.en) if (e.t !== 'camp' && e.t !== 'boss' && d2(e, p.x, p.y) < 240) { const a = Math.atan2(e.y - p.y, e.x - p.x), q = clampW(e.x + Math.cos(a) * 90, e.y + Math.sin(a) * 90); e.x = q[0]; e.y = q[1]; e.slw = Math.max(e.slw || 0, G.t + 2); } G.fx.push([p.x, p.y, 240, 'roar']); G.fx.push([G.ax, G.ay, 120, 'lvl']); }
  else if (p.cr === 'ranger') { for (const e of G.en) { if (d2(e, p.x, p.y) >= 380) continue; if (e.t === 'camp') { e.hp -= e.mx * 0.2; G.fx.push([e.x, e.y, 70, 'boom']); } else if (e.t === 'boss') dmgEnemy(e, 40 + 8 * G.sc); else { dmgEnemy(e, 90 + 12 * G.sc); G.fx.push([e.x, e.y - 14, 30, 'hit']); } } G.fx.push([p.x, p.y, 380, 'boom']); }
  else if (p.cr === 'supply') { for (const q of G.order) { const h = G.pl[q]; if (h.away) continue; if (h.down > 0 && h.down < 1e8) { h.down = 0; h.hp = h.mx * 0.4; } h.hp = Math.min(h.mx, h.hp + h.mx * 0.3); G.fx.push([h.x, h.y, 50, 'lvl']); } G.food += 30; G.fx.push([p.x, p.y, 160, 'lvl']); }
}
function castSkill(p) {
  G.skUntil = G.t + 6;
  const k = SKILL[p.role] ? p.role : 'militia', S = SKILL[k], dm = (a) => a + 8 * G.sc, d2 = (e, x, y) => Math.hypot(e.x - x, e.y - y), near = (x, y, r) => G.en.filter((e) => d2(e, x, y) < r);
  p.cd = S.cd * (1 - 0.04 * pasLv(p, 'cd'));
  if (k === 'archer') { const t = near(p.x, p.y, 330).sort((a, b) => d2(a, p.x, p.y) - d2(b, p.x, p.y)).slice(0, 10); for (const e of t) { dmgEnemy(e, dm(55)); G.fx.push([e.x, e.y - 14, 26, 'hit']); } G.fx.push([p.x, p.y, 60, 'puff']); }
  else if (k === 'monk') { for (const q of G.order) { const h = G.pl[q]; if (h.hp > 0 && Math.hypot(h.x - p.x, h.y - p.y) < 260) { h.hp = Math.min(h.mx, h.hp + h.mx * 0.35); G.fx.push([h.x, h.y, 50, 'lvl']); } } for (const e of near(p.x, p.y, 220)) e.slw = G.t + 4; G.fx.push([p.x, p.y, 220, 'roar']); }
  else if (k === 'gunner') { const t = near(p.x, p.y, 420).sort((a, b) => d2(a, p.x, p.y) - d2(b, p.x, p.y))[0], tx = t ? t.x : p.x + 140, ty = t ? t.y : p.y; for (const e of near(tx, ty, 120)) dmgEnemy(e, dm(130)); G.fx.push([tx, ty, 120, 'boom']); }
  else if (k === 'gwonyul') { for (const e of near(p.x, p.y, 320).slice(0, 16)) { dmgEnemy(e, dm(60)); e.slw = Math.max(e.slw || 0, G.t + 3); G.fx.push([e.x, e.y - 14, 26, 'hit']); } G.fx.push([p.x, p.y, 320, 'gw']); }
  else if (k === 'admiral') { for (const e of near(p.x, p.y, 300)) { dmgEnemy(e, dm(50)); e.slw = G.t + 5; } G.fx.push([p.x, p.y, 300, 'hk']); }
  else if (k === 'gwakjaeu') { for (const e of near(p.x, p.y, 340)) { if (e.t === 'camp') continue; if (e.t === 'boss') e.slw = Math.max(e.slw || 0, G.t + 3); else { e.st = 2.2; dmgEnemy(e, dm(35)); } G.fx.push([e.x, e.y - 14, 26, 'hit']); } p.spT = 5; G.fx.push([p.x, p.y, 340, 'hg']); }
  else if (k === 'hyujeong') { for (const q of G.order) { const h = G.pl[q]; if (h.hp > 0 && !h.away && Math.hypot(h.x - p.x, h.y - p.y) < 420) { h.hp = Math.min(h.mx, h.hp + h.mx * 0.15); h.bfT = 6; G.fx.push([h.x, h.y, 50, 'lvl']); } } G.fx.push([p.x, p.y, 420, 'hj']); }
  else if (k === 'yujeong') { p.zT = 6; p.zx = p.x; p.zy = p.y; p.zk = 0; for (const e of near(p.x, p.y, 210)) e.slw = Math.max(e.slw || 0, G.t + 3); G.fx.push([p.x, p.y, 210, 'yj']); }
  else if (k === 'jinrin') { const t = near(p.x, p.y, 460).sort(() => Math.random() - 0.5).slice(0, 8); for (const e of t) { for (const e2 of near(e.x, e.y, 90)) dmgEnemy(e2, dm(60)); G.fx.push([e.x, e.y, 90, 'boom']); } G.fx.push([p.x, p.y, 460, 'jr']); }
  else if (k === 'gimsimin') { if (G.castle) { G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.12); G.fx.push([G.ax, G.ay, 110, 'lvl']); } for (const q of G.order) { const h = G.pl[q]; if (h.hp > 0 && !h.away && Math.hypot(h.x - p.x, h.y - p.y) < 260) { h.sdT = 5; G.fx.push([h.x, h.y, 50, 'lvl']); } } for (const e of near(p.x, p.y, 170)) { if (e.t === 'camp' || e.t === 'boss') continue; const a = Math.atan2(e.y - p.y, e.x - p.x), q2 = clampW(e.x + Math.cos(a) * 70, e.y + Math.sin(a) * 70); e.x = q2[0]; e.y = q2[1]; e.slw = Math.max(e.slw || 0, G.t + 2); } G.fx.push([p.x, p.y, 260, 'ks']); }
  else { for (const e of near(p.x, p.y, 125)) { dmgEnemy(e, dm(70)); e.st = 1.6; } G.fx.push([p.x, p.y, 125, 'roar']); }
}
// ===== 적장 일기토: 제한된 원형 무대에서 장수와 겨뤄요 (피하고 · 공격) =====
const bnm = (e) => (Array.isArray(e.bn) ? e.bn[0] : e.bn) || '적장';
// ===== 적장 스타일: 일기토 패턴 (장수의 실제 전투 방식이 아니라 게임용 설정이에요) =====
const STY = {
  charge: { n: '돌격형', h: '빠르게 달려들어요! 붉은 돌진선에서 비켜요', w: { dash: 4, ring: 1, fan: 1, slam: 1 }, rw: 'food', rt: '군량 +80' },
  barrage: { n: '포격형', h: '탄이 부채꼴로 날아와요! 사이로 피해요', w: { dash: 1, ring: 1, fan: 4, slam: 1 }, rw: 'volun', rt: '병사 3명 합류' },
  smash: { n: '파쇄형', h: '붉은 원이 연달아 내리쳐요! 원 밖으로 나가요', w: { dash: 1, ring: 1, fan: 1, slam: 4 }, rw: 'atk', rt: '30초간 모두 공격력 +40%' },
  ward: { n: '결계형', h: '몸 주변이 크게 터져요! 멀리 떨어져요', w: { dash: 1, ring: 4, fan: 1, slam: 1 }, rw: 'camp', rt: '영웅 체력 +35%' },
  lord: { n: '지휘형', h: '여러 공격을 섞어 써요! 침착하게 피해요', w: { dash: 2, ring: 2, fan: 2, slam: 2 }, rw: 'camp', rt: '영웅 체력 +35%' }
};
const STYOF = { '고니시 유키나가': 'charge', '시마즈 요시히로': 'charge', '아민': 'charge', '도도 다카토라': 'barrage', '와키자카 야스하루': 'barrage', '구루시마 미치후사': 'barrage', '가토 기요마사': 'smash', '용골대': 'smash', '안코쿠지 에케이': 'ward', '호소카와 다다오키': 'ward', '마푸타': 'ward', '우키타 히데이에': 'lord', '구로다 나가마사': 'lord', '홍타이지': 'lord' };
const styOf = (b) => STY[STYOF[bnm(b)] || 'lord'], styK = (b) => STYOF[bnm(b)] || 'lord';
function beginDuel(e) {
  const all = G.order.map((id) => G.pl[id]); let sx = 0, sy = 0; for (const p of all) { sx += p.x; sy += p.y; } sx /= all.length; sy /= all.length;
  const R0 = 320, cx = Math.max(R0 + 30, Math.min(G.ww - R0 - 30, sx)), cy = Math.max(R0 + 30, Math.min(G.wh - R0 - 30, sy));
  const D = G.du = { b: e, ph: 'warn', tm: 2.8, cx, cy, R: R0, saved: all.map((p) => [p.id, p.x, p.y]), enSaved: G.en.filter((x) => x !== e), tl: [], pj: [], at: 1.4, last: '', dash: null };
  G.en = []; e.x = cx + R0 * 0.5; e.y = cy; e.st = 0; e.ef = 0;
  { // 영웅이 강할수록 적장도 단단해져요 (약한 영웅일 때는 그대로, 강할 때만 늘어요)
    let dps = 0; for (const p of all) { const S = heroStats(p); let wl = 0; for (const k in WEAP) wl += p.cards[k] || 0; const rg = Math.min(360, Math.max(S.rg, 110)); dps += 26 * (1 + 0.2 * wl) * S.dmg * (rg < 200 ? 1.35 : 1) * S.as / 0.55; }
    const T = G.dif === DIFF.hard ? 40 : G.dif === DIFF.easy ? 20 : 28, ratio = Math.max(1, Math.min(5, dps * T / e.mx)), fr = e.hp / e.mx; e.mx *= ratio; e.hp = e.mx * fr; D.pw = Math.round(dps); D.ratio = +ratio.toFixed(2); }
  { let sm = 0; for (const p of all) sm += p.mx; D.hk = Math.max(1, sm / all.length / 138); } // 영웅 체력이 늘수록 적장 한 방도 세져요 (그냥 맞으면서 싸우는 방법을 막아요)
  all.forEach((p, i) => { const a = Math.PI + (i - (all.length - 1) / 2) * 0.55; p.x = cx + Math.cos(a) * R0 * 0.55; p.y = cy + Math.sin(a) * R0 * 0.45; p.mvx = p.mvy = 0; if (p.down > 0) { p.down = 0; p.hp = p.mx * 0.4; } p.fz = 3; p.dcd = 0.6; });
  G.info = { id: Date.now() + Math.random(), tt: '⚔ 일기토! ' + bnm(e) + '의 도전', tx: styOf(e).n + ' — ' + styOf(e).h + ' (스킬 버튼 = 구르기)' };
}
function endDuel(win) {
  if (win) G.duWins = (G.duWins | 0) + 1;
  const D = G.du, b = D.b; G.du = null;
  for (const [id, x, y] of D.saved) { const p = G.pl[id]; p.x = x; p.y = y; p.mvx = p.mvy = 0; if (win) { if (p.hp <= 0) p.hp = p.mx * 0.4; p.hp = Math.min(p.mx, p.hp + p.mx * 0.35); } else p.hp = p.mx * 0.5; p.down = 0; p.fz = 3; }
  G.en = D.enSaved;
  if (win) { b.hp = 0; G.fx.push([D.cx, D.cy, 120, 'boom']); enemyDeath(b); G.food += 60; gainXp(8 + G.sc * 0.4); { const ST = styOf(b); applyEvent(ST.rw); G.stRw = ST.n + ' 보상: ' + ST.rt; } G.info = { id: Date.now() + Math.random(), tt: '🏆 일기토 승리!', tx: bnm(b) + ' 격파! 영웅들의 체력이 회복돼요 · ' + G.stRw }; }
  else { b.dueled = true; b.bk = 3; const q = spawnPos() || [G.ax + 500, G.ay]; b.x = q[0]; b.y = q[1]; G.en.push(b); let pt; if (G.castle && Math.random() < 0.5) { G.baseHp = Math.max(1, Math.min(G.baseHp, G.baseMax * 0.12)); G.fx.push([G.ax, G.ay, 120, 'boom']); pt = '적장이 성에 심각한 타격을 입혔습니다! 성이 무너지기 직전이에요 (성 수리!)'; } else { waveAround(26, 620); pt = '적장이 병력을 휘몰아칩니다! 대규모 웨이브가 몰려와요!'; } G.info = { id: Date.now() + Math.random(), tt: '😤 일기토에서 승리하지 못했습니다…', tx: pt }; }
}
// 보스전(결투) 무기표: [사거리, 쿨다운, 레벨당 단축, 최소 쿨다운, 기본 피해, 레벨당 피해, 모양]
const DW = { bow: [260, 0.85, 0.08, 0.45, 20, 9, 'archer'], nu: [280, 1.3, 0.12, 0.7, 16, 8, 'bow'], cannon: [380, 2.0, 0.2, 1.0, 40, 18, 'cannon'], musket: [360, 0.9, 0.08, 0.45, 26, 12, 'gun'], rocket: [400, 2.2, 0.25, 1.2, 34, 14, 'hwa'], stone: [270, 0.9, 0.1, 0.45, 18, 9, 'stone'], turtle: [360, 1.8, 0.2, 0.9, 32, 13, 'cannon'], hwacha: [300, 3.0, 0.4, 1.5, 60, 25, 'hwa'], spear: [190, 1.0, 0.1, 0.5, 20, 9, 'thrust'], sword: [175, 0.9, 0.1, 0.45, 22, 10, 'thrust'], flail: [160, 0.6, 0, 0.6, 16, 8, 'thrust'], bomb: [340, 2.4, 0.3, 1.2, 60, 28, 'cannon'], buddha: [190, 0.6, 0, 0.6, 6, 4, 'bow'] };
function duelStep(dt) {
  const D = G.du, b = D.b, dmk = G.dif.dm * (1 + 0.02 * G.sc) * 0.75 * (D.hk || 1), alive = () => G.order.map((id) => G.pl[id]).filter((p) => p.hp > 0);
  const inArena = (o, r) => { const dx = o.x - D.cx, dy = o.y - D.cy, d = Math.hypot(dx, dy), m = D.R - r; if (d > m) { o.x = D.cx + dx / d * m; o.y = D.cy + dy / d * m; } };
  for (const id of G.order) { const p = G.pl[id]; if (p.fz > 0) p.fz -= dt; if (p.cd > 0) p.cd -= dt; if (p.cc > 0) p.cc -= dt; if (p.sdT > 0) p.sdT -= dt; if (p.spT > 0) p.spT -= dt; if (p.bfT > 0) p.bfT -= dt; if (p.zT > 0) { p.zT -= dt; p.zk -= dt; if (p.zk <= 0) { p.zk = 0.5; for (const e of G.en) if (e.t !== 'camp' && Math.hypot(e.x - p.zx, e.y - p.zy) < 210) { e.slw = Math.max(e.slw || 0, G.t + 1); dmgEnemy(e, 8 + 2 * G.sc); } } } if (p.hp <= 0) { p.hp = 0; continue; } const S = heroStats(p); p.x += p.mvx * S.sp * dt; p.y += p.mvy * S.sp * (G.wxHm || 1) * dt; inArena(p, 16); if (S.reg > 0) p.hp = Math.min(p.mx, p.hp + p.mx * S.reg * dt); }
  D.tm -= dt; if (b.ef > 0) b.ef -= dt;
  if (D.ph === 'warn') { if (D.tm <= 0) { D.ph = 'fight'; D.tm = 100; D.at = 1.0; } return; }
  if (b.hp <= 0) { endDuel(true); return; } const hs = alive(); if (!hs.length || D.tm <= 0) { endDuel(false); return; }
  // 영웅 공격 (카드가 많을수록 세져요)
  for (const p of hs) { const S = heroStats(p), dd = Math.hypot(b.x - p.x, b.y - p.y); let any = false;
    for (const k in DW) { const L = p.cards[k]; if (!L) continue; any = true; const w = DW[k], key = 'd_' + k; p[key] = (p[key] || 0) - dt * S.as; if (p[key] > 0) continue; if (dd > w[0] + 30) { p[key] = 0; continue; }
      const ev = p.cards['evo_' + k] ? 1.3 : 1; p[key] = Math.max(w[3], w[1] - w[2] * L); dmgEnemy(b, (w[4] + w[5] * L) * S.dmg * ev * 1.4); G.shots.push([p.x, p.y - 20, b.x, b.y - 20, L >= 5 ? 2 : L >= 3 ? 1 : 0, w[6]]); if (k === 'buddha' || k === 'sword' || k === 'flail') G.fx.push([b.x, b.y - 14, 26, 'hit']); if (k === 'cannon' || k === 'bomb' || k === 'turtle') G.fx.push([b.x, b.y, 50, 'boom']); if (k === 'buddha') for (const h of hs) if (Math.hypot(h.x - p.x, h.y - p.y) < 170) h.hp = Math.min(h.mx, h.hp + h.mx * 0.006); }
    if (!any) { p.dcd = (p.dcd || 0) - dt; if (p.dcd <= 0 && dd <= 190) { p.dcd = 0.7 / S.as; dmgEnemy(b, 26 * S.dmg); G.shots.push([p.x, p.y - 20, b.x, b.y - 20, 0, 'archer']); } }
    while (G.shots.length > 60) G.shots.shift(); }
  // 장수 행동
  const enr = b.hp / b.mx < 0.35, near = hs.slice().sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y))[0];
  if (D.dash) { const k = D.dash; k.t += dt; const f = Math.min(1, k.t / k.T); b.x = k.x0 + (k.x1 - k.x0) * f; b.y = k.y0 + (k.y1 - k.y0) * f; for (const p of hs) if (!k.hit[p.id] && p.fz <= 0 && Math.hypot(p.x - b.x, p.y - b.y) < 44) { k.hit[p.id] = 1; hurt(p, 20 * dmk); G.fx.push([p.x, p.y, 30, 'hit']); } if (f >= 1) D.dash = null; }
  else {
    const dd = Math.hypot(near.x - b.x, near.y - b.y); if (dd > 110) { const v = (enr ? 64 : 50) * dt; b.x += (near.x - b.x) / dd * v; b.y += (near.y - b.y) / dd * v; inArena(b, 30); }
    D.at -= dt; if (D.at <= 0) { D.at = enr ? 1.5 : 2.3; const SW = styOf(b).w, P = ['ring', 'dash', 'fan', 'slam'].filter((x) => x !== D.last); let tw = 0; for (const x of P) tw += SW[x]; let rr0 = Math.random() * tw, k = P[0]; for (const x of P) { rr0 -= SW[x]; if (rr0 <= 0) { k = x; break; } } D.last = k;
      if (enr && D.tl.length < 6 && Math.random() < 0.4) { const sk = styK(b), ex = (o) => D.tl.push(o), cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v)); if (sk === 'charge') ex({ k: 'fan', x: b.x, y: b.y, a: Math.atan2(near.y - b.y, near.x - b.x), t: 1.6, t0: 1.6 }); else if (sk === 'barrage') { const a0 = Math.atan2(near.y - b.y, near.x - b.x); for (const o of [-0.6, 0.6]) ex({ k: 'fan', x: b.x, y: b.y, a: a0 + o, t: 1.0 + (o > 0 ? 0.25 : 0), t0: 1.25 }); } else if (sk === 'smash') { for (let i = 0; i < 3; i++) { const h = hs[rint(hs.length)]; ex({ k: 'slam', x: cl(h.x + rnd(-90, 90), D.cx - D.R + 30, D.cx + D.R - 30), y: cl(h.y + rnd(-90, 90), D.cy - D.R + 30, D.cy + D.R - 30), r: 72, t: 1.5 + i * 0.3, t0: 1.5 + i * 0.3 }); } } else if (sk === 'ward') ex({ k: 'ring', x: near.x, y: near.y, r: 110, t: 1.6, t0: 1.6 }); else { ex({ k: 'ring', x: b.x, y: b.y, r: 140, t: 1.1, t0: 1.1 }); for (let i = 0; i < 2; i++) { const h = hs[rint(hs.length)]; ex({ k: 'slam', x: h.x, y: h.y, r: 72, t: 1.6 + i * 0.3, t0: 1.6 + i * 0.3 }); } } }
      if (k === 'ring') D.tl.push({ k, x: b.x, y: b.y, r: enr ? 175 : 150, t: 1.1, t0: 1.1 });
      else if (k === 'slam') { for (let i = 0; i < 3; i++) { const h = hs[rint(hs.length)]; D.tl.push({ k, x: Math.max(D.cx - D.R + 30, Math.min(D.cx + D.R - 30, h.x + rnd(-60, 60))), y: Math.max(D.cy - D.R + 30, Math.min(D.cy + D.R - 30, h.y + rnd(-60, 60))), r: 72, t: 1.0 + i * 0.3, t0: 1.0 + i * 0.3 }); } }
      else if (k === 'dash') { const dx = near.x - b.x, dy = near.y - b.y, L = Math.hypot(dx, dy) || 1, len = Math.min(380, L + 120); let x2 = b.x + dx / L * len, y2 = b.y + dy / L * len; const o = { x: x2, y: y2 }; inArena(o, 30); D.tl.push({ k, x: b.x, y: b.y, x2: o.x, y2: o.y, t: 0.9, t0: 0.9 }); }
      else D.tl.push({ k: 'fan', x: b.x, y: b.y, a: Math.atan2(near.y - b.y, near.x - b.x), t: 0.75, t0: 0.75 }); } }
  for (let i = D.tl.length - 1; i >= 0; i--) { const t = D.tl[i]; t.t -= dt; if (t.t > 0) continue; D.tl.splice(i, 1);
    if (t.k === 'ring' || t.k === 'slam') { for (const p of hs) if (p.fz <= 0 && Math.hypot(p.x - t.x, p.y - t.y) < t.r) hurt(p, (t.k === 'ring' ? 18 : 14) * dmk); G.fx.push([t.x, t.y, t.r, 'boom']); }
    else if (t.k === 'dash') { D.dash = { x0: b.x, y0: b.y, x1: t.x2, y1: t.y2, t: 0, T: 0.28, hit: {} }; }
    else if (t.k === 'fan') { for (let j = -3; j <= 3; j++) { const a = t.a + j * 0.2; D.pj.push({ x: t.x, y: t.y, vx: Math.cos(a) * 250, vy: Math.sin(a) * 250, life: 1.7 }); } G.fx.push([t.x, t.y, 30, 'puff']); } }
  for (let i = D.pj.length - 1; i >= 0; i--) { const q = D.pj[i]; q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt; let hit = false; for (const p of hs) if (p.fz <= 0 && Math.hypot(p.x - q.x, p.y - 8 - q.y) < 18) { hurt(p, 8 * dmk); G.fx.push([p.x, p.y - 12, 14, 'hit']); hit = true; break; } if (hit || q.life <= 0 || Math.hypot(q.x - D.cx, q.y - D.cy) > D.R + 50) D.pj.splice(i, 1); }
  for (const p of hs) if (p.fz <= 0 && Math.hypot(p.x - b.x, p.y - b.y) < 38) hurt(p, 9 * dmk * dt);
  for (const p of hs) if (p.hp <= 0) { p.hp = 0; G.fx.push([p.x, p.y, 30, 'die']); }
  if (b.hp <= 0) endDuel(true);
}
function bossAttack(e) { // 적장 특수 공격: 붉은 원이 보이고 잠시 뒤 범위 피해 (홀수 번째 장수는 병사도 불러요)
  G.pj.push({ x: e.x, y: e.y - 14, vx: 0, vy: 0, life: 1.0, dm: 30 * (G.dif.dm * (G.dmx || 1)), k: 'cannon', tx: e.x, ty: e.y, R: 150 });
  if (e.bi % 2) { const hs0 = (1 + 0.09 * G.dif.sc * G.sc) * G.dif.hp; for (let k = 0; k < 4 && G.en.length < 260; k++) spawn('grunt', hs0, clampW(e.x + rnd(-70, 70), e.y + rnd(-70, 70))); G.fx.push([e.x, e.y, 50, 'warn']); } }
function endlessRound(r) { // 무한 모드: 라운드가 바뀔 때마다 한 번
  const n = r + 1; G.sc = r; G.co = coopOf(); G.dmx = (1 + 0.03 * r) * G.co.dm * (G.cm ? CLV[G.cl || 2].dm : 1); G.er = r;
  G.nightRd = G.dif !== DIFF.easy && Math.random() < (G.dif === DIFF.hard ? 0.4 : 0.3);
  const ev = r % 5 === 4; G.evDone = [!ev, !ev]; G.waveT = Math.min(G.waveT, 6);
  const hs = (1 + 0.09 * G.dif.sc * G.sc) * G.dif.hp * (G.cm ? CLV[G.cl || 2].hp : 1); let nb = 0, tx = G.nightRd ? '🌙 이번 라운드는 야간 전투예요!' : '적이 점점 강해져요';
  if (n === 99) { const e = spawnBoss(hs, 3.2, Math.random() < 0.5 ? BOSS_EXTRA[0] : ['홍타이지', '청의 황제']); e.fin = 1; e.bk = 4; tx = '⚠ 최종 보스! ' + e.bn[0] + '을(를) 쓰러뜨리면 클리어!'; }
  else { nb = n % 10 === 0 ? 1 + Math.floor(n / 30) : (n >= 30 && n % 5 === 0) ? 1 : (n >= 60 && n % 3 === 0) ? 1 : 0; for (let k = 0; k < nb; k++) spawnBoss(hs, 0.8 + 0.01 * n); if (nb) tx = '⚔ 적장 ' + nb + '명 등장!' + (G.nightRd ? ' (야간)' : ''); }
  G.info = { id: Date.now() + Math.random(), tt: '♾ ' + n + '번째 라운드' + (n === 99 ? ' · 최종' : ''), tx };
}
function spawnPos() {
  if (G.castle) { const a = G.dirs[rint(G.dirs.length)] + rnd(-0.45, 0.45); return clampW(G.ax + Math.cos(a) * 880, G.ay + Math.sin(a) * 600, 24); }
  const hs = aliveHeroes(); if (!hs.length) return null;
  if (G.obj === 'e') { const h = hs[rint(hs.length)]; let x, y; if (Math.random() < 0.72) { x = h.x + rnd(650, 820); y = h.y + rnd(-170, 170); } else { x = h.x + rnd(-80, 620); y = h.y + (Math.random() < 0.5 ? -1 : 1) * rnd(470, 560); } return clampW(x, y, 24); }
  for (let k = 0; k < 8; k++) { const h = hs[rint(hs.length)], rr0 = Math.random(), a = G.obj === 'e' ? (rr0 < 0.72 ? rnd(-0.8, 0.8) : rr0 < 0.85 ? Math.PI + rnd(-0.6, 0.6) : (Math.random() < 0.5 ? -1.5 : 1.5) + rnd(-0.4, 0.4)) : rnd(0, 6.283), q = clampW(h.x + Math.cos(a) * 780, h.y + Math.sin(a) * 520, 24); if (hs.every((p) => Math.hypot(p.x - q[0], p.y - q[1]) > 620)) return q; }
  return null;
}
// 레벨이 오를수록(0~1) 강한 적이 더 많이 나와요. 레벨 3까지는 영향 없음
function lvScale() { const l = Math.max(0, (G.lvC || 0) - 3); return Math.min(1, l / 9) * (G.dif === DIFF.easy ? 0.5 : 1); }
function pickType(rd) { // 시간이 지날수록(특히 보통·어려움) 강한 적이 더 많이 나와요
  if (!G.endless && G.t < 30) return 'grunt'; // 처음 30초는 쉬운 적만 (준비 구간)
  const prog = progOf(), k = G.dif === DIFF.hard ? 1.5 : G.dif === DIFF.easy ? 0.5 : 1, cvw = rd.cl === 'cav' ? 0.2 : 0.1;
  const sg = G.sig, lf = lvScale(), wc = prog > 0.12 || lf > 0.3 ? 0.02 + 0.14 * prog * k + 0.1 * lf * k : 0, wt = prog > 0.2 || lf > 0.3 ? 0.05 + 0.35 * prog * k + 0.3 * lf * k : 0, ws = 0.2, wg = 0.45, ws2 = ws * (sg === 'sea' ? 1.9 : 1), cvw2 = cvw * (sg === 'cav' ? 2.5 : 1), r = Math.random() * (wg + ws2 + cvw2 + wc + wt);
  return r < wc ? 'cannon' : r < wc + wt ? 'tank' : r < wc + wt + ws2 ? 'shoot' : r < wc + wt + ws2 + cvw2 ? 'cav' : 'grunt'; }
function gainXp(v) {
  G.xp += v * xpMul() * (!G.endless && (G.lvC || 0) < 3 ? 1.5 : 1); while (G.xp >= G.need) { G.xp -= G.need; G.lvC = (G.lvC || 0) + 1; if ([6, 9, 12].includes(G.lvC) && !G.endless) G.info = { id: Date.now() + Math.random(), tt: '📈 적이 강해지고 있어요!', tx: '레벨이 오르면 강한 적이 더 자주 나와요. 방어를 단단히!' }; G.need = G.lvC <= 3 ? [6, 9, 12][G.lvC - 1] : Math.round(G.need * 1.28 + 3); for (const id of G.order) { const p = G.pl[id]; p.lv++; G.fx.push([p.x, p.y, 60, 'lvl']); if (p.lvfx) G.fx.push([p.x, p.y, 60, 'lf_' + p.lvfx, p.id]); } G.lvq = (G.lvq | 0) + 1; }
}
function nearestHero(x, y, rg) { let b = null, bd = rg * rg; for (const p of aliveHeroes()) { const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; b = p; } } return b; }
function enemyDeath(e) {
  if (G.es) G.es.k++; if (!e.sm) G.kc = (G.kc || 0) + 1;
  const T = ET[e.pk === 'cannon' ? 'cannon' : e.t]; if (e.t === 'boss') { G.bossDead = true; if (e.fin) G.finalDead = true; else if (G.ph === 'battle') G.evoQ = (G.evoQ | 0) + 1; } if (e.t === 'camp') G.fx.push([e.x, e.y, 60, 'boom']); if (G.obj !== 'e') G.food += Math.round(T.f * 0.35 * G.foodMul * (1 + 0.04 * pasMax('fd')) * (e.t === 'boss' ? 3 : 1)) + (Math.random() < 0.3 ? 1 : 0); G.souls.push({ x: e.x + rnd(-8, 8), y: e.y + rnd(-8, 8), v: T.xp * (e.el ? 5 : 1) }); if (G.souls.length > 300) gainXp(G.souls.shift().v); if (e.el && Math.random() < 0.4 && G.crates.length < 5) G.crates.push({ x: e.x, y: e.y, k: Math.random() < 0.3 ? 'gmc' : 'chest' });
  G.fx.push([e.x, e.y, T.r + 6, 'die', e.t]);
}
function dmgEnemy(e, d) { if (e.arm && !(G.t < (G.skUntil || 0))) d *= 0.15; if (CRIT > 0 && Math.random() < CRIT) d *= 2; if (e.t === 'boss') d = Math.max(d * 0.55, d - 8); /* 적장은 갑옷이 단단해요 */ e.hp -= d; e.ef = 0.1; if (G.fx.length < 60) G.fx.push([e.x + rnd(-8, 8), e.y - ET[e.t].r - 4, Math.round(d), 'dmg']); }
function splash(x, y, r, d, except) { for (const o of G.en) if (o !== except && Math.hypot(o.x - x, o.y - y) <= r) dmgEnemy(o, d * 0.6); G.fx.push([x, y, r, 'boom']); }
function nearest(x, y, rg) { let b = null, bd = rg * rg; for (const e of G.en) { const dd = (e.x - x) ** 2 + (e.y - y) ** 2; if (dd < bd) { bd = dd; b = e; } } return b; }
function evTick(dt) {
  if (G.ev) { G.ev.left -= dt; const allVoted = G.order.every((id) => G.pl[id].away || G.ev.votes[id] != null); if (G.ev.left <= 0 || allVoted) { const c = [0, 0]; for (const id in G.ev.votes) c[G.ev.votes[id]]++; const w = c[0] === c[1] ? rint(2) : (c[0] > c[1] ? 0 : 1); applyEvent(G.ev.o[w].k); G.ev.done = G.ev.o[w].n; G.evShow = 3; G.evR = G.ev; G.ev = null; } }
}
function lineHit(p, ang, L, w, dm, maxN) { // 일직선 관통
  const ux = Math.cos(ang), uy = Math.sin(ang), hit = [];
  for (const e of G.en) { const rx = e.x - p.x, ry = e.y - p.y, rel = rx * ux + ry * uy, T = ET[e.t]; if (rel < -10 || rel > L + T.r) continue; if (Math.abs(-rx * uy + ry * ux) < T.r + w) hit.push([rel, e]); }
  hit.sort((a, b) => a[0] - b[0]); const h = hit.slice(0, maxN); h.forEach(([rel, e], i) => dmgEnemy(e, dm * (1 - 0.08 * i)));
  return h.length ? Math.min(L, h[h.length - 1][0] + 40) : L;
}
function randNear(p, R, n) { const a = []; for (const e of G.en) if (e.t !== 'camp' && Math.hypot(e.x - p.x, e.y - p.y) < R) a.push(e); for (let i = a.length - 1; i > 0; i--) { const j = rint(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); }
function doSlash(p, a, R, c, mul) {
  const evo = !!c.evo_sword, lv = c.sword, half = (evo || lv >= 5) ? Math.PI : 0.95 + 0.12 * lv, dm = (22 + 10 * lv) * mul * (evo ? 1.3 : 1);
  for (const e of G.en) { const rx = e.x - p.x, ry = e.y - p.y, dd = Math.hypot(rx, ry), T = ET[e.t]; if (dd > R + T.r) continue; const da = Math.abs(Math.atan2(Math.sin(Math.atan2(ry, rx) - a), Math.cos(Math.atan2(ry, rx) - a)));
    if (dd < 22 || da <= half) { dmgEnemy(e, dm); if (e.t === 'grunt' || e.t === 'shoot' || e.t === 'cav') { const q = clampW(e.x + rx / (dd || 1) * 22, e.y + ry / (dd || 1) * 22); e.x = q[0]; e.y = q[1]; } } }
  G.shots.push([p.x, p.y - 20, p.x + Math.cos(a) * R, p.y - 20 + Math.sin(a) * R, (evo || lv >= 5) ? 2 : lv >= 3 ? 1 : 0, 'slash', half, R]);
}
function flailGeo(c, t) { const evo = !!c.evo_flail, lv = c.flail; return { n: evo ? 4 : 1 + (lv >= 3 ? 1 : 0) + (lv >= 5 ? 1 : 0), R: 118 + 9 * lv + (evo ? 34 : 0), w: 3.1 + 0.18 * lv, t, evo, lv }; }
function flailPos(x, y, g, k) { const a = g.t * g.w + k * 6.283 / g.n, rad = g.R * (0.62 + 0.38 * Math.sin(g.t * 2.1 + k * 1.7)); return [x + Math.cos(a) * rad, y + Math.sin(a) * rad * 0.85, a, rad]; }
function stepBattle(dt) {
  if (G.paused) return;
  const rd = R[G.rd], np = G.order.length, prog = progOf();
  if (G.ev) { evTick(dt); return; } // 투표 중에는 게임이 멈춰요
  for (const id of G.order) { const q = G.pl[id]; if (q.qrd > 0) q.qrd -= dt; }
  { const hu = G.order.filter((id) => !G.pl[id].bot); if (hu.length === 1 && G.pl[hu[0]].offer) return; } // 혼자 할 때 카드 고르는 동안 멈춤
  if (G.du) { duelStep(dt); return; }
  G.t += dt; if (G.endless) { const r = Math.floor(G.t / 60); if (r !== G.er) endlessRound(r); } if (G.buffAtk > 0) G.buffAtk -= dt; if (G.slowT > 0) G.slowT -= dt;
  // 사건(투표)
  if (!G.ev) for (let k = 0; k < 2; k++) if (!G.evDone[k] && prog >= (k ? 0.68 : 0.35)) { G.evDone[k] = true; const E = EVENTS[(G.rd + k) % 3]; let eo = E.o.map((x) => G.obj === 'e' ? (x.k === 'food' ? { n: '주먹밥을 나눠 먹는다', d: '모든 동료 체력 30% 회복', k: 'camp' } : x.k === 'volun' ? { n: '길잡이를 따라간다', d: '30초간 모든 공격력 +40%', k: 'atk' } : x) : x); if (!G.castle && eo[0].k === 'wall') eo = [{ n: '진을 굳게 친다', d: '모든 동료 체력 35% 회복', k: 'camp' }, eo[1]]; G.ev = { t: E.t, q: E.q, o: eo, votes: {}, left: 14 }; break; }
  if (G.ev) { G.ev.left -= dt; const allVoted = G.order.every((id) => G.pl[id].away || G.ev.votes[id] != null); if (G.ev.left <= 0 || allVoted) { const c = [0, 0]; for (const id in G.ev.votes) c[G.ev.votes[id]]++; const w = c[0] === c[1] ? rint(2) : (c[0] > c[1] ? 0 : 1); applyEvent(G.ev.o[w].k); G.ev.done = G.ev.o[w].n; G.evShow = 3; G.evR = G.ev; G.ev = null; } }
  if (G.evShow > 0) { G.evShow -= dt; if (G.evShow <= 0) G.evR = null; }
  // 야간 전투 (보통·어려움)
  { const nw = G.dif === DIFF.easy ? [] : G.dif === DIFF.hard ? [[0.3, 0.46], [0.7, 0.86]] : [[0.46, 0.62]], tg = (G.endless ? (G.nightRd && prog >= 0.08 && prog < 0.92) : nw.some((w) => prog >= w[0] && prog < w[1])) ? 1 : 0; if (tg && !G.nIn) { G.nIn = true; G.fx.push([G.ax, G.ay, 10, 'night']); } if (!tg) G.nIn = false; G.nl += Math.sign(tg - G.nl) * Math.min(Math.abs(tg - G.nl), dt / 3); }
  // 스폰
  const hs = (1 + 0.09 * G.dif.sc * G.sc) * (rd.df ? 1.1 : 1) * G.dif.hp * (G.cm ? CLV[G.cl || 2].hp : 1), hs2 = aliveHeroes();
  const rate = G.dif.sp * (0.55 + 0.9 * prog + 0.018 * G.sc) * (G.co || COOP[0]).c * (rd.df ? 1.12 : 1) * (G.obj === 'r' ? 0.45 : G.obj === 'e' ? 1.25 : 1) * (G.t < (G.spSlow || 0) ? 0.55 : 1) * (G.t < (G.spFast || 0) ? 1.4 : 1) * (G.wxSp || 1);
  const pb = Math.min(0.8, G.dif.pr + 0.3), ramp = G.endless ? 1 : G.t < 30 ? pb : G.t < 100 ? pb + (1 - pb) * (G.t - 30) / 70 : 1;
  G.spawnT -= dt * ramp * rate * 1.6 * (1 + 1.5 * prog) * (1 + 0.3 * G.nl) * (G.sig === 'plain' ? 1.15 : 1); while (G.spawnT <= 0) { G.spawnT += 1; if (G.en.length >= enCap()) continue; const q = spawnPos(); if (q) spawn(pickType(rd), hs, q); }
  if (G.obj === 'e' && hs2.length) { G.ambT = (G.ambT === undefined ? 8 : G.ambT) - dt; if (G.ambT <= 0) { G.ambT = Math.max(5, 11 - 5 * prog); const h = hs2[rint(hs2.length)], ax0 = h.x + rnd(300, 440), ay0 = h.y + rnd(-190, 190), n = 4 + Math.round(prog * 5) - ((G.ambN = (G.ambN || 0) + 1) === 1 ? 2 : 0); for (let k = 0; k < n && G.en.length < enCap(); k++) spawn(k % 4 === 3 ? 'cav' : pickType(rd), hs, clampW(ax0 + rnd(-60, 60), ay0 + rnd(-60, 60))); G.fx.push([ax0, ay0, 70, 'amb']); } }
  G.waveT -= dt * (G.t < (G.spSlow || 0) ? 0.6 : 1); if (G.waveT <= 0 && G.obj !== 'e') { G.waveT = G.endless || G.t >= 120 ? 14 : 24; const q = spawnPos(); if (q) { const n = Math.round((14 + Math.floor(G.sc / 2) * 2 + Math.round(prog * 12)) * (G.endless ? 1 : Math.min(1, 0.45 + G.t / 180)) * (G.co || COOP[0]).c); G.firstRaid = false; for (let k = 0; k < n && G.en.length < enCap(); k++) spawn(pickType(rd), hs, clampW(q[0] + rnd(-110, 110), q[1] + rnd(-110, 110))); G.fx.push([q[0], q[1], 40, 'warn']); } }
  if (G.obj === 'b' && !G.bossOut && !G.endless && G.t >= Math.max(6, G.dur - 70)) { G.bossOut = true; spawnBoss(hs, 0.9); }
  else if ((G.obj === 'e' || G.obj === 'r') && !G.endless && !G.bossOut && G.t >= G.dur * 0.5) { G.bossOut = true; spawnBoss(hs, 0.8); }
  else if ((G.obj === 'd' || G.obj === 's') && !G.endless && G.bossI < (G.bossTimes || []).length && G.t >= G.bossTimes[G.bossI]) { G.bossI++; spawnBoss(hs, 0.85); }
  // 탈출 지점
  if (G.obj === 'e') { const g = G.goals[G.gi]; if (g) for (const p of hs2) if (Math.hypot(p.x - g[0], p.y - g[1]) < 85) { G.fx.push([g[0], g[1], 60, 'sum']); G.fl++; const nx = Math.min(g[0] + 800, G.ww - 60); G.goals = [[nx, roadY(nx, G.ww, G.wh)]]; for (const h of hs2) h.hp = Math.min(h.mx, h.hp + h.mx * 0.12); break; }
    if (hs2.length && escGo(hs2)) { for (const id of G.order) { const h = G.pl[id]; h.x = Math.max(60, h.x - ESHIFT); } for (const e of G.en) e.x -= ESHIFT; for (const q of G.souls) q.x -= ESHIFT; for (const c of G.crates) c.x -= ESHIFT; for (const b of G.pj) b.x -= ESHIFT; for (const gq of G.goals) gq[0] -= ESHIFT; G.sf++; } }
  if (G.obj === 'e' && hs2.length) { const lim = Math.min(...hs2.map((h) => h.x)) - 700; G.en = G.en.filter((e) => e.t === 'boss' || e.x > lim); }
  // 적 이동 / 공격
  for (const e of G.en) { const T = ET[e.t]; if (e.ef > 0) e.ef -= dt;
    if (e.cv) { e.x += e.cv[0] * dt; e.y += e.cv[1] * dt; continue; }
    if (e.t === 'camp') { e.gt -= dt; if (e.gt <= 0) { e.gt = G.cmOn ? CLV[G.cl || 2].cs : 7; for (let k = 0; k < (G.cmOn && G.rd < 6 ? 1 : 2) && G.en.length < 260; k++) spawn('grunt', hs, clampW(e.x + rnd(-50, 50), e.y + rnd(30, 70))); } continue; }
    if (e.t === 'boss') { e.bk -= dt; if (e.bk <= 0) { e.bk = e.bi % 2 ? 9 : 7; bossAttack(e); } }
    if (e.st > 0) e.st -= dt; else { let tx, ty, reach, tp = null;
      if (G.castle) { if (e.hu === undefined) e.hu = e.t !== 'shoot' && Math.random() < 0.6; let hh = null; if (e.hu) { let bd2 = 340 * 340; for (const p of hs2) { const d2 = (p.x - e.x) ** 2 + (p.y - e.y) ** 2; if (d2 < bd2) { bd2 = d2; hh = p; } } } if (hh) { tp = hh; tx = hh.x; ty = hh.y; reach = T.r + 10 + T.st * 0.8; } else { tx = G.ax + e.ox; ty = G.ay + e.oy; reach = e.t === 'shoot' ? e.rg * 0.9 : CR + 14 + T.st * 0.9 + e.ro; } }
      else { let bd = 1e9; for (const p of hs2) { const d2 = (p.x - e.x) ** 2 + (p.y - e.y) ** 2; if (d2 < bd) { bd = d2; tp = p; } } if (!tp) continue; tx = tp.x; ty = tp.y; reach = e.t === 'shoot' ? e.rg * 0.88 : T.r + 10 + T.st * 0.8; }
      const dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy) || 1;
      if (d > reach) { const v = e.sp * dt * (G.wxEm || 1) * (G.mod === 'haste' ? 1.08 : 1) * (G.slowT > 0 ? 0.6 : 1) * ((e.slw || 0) > G.t ? 0.5 : 1) * (1 + 0.18 * G.nl); e.x += dx / d * v; e.y += dy / d * v; }
      else { if (e.t === 'shoot') { e.gt -= dt; if (e.gt <= 0) { e.gt = e.pk === 'cannon' ? 4.6 : e.pk === 'gun' ? 2.6 : 1.9; let tgx, tgy; const nh = G.castle ? nearestHero(e.x, e.y, e.rg) : tp; if (G.castle && !(nh && Math.random() < 0.45)) { tgx = G.ax; tgy = G.ay - 10; } else if (nh) { tgx = nh.x; tgy = nh.y - 6; } else { tgx = G.ax; tgy = G.ay; } const dx2 = tgx - e.x, dy2 = tgy - e.y, L2 = Math.hypot(dx2, dy2) || 1, v = e.pk === 'cannon' ? 210 : e.pk === 'gun' ? 330 : 230; if (e.pk === 'cannon') G.pj.push({ x: e.x, y: e.y - 14, vx: dx2 / L2 * v, vy: dy2 / L2 * v, life: L2 / v, dm: 26 * (G.dif.dm * (G.dmx || 1)) * (e.el ? 1.3 : 1), k: 'cannon', tx: tgx, ty: tgy }); else G.pj.push({ x: e.x, y: e.y - 14, vx: dx2 / L2 * v, vy: dy2 / L2 * v, life: e.rg / v + 0.25, dm: (e.pk === 'gun' ? 14 : 9) * (G.dif.dm * (G.dmx || 1)) * (e.el ? 1.4 : 1), k: e.pk }); if (G.pj.length > 90) G.pj.shift(); G.fx.push([e.x, e.y - 12, 16, 'puff']); } } else if (G.castle && !tp) G.baseHp -= T.dm * (G.dif.dm * (G.dmx || 1)) * (e.el ? 1.4 : 1) * 0.8 * dt; else if (tp && tp.fz <= 0) hurt(tp, T.dm * (G.dif.dm * (G.dmx || 1)) * (e.el ? 1.4 : 1) * 0.6 * dt); } }
    if (G.castle) for (const p of hs2) if (p.fz <= 0 && Math.hypot(p.x - e.x, p.y - e.y) < T.r + 12) hurt(p, T.dm * (G.dif.dm * (G.dmx || 1)) * 0.6 * dt); }
  // 영웅
  if (G.chs) for (const k in G.chs) { G.chs[k][1] -= dt; if (G.chs[k][1] <= 0) delete G.chs[k]; }
  if ((G.evoQ | 0) > 0 && !G.order.some((id) => G.pl[id].offer)) { G.evoQ--; startEvoQuiz(); }
  else if (G.lvq > 0 && !G.order.some((id) => G.pl[id].offer)) { G.lvq--; startQuiz(); }
  for (const id of G.order) { const p = G.pl[id], S = heroStats(p), b = ROLE[p.role];
    if (p.fz > 0) p.fz -= dt; if (p.cd > 0) p.cd -= dt; if (p.cc > 0) p.cc -= dt; if (p.sdT > 0) p.sdT -= dt; if (p.spT > 0) p.spT -= dt; if (p.bfT > 0) p.bfT -= dt; if (p.zT > 0) { p.zT -= dt; p.zk -= dt; if (p.zk <= 0) { p.zk = 0.5; for (const e of G.en) if (e.t !== 'camp' && Math.hypot(e.x - p.zx, e.y - p.zy) < 210) { e.slw = Math.max(e.slw || 0, G.t + 1); dmgEnemy(e, 8 + 2 * G.sc); } } }
    if (p.offer && (!p.qz || id === G.qzr)) { p.offT -= dt; if (p.offT <= 0) { if (p.qz && p.qs === 0) resolveQuiz(false); else if (p.qz) applyShared(p, p.offer[rint(p.offer.length)]); else { applyCard(p, p.offer[rint(p.offer.length)]); p.offer = null; } } }
    if (p.down > 0) { p.down -= dt; if (p.down <= 0) { p.down = 0; p.hp = p.mx * (G.castle ? 0.5 : 0.6); p.fz = 3; } continue; }
    if (p.hp <= 0 && p.sa && p.sa.armor_guard === 2 && !p.rv && G.obj !== 'e') { p.rv = 1; p.hp = p.mx * 0.5; p.fz = 3; G.fx.push([p.x, p.y, 70, 'lvl']); G.info = { id: Date.now() + Math.random(), tt: '🛡 철벽 수비! ' + p.name + ' 다시 일어났어요', tx: '갑옷과 방패의 힘으로 한 번 되살아나요' }; }
    if (p.hp <= 0) { if (G.castle) p.down = 10; else if (G.lives > 0) { G.lives--; p.down = 6; } else p.down = 1e9; p.hp = 0; G.fx.push([p.x, p.y, 30, 'die']); continue; }
    if (S.reg > 0 && p.hp < p.mx) p.hp = Math.min(p.mx, p.hp + p.mx * S.reg * dt);
    let spm = 1; if (G.obj === 'e') { let nn = 0; for (const e of G.en) if (Math.abs(e.x - p.x) < 40 && Math.abs(e.y - p.y) < 40) nn++; spm = Math.max(0.4, 1 - 0.1 * nn) * 0.6; p.x += S.sp * 0.38 * spm * dt; }
    p.x = Math.max(20, Math.min(G.ww - 20, p.x + p.mvx * S.sp * spm * (G.wxHm || 1) * dt)); p.y = Math.max(30, Math.min(G.wh - 30, p.y + p.mvy * S.sp * (G.wxHm || 1) * dt)); }
  // 무기 (탕탕특공대식 성장 무기 · 영웅마다 고유 무기 1개로 시작)
  for (const id of G.order) { const p = G.pl[id]; if (p.down > 0) continue; const S = heroStats(p), c = p.cards, sy = p.sy || {}, sa = p.sa || {}, dta = dt * S.as, mulOf = (k) => S.dmg * (sy[k] ? 1.15 : 1), mul = S.dmg, ao = S.aoe, VL = (c.volley | 0) + Math.floor(pasLv(p, 'pj') / 2); CRIT = S.crit;
    const tick = (key, first) => { p[key] = (p[key] === undefined ? first : p[key]) - dta; return p[key] <= 0; };
    if (c.horse && (Math.abs(p.mvx) + Math.abs(p.mvy) > 0.1 || G.obj === 'e')) { for (const e of G.en) { if (e.t === 'camp' || (e.hh || 0) > G.t) continue; const T = ET[e.t], rx = e.x - p.x, ry = e.y - p.y, dd = Math.hypot(rx, ry); if (dd < 34 + T.r) { e.hh = G.t + 0.55; dmgEnemy(e, (5 + 3 * c.horse) * mul * (sa.horse_scout === 2 ? 2 : 1)); if (e.t === 'grunt' || e.t === 'shoot' || e.t === 'cav') { const kb = e.t === 'cav' ? 24 : 55, q = clampW(e.x + rx / (dd || 1) * kb, e.y + ry / (dd || 1) * kb); e.x = q[0]; e.y = q[1]; e.st = Math.max(e.st, 0.15); } } } }
    if (c.gong) { p.gg = (p.gg === undefined ? 3 : p.gg) - dt; if (p.gg <= 0) { p.gg = 6; G.fx.push([p.x, p.y, 80 + 18 * c.gong, 'morale']); } }
    if (c.bow) { if (tick('bw', 0.4)) { const t = nearest(p.x, p.y, 260); if (t) { p.bw = Math.max(0.42, 1.25 - 0.14 * c.bow) * (c.evo_bow ? 0.85 : 1); const na = (c.evo_bow ? 3 : 1) + VL, base = Math.atan2(t.y - p.y, t.x - p.x), dm = (15 + 8 * c.bow) * mulOf('bow') * (c.evo_bow ? 1.2 : 1), nh = 3 + (c.bow >= 3 ? 1 : 0) + (c.bow >= 5 ? 1 : 0);
        for (let k = 0; k < na; k++) { const a = base + (k - (na - 1) / 2) * 0.24, L = lineHit(p, a, 260, 9, dm, nh); G.shots.push([p.x, p.y - 20, p.x + Math.cos(a) * L, p.y - 20 + Math.sin(a) * L, 0, 'archer']); } } } }
    if (c.nu) { if (tick('nw', 0.8)) { const t = nearest(p.x, p.y, 290); if (t) { p.nw = Math.max(0.9, 2.0 - 0.2 * c.nu) * (c.evo_nu ? 0.85 : 1); const nb = 3 + Math.floor(c.nu / 2) + (c.evo_nu ? 3 : 0) + VL, base = Math.atan2(t.y - p.y, t.x - p.x), dm = (18 + 9 * c.nu) * mulOf('nu');
        for (let k = 0; k < nb; k++) { const a = base + (k - (nb - 1) / 2) * 0.17, L = lineHit(p, a, 290, 8, dm, c.nu >= 4 ? 2 : 1); G.shots.push([p.x, p.y - 20, p.x + Math.cos(a) * L, p.y - 20 + Math.sin(a) * L, 0, 'bow']); } } } }
    if (c.cannon) { if (tick('cn', 1.0)) { const nb = (c.evo_cannon ? 2 : 1) + (VL >= 2 ? 1 : 0), rad = (46 + 7 * c.cannon) * (c.evo_cannon ? 1.2 : 1) * ao, dm = (30 + 17 * c.cannon) * mulOf('cannon') * (c.evo_cannon ? 1.3 : 1); let fired = false; for (let q = 0; q < nb; q++) { let t = nearest(p.x, p.y, 380); if (q && G.en.length) { const r2 = randNear(p, 380, 1)[0]; if (r2) t = r2; } if (t) { fired = true; dmgEnemy(t, dm); splash(t.x, t.y, rad, dm, t); G.shots.push([p.x, p.y - 20, t.x, t.y, 1, 'cannon']); } } if (fired) p.cn = Math.max(0.95, 2.5 - 0.28 * c.cannon) * (c.evo_cannon ? 0.85 : 1); else p.cn = 0.2; } }
    if (c.musket) { if (tick('mk', 0.5)) { const t = nearest(p.x, p.y, 370); if (t) { p.mk = Math.max(0.3, 0.85 - 0.1 * c.musket) * (c.evo_musket ? 0.8 : 1); const dm = (25 + 14 * c.musket) * mulOf('musket') * (c.evo_musket ? 1.3 : 1); if (c.evo_musket) { const a = Math.atan2(t.y - p.y, t.x - p.x), L = lineHit(p, a, 370, 10, dm, 4); G.shots.push([p.x, p.y - 20, p.x + Math.cos(a) * L, p.y - 20 + Math.sin(a) * L, 0, 'gun']); } else { dmgEnemy(t, dm); G.shots.push([p.x, p.y - 20, t.x, t.y, 0, 'gun']); } } } }
    if (c.rocket) { if (tick('rk', 1.5)) { const ts = randNear(p, 400, Math.min(14 + 2 * VL, (3 + c.rocket) * (c.evo_rocket ? 2 : 1) + 2 * VL)); if (ts.length) { p.rk = Math.max(2.2, 4.4 - 0.5 * c.rocket) * (c.evo_rocket ? 0.75 : 1); const dm = (30 + 14 * c.rocket) * mulOf('rocket') * (c.evo_rocket ? 1.2 : 1); for (const t of ts) { dmgEnemy(t, dm); splash(t.x, t.y, (50 + (c.evo_rocket ? 20 : 0)) * ao, dm * 0.8, t); G.shots.push([p.x, p.y - 30, t.x, t.y, 1, 'hwa']); } } else p.rk = 0.3; } }
    if (c.stone) { if (tick('st', 0.4)) { const n = 1 + Math.floor(c.stone / 2) + (c.evo_stone ? 2 : 0) + VL, ts = randNear(p, 270, n); if (ts.length) { p.st = Math.max(0.45, 1.15 - 0.13 * c.stone) * (c.evo_stone ? 0.8 : 1); const dm = (16 + 9 * c.stone) * mulOf('stone'); for (const t of ts) { dmgEnemy(t, dm); if (t.t !== 'boss' && t.t !== 'camp') t.st = Math.max(t.st, c.evo_stone ? 0.7 : 0.35); if (c.evo_stone) splash(t.x, t.y, 44 * ao, dm, t); G.shots.push([p.x, p.y - 20, t.x, t.y, 0, 'stone']); } } else p.st = 0.2; } }
    if (c.turtle) { if (tick('tt', 0.8)) { const ts = randNear(p, 360, 3 + c.turtle + VL); if (ts.length) { p.tt = Math.max(0.9, 2.0 - 0.2 * c.turtle); const dm = (26 + 12 * c.turtle) * mul; for (const t of ts) { dmgEnemy(t, dm); splash(t.x, t.y, 52 * ao, dm, t); G.shots.push([p.x, p.y - 20, t.x, t.y, 1, 'cannon']); } } else p.tt = 0.3; } }
    if (c.hwacha) { if (tick('hw', 3)) { p.hw = Math.max(3, 7.5 - 0.9 * c.hwacha) * (c.evo_hwacha ? 0.65 : 1); let n = 0; const hm = c.evo_hwacha ? 2 : 1; for (const e of G.en) if (e.t !== 'camp' && n < (6 + 3 * c.hwacha) * hm + 3 * VL && Math.hypot(e.x - p.x, e.y - p.y) < 300) { dmgEnemy(e, (26 * c.hwacha + 10) * mulOf('hwacha') * (c.evo_hwacha ? 1.5 : 1)); G.shots.push([p.x, p.y - 30, e.x, e.y, 1, 'hwa']); n++; } } }
    if (c.spear) { p.sp1 = (p.sp1 === undefined ? 0.5 : p.sp1) - dta; if (p.sp1 <= 0) { const evo = !!c.evo_spear, L = 150 + 18 * c.spear + (evo ? 70 : 0), t = nearest(p.x, p.y, L + 30);
        if (t) { p.sp1 = Math.max(0.5, 1.25 - 0.14 * c.spear) * (evo ? 0.8 : 1); const nD = evo ? 5 : c.spear >= 5 ? 3 : c.spear >= 3 ? 2 : 1, base = Math.atan2(t.y - p.y, t.x - p.x), spread = evo ? 0.36 : 0.3, dm = (18 + 9 * c.spear) * mulOf('spear') * (evo ? 1.6 : 1), tier = (evo || c.spear >= 5) ? 2 : c.spear >= 3 ? 1 : 0;
          for (let k = 0; k < nD; k++) { const a = base + (k - (nD - 1) / 2) * spread, ux = Math.cos(a), uy = Math.sin(a);
            for (const e of G.en) { const rx = e.x - p.x, ry = e.y - p.y, rel = rx * ux + ry * uy, T = ET[e.t]; if (rel < -10 || rel > L + T.r) continue; if (Math.abs(-rx * uy + ry * ux) < T.r + 15) { if ((e['t' + k] || 0) > G.t) continue; e['t' + k] = G.t + 0.05; dmgEnemy(e, dm); if (evo && (e.t === 'grunt' || e.t === 'shoot')) { const q = clampW(e.x + ux * 16, e.y + uy * 16); e.x = q[0]; e.y = q[1]; } } }
            G.shots.push([p.x, p.y - 20, p.x + ux * L, p.y - 20 + uy * L, tier, 'thrust']); } } } }
    if (c.sword) { p.sw = (p.sw === undefined ? 0.8 : p.sw) - dta; if (p.sw2 > 0) { p.sw2 -= dta; if (p.sw2 <= 0) doSlash(p, p.swa + Math.PI, 108 + 12 * c.sword + (c.evo_sword ? 45 : 0), c, mulOf('sword')); }
      if (p.sw <= 0) { const R = 108 + 12 * c.sword + (c.evo_sword ? 45 : 0), t = nearest(p.x, p.y, R + 25); if (t) { p.sw = Math.max(0.75, 1.7 - 0.18 * c.sword) * (c.evo_sword ? 0.8 : 1); const a = Math.atan2(t.y - p.y, t.x - p.x); doSlash(p, a, R, c, mulOf('sword')); if (c.sword >= 4 || c.evo_sword) { p.swa = a; p.sw2 = 0.2; } } } }
    if (c.flail) { const g = flailGeo(c, G.t), dm = (16 + 8 * c.flail) * mulOf('flail') * (c.evo_flail ? 1.6 : 1); for (let k = 0; k < g.n; k++) { const bp = flailPos(p.x, p.y, g, k); for (const e of G.en) { if ((e.fh || 0) > G.t) continue; const T = ET[e.t]; if (Math.hypot(e.x - bp[0], e.y - bp[1]) < 30 + T.r * 0.8) { e.fh = G.t + 0.45; dmgEnemy(e, dm); if (e.t !== 'boss' && e.t !== 'camp') { const rx = e.x - p.x, ry = e.y - p.y, dd = Math.hypot(rx, ry) || 1, kb = e.t === 'tank' ? 14 : 48, q = clampW(e.x + rx / dd * kb, e.y + ry / dd * kb); e.x = q[0]; e.y = q[1]; } } } } }
    if (c.buddha) { p.bd = (p.bd === undefined ? 0.3 : p.bd) - dta; if (p.bd <= 0) { p.bd = 0.5; p.bdn = (p.bdn || 0) + 1; const evo = !!c.evo_buddha, R = 105 + 16 * c.buddha + (evo ? 40 : 0), dm = (3 + 3 * c.buddha) * mulOf('buddha') * (evo ? 1.25 : 1); for (const e of G.en) { if (Math.hypot(e.x - p.x, e.y - p.y) < R + ET[e.t].r) { dmgEnemy(e, dm); e.slw = G.t + 0.7; if (evo && p.bdn % 4 === 0 && e.t !== 'boss' && e.t !== 'camp') e.st = Math.max(e.st, 0.5); } }
        for (const id2 of G.order) { const h = G.pl[id2]; if (h.down <= 0 && Math.hypot(h.x - p.x, h.y - p.y) < R) h.hp = Math.min(h.mx, h.hp + h.mx * (0.004 + 0.003 * c.buddha) * (evo ? 1.8 : 1)); }
        if (p.bdn % 2 === 0) G.fx.push([p.x, p.y, R, 'dok']); } }
    if (c.bomb) { if (tick('bb', 1.5)) { p.bb = Math.max(1.6, 3.8 - 0.4 * c.bomb) * (c.evo_bomb ? 0.8 : 1); const nb = c.evo_bomb ? 2 : 1, rad = (90 + 12 * c.bomb) * (c.evo_bomb ? 1.5 : 1) * ao, bd = (50 + 28 * c.bomb) * mulOf('bomb') * (c.evo_bomb ? 1.7 : 1); for (let q = 0; q < nb; q++) { let t = nearest(p.x, p.y, 340); if (q && G.en.length) { const r2 = G.en[rint(G.en.length)]; if (Math.hypot(r2.x - p.x, r2.y - p.y) < 340) t = r2; } if (t) { G.shots.push([p.x, p.y - 20, t.x, t.y, 1, 'cannon']); splash(t.x, t.y, rad, bd, null); dmgEnemy(t, bd); G.fx.push([t.x, t.y, rad, 'boom']); } } } }
    CRIT = 0; }
  // 봉화 시험: 봉화를 밟고 원 안에서 30초 버티면 무기가 한 단계 올라요 (진화 조건이면 진화 문제도!)
  if (!G.bc && !G.bcN && G.t >= 40 && G.t < G.dur - 60 && !G.endless && hs2.length) { const h0 = hs2[0], a = rnd(0, 6.283), q = clampW(h0.x + Math.cos(a) * rnd(300, 480), h0.y + Math.sin(a) * rnd(240, 380), 160); G.bc = { x: q[0], y: q[1], st: 0, p: 0, sp: 0 }; G.bcN = 1; smInfo('🔥 봉화 시험이 열렸어요!', '지도의 주황 봉화에 가서 서면 시작해요. 원 안에서 30초 버티면 무기가 올라요'); }
  if (G.bc && G.bc.st < 2) { const b = G.bc; if (b.st === 0) { if (hs2.some((h) => Math.hypot(h.x - b.x, h.y - b.y) < 85)) { b.st = 1; smInfo('🔥 시험 시작!', '원 안에서 30초 버텨요! 적이 더 많이 와요'); } }
    else { if (hs2.some((h) => Math.hypot(h.x - b.x, h.y - b.y) < 230)) { b.p += dt; b.sp -= dt; if (b.sp <= 0) { b.sp = 1.4; const hsn = hsNow(); for (let i = 0; i < 2; i++) { const a = rnd(0, 6.283); spawn(Math.random() < 0.2 ? 'cav' : 'grunt', hsn, clampW(b.x + Math.cos(a) * 520, b.y + Math.sin(a) * 420)); } } }
      if (b.p >= 30) { b.st = 2; let n = 0; for (const id of G.order) { const h = G.pl[id], ws = Object.keys(WEAP).filter((k) => POOL[k] && (h.cards[k] || 0) > 0 && h.cards[k] < 5); if (ws.length) { applyCard(h, ws[rint(ws.length)]); n++; } G.fx.push([h.x, h.y, 90, 'lvl']); } if (G.order.some((id) => evoElig(G.pl[id]).length)) G.evoQ = (G.evoQ | 0) + 1; smInfo('🔥 봉화 시험 성공!', n ? '모두의 무기가 한 단계 올랐어요' : '보상으로 경험치를 얻었어요'); if (!n) gainXp(G.need * 0.6); } } }
  // 제단: 가까이 서서 게이지를 채우면 한 번 효과가 나와요
  for (const a of G.altars || []) { if (a.d) continue; const near = hs2.some((p) => Math.hypot(p.x - a.x, p.y - a.y) < 75); a.g = near ? Math.min(1, a.g + dt / 3.5) : Math.max(0, a.g - dt * 0.4);
    if (a.g >= 1) { a.d = 1; G.altN = (G.altN || 0) + 1; const k = rint(5); G.fx.push([a.x, a.y, 90, 'lvl']); let tt = '';
      if (k === 0) { for (const id of G.order) { const h = G.pl[id]; if (h.hp > 0) h.hp = Math.min(h.mx, h.hp + h.mx * 0.4); } tt = '모두 체력 40% 회복'; }
      else if (k === 1) { G.food += Math.round(80 * G.foodMul); tt = '군량 +80'; }
      else if (k === 2) { gainXp(G.need * 0.5); tt = '경험치 폭발'; }
      else if (k === 3) { for (const e of G.en) if (Math.hypot(e.x - a.x, e.y - a.y) < 420) { dmgEnemy(e, 160 + 14 * G.sc); G.fx.push([e.x, e.y - 10, 30, 'hit']); } G.fx.push([a.x, a.y, 260, 'boom']); tt = '주변 적에게 큰 피해'; }
      else { for (const id of G.order) { const h = G.pl[id]; h.sdT = Math.max(h.sdT || 0, 8); } tt = '8초 방패막'; }
      G.info = { id: Date.now() + Math.random(), tt: '⛩ 제단 활성화!', tx: tt }; } }
  // 보급 상자 (킹샷식 자원)
  G.crateT -= dt; if (G.crateT <= 0 && G.crates.length < 4) { G.crateT = 11; const base = G.castle ? [G.ax, G.ay] : (hs2[0] ? [hs2[0].x, hs2[0].y] : [G.ax, G.ay]), a = rnd(0, 6.283), r = rnd(220, 460), q = clampW(base[0] + Math.cos(a) * r, base[1] + Math.sin(a) * r * 0.8, 50); G.crates.push({ x: q[0], y: q[1], k: (() => { const r0 = Math.random(); return G.obj === 'e' ? (r0 < 0.4 ? 'jmk' : r0 < 0.65 ? 'chest' : 'gmc') : (r0 < 0.42 ? 'gmc' : r0 < 0.58 ? 'jmk' : r0 < 0.72 ? 'chest' : 'gmc'); })() }); }
  G.crates = G.crates.filter((c) => { for (const p of hs2) if (Math.hypot(p.x - c.x, p.y - c.y) < 46) { if (c.k === 'gmc') { const gain = Math.round((85 + rnd(0, 25)) * G.foodMul); if (G.obj === 'e') { for (const h of hs2) h.hp = Math.min(h.mx, h.hp + h.mx * 0.3); } else G.food += gain; const first = !G.gmcSeen; G.gmcSeen = true; G.info = { id: Date.now() + Math.random(), tt: G.obj === 'e' ? '📜 공명첩! 기운을 얻었어요 (체력 +30%)' : '📜 공명첩! 곡식 +' + gain, tx: first ? '공명첩은 받는 사람의 이름을 비워 둔 임명장이에요. 임진왜란 중 나라의 군량(곡식)이 모자라자, 곡식을 바친 사람이나 공을 세운 사람에게 이 문서를 주었어요. 그래서 곡식을 끌어모으는 방법이 되었답니다.' : '곡식을 바친 대가로 받던 임명장, 공명첩!' }; G.fx.push([c.x, c.y, 60, 'sum']); return false; } if (c.k === 'jmk') { G.magT = 1.6; const first = !G.jmkSeen; G.jmkSeen = true; G.info = { id: Date.now() + Math.random(), tt: '🎵 종묘제례악! 흩어진 조선의 혼이 모여들어요', tx: first ? '종묘제례악은 조선의 왕과 왕비를 모신 사당인 종묘에서 제사 때 연주하던 음악이에요. 조상을 기리는 마음으로 연주하는 음악이 흩어진 마음들을 한데 모은다는 뜻으로 담았어요.' : '소리를 따라 조선의 혼이 모여들어요!' }; G.fx.push([c.x, c.y, 80, 'sum']); return false; } if (c.k === 'chest' && !p.offer) { offerCards(p); } else G.food += Math.round((c.k === 'chest' ? 90 : 30 + rnd(0, 18)) * G.foodMul); G.fx.push([c.x, c.y, 40, 'sum']); return false; } return true; });
  // 성 화살 (성 강화)
  if (G.castle && G.upg > 0) { G.tt -= dt; if (G.tt <= 0) { G.tt = 1.3; for (let k = 0; k < 1 + (G.upg >> 1); k++) { const t = nearest(G.ax, G.ay, 330); if (t) { dmgEnemy(t, 14 + 9 * G.upg); G.shots.push([G.ax, G.ay - 50, t.x, t.y, 0, 'bow']); } } } }
  // 병사 (성이 없으면 영웅들을 따라다녀요)
  if (!G.castle && hs2.length) { let sx = 0, sy = 0; for (const p of hs2) { sx += p.x; sy += p.y; } sx /= hs2.length; sy /= hs2.length; G.ax += (sx - G.ax) * Math.min(1, dt * 2.5); G.ay += (sy - G.ay) * Math.min(1, dt * 2.5); }
  { const umul = (G.buffAtk > 0 ? 1.4 : 1) * (1 + 0.1 * Math.max(0, ...G.order.map((id) => G.pl[id].cards.gong || 0))) * (G.castle ? 1 : 1 + 0.18 * G.upg);
  G.units.forEach((u, i) => { if (!u) return; const T = UT[u.t], s0 = slotPos(i, G.ax, G.ay), melee = u.t === 'spear' || u.t === 'cav';
    if (!melee) { u.cd -= dt; if (u.cd > 0) return; const t = nearest(s0[0], s0[1], T.rg); if (!t) return;
      u.cd = 1 / T.rt; const d = T.dmg * LVM[u.lv - 1] * umul; dmgEnemy(t, d); G.shots.push([s0[0], s0[1], t.x, t.y, 2 + (u.lv > 2 ? 1 : 0), u.t]); if (T.aoe) splash(t.x, t.y, T.aoe, d, t); return; }
    // 근접 병사(창병·기마병): 거점 앞으로 나가 적을 막고 싸워요. 다치면 쓰러졌다가 잠시 뒤 다시 일어나요
    if (u.x === undefined) { u.x = s0[0]; u.y = s0[1]; }
    u.mh = (u.t === 'cav' ? 60 : 50) * (1 + 0.6 * (u.lv - 1)); if (u.hp === undefined || u.hp > u.mh) u.hp = u.mh;
    if (u.dn > 0) { u.dn -= dt; u.x = s0[0]; u.y = s0[1]; if (u.dn <= 0) { u.dn = 0; u.hp = u.mh; } return; }
    if (u.hp <= 0) { u.dn = 15; u.hp = 0; G.fx.push([u.x, u.y, 28, 'die']); return; }
    u.cd -= dt; let tg = null, bs = 1e12;
    for (const e of G.en) { if (e.t === 'camp') continue; if (Math.hypot(e.x - G.ax, e.y - G.ay) > 400) continue; const d = Math.hypot(e.x - u.x, e.y - u.y) - (e.t === 'shoot' ? 150 : 0); if (d < bs) { bs = d; tg = e; } }
    const spd = ET[u.t === 'cav' ? 'cav' : 'grunt'].sp * 1.2 * dt; // 적 보병·기병과 같은 속도
    if (tg) { const dx = tg.x - u.x, dy = tg.y - u.y, d = Math.hypot(dx, dy) || 1; if (d > 26) { const m = Math.min(spd, d - 22); u.x += dx / d * m; u.y += dy / d * m; }
      if (d < 40 && u.cd <= 0) { u.cd = 1 / T.rt; const dm = T.dmg * LVM[u.lv - 1] * umul; dmgEnemy(tg, dm); G.shots.push([u.x, u.y, tg.x, tg.y, 2 + (u.lv > 2 ? 1 : 0), u.t]);
        if (u.t === 'cav' && tg.t !== 'boss' && tg.t !== 'camp' && tg.t !== 'tank') { const q = clampW(tg.x + dx / d * 18, tg.y + dy / d * 18); tg.x = q[0]; tg.y = q[1]; } } }
    else { const dx = s0[0] - u.x, dy = s0[1] - u.y, d = Math.hypot(dx, dy); if (d > 4) { const m = Math.min(spd, d); u.x += dx / d * m; u.y += dy / d * m; } else u.hp = Math.min(u.mh, u.hp + u.mh * 0.03 * dt); }
    let nc = 0; for (const e of G.en) { if (e.t === 'camp') continue; if (Math.hypot(e.x - u.x, e.y - u.y) < ET[e.t].r + 18) { e.slw = Math.max(e.slw || 0, G.t + 0.4); if (nc++ < 3) u.hp -= ET[e.t].dm * (G.dif.dm * (G.dmx || 1)) * 1.0 * dt; } } // 닿은 적은 느려지고(저지), 병사는 조금씩 다쳐요
  }); }
  // 조선인의 혼: 떨어진 자리에 남아 있다가 가까이 가면 먹어요 (자석은 전부 빨아들여요)
  { const mg = G.magT > 0; if (mg) G.magT -= dt; for (let i = G.souls.length - 1; i >= 0; i--) { const q = G.souls[i]; let bh = null, bd = 1e12; for (const h of hs2) { const d2 = (h.x - q.x) ** 2 + (h.y - q.y) ** 2; if (d2 < bd) { bd = d2; bh = h; } } if (!bh) break; const d = Math.sqrt(bd);
      if (mg && d > 20) { const v = Math.min(d, (520 + (1.6 - G.magT) * 760) * dt); q.x += (bh.x - q.x) / d * v; q.y += (bh.y - q.y) / d * v; } if (d < (mg ? 30 : 60 + 14 * ((bh.cards && bh.cards.scout) || 0))) { G.souls.splice(i, 1); gainXp(q.v); } } }
  // 적 투사체 (조총·활): 날아오는 동안 피할 수 있어요
  for (let i = G.pj.length - 1; i >= 0; i--) { const b = G.pj[i]; b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt; let hit = false;
    if (b.k === 'cannon') { if (b.life <= 0) { const BR = b.R || 80; for (const h of hs2) if (h.fz <= 0 && Math.hypot(h.x - b.tx, h.y - b.ty) < BR) hurt(h, b.dm); for (const u of G.units) if (u && (u.t === 'spear' || u.t === 'cav') && !(u.dn > 0) && u.x !== undefined && Math.hypot(u.x - b.tx, u.y - b.ty) < BR) u.hp -= b.dm * 0.8; if (G.castle && Math.hypot(G.ax - b.tx, G.ay - b.ty) < CR + BR * 0.5) G.baseHp -= b.dm * 1.6; G.fx.push([b.tx, b.ty, BR, 'boom']); G.pj.splice(i, 1); } continue; }
    for (const u of G.units) if (!hit && u && (u.t === 'spear' || u.t === 'cav') && !(u.dn > 0) && u.x !== undefined && Math.hypot(u.x - b.x, u.y - 14 - b.y) < 22) { u.hp -= b.dm * 0.8; G.fx.push([b.x, b.y - 8, 14, 'puff']); hit = true; }
    if (!hit) for (const h of hs2) if (h.fz <= 0 && Math.hypot(h.x - b.x, h.y - 10 - b.y) < 20) { hurt(h, b.dm); G.fx.push([h.x, h.y - 20, 16, 'puff']); hit = true; break; }
    if (!hit && G.castle && Math.hypot(G.ax - b.x, G.ay - b.y) < CR + 12) { G.baseHp -= b.dm * 1.6; hit = true; }
    if (hit || b.life <= 0) G.pj.splice(i, 1); }
  // 정리
  if (G.cmS && !G.cmD) beaconStep(dt);
  subStep(dt, hs2, hs); evStep(dt, hs2, hs);
  const dead = G.en.filter((e) => e.hp <= 0); for (const e of dead) enemyDeath(e); G.en = G.en.filter((e) => e.hp > 0);
  const camps = G.en.filter((e) => e.t === 'camp' && !e.sm).length, wipe = !G.castle && G.lives <= 0 && G.order.every((id) => G.pl[id].down > 1e8);
  if (G.castle) { G.repCd = Math.max(0, (G.repCd || 0) - dt);
    if (G.bInv > 0) { G.bInv -= dt; if (G.baseHp < G.bInvHp) G.baseHp = G.bInvHp; G.bhQ = 6; G.bfx = (G.bfx || 0) - dt; if (G.bfx <= 0) { G.bfx = 0.6; G.fx.push([G.ax, G.ay, 90, 'lvl']); } }
    else { const fr = G.baseHp / G.baseMax; for (let k = 1; k >= 0; k--) if (!G.bm[k] && fr <= (k ? 0.33 : 0.66) && G.baseHp > 0) { G.bm[0] = true; G.bm[k] = true; G.bInv = G.dif.bi; G.bInvHp = G.baseHp; const M = [['🛡 의병이 성을 지키기 위해 고군분투합니다!', '잠시 동안 성이 안전해요. 그 틈에 전열을 정비하세요!'], ['🛡 성벽 위로 의병들이 몰려들었어요!', '백성들이 힘을 모아 잠시 성을 지켜요'], ['🛡 승병과 백성이 성문을 막아 냅니다!', '잠깐 숨을 돌릴 수 있어요. 성 수리 버튼도 눌러 보세요']][rint(3)]; G.info = { id: Date.now() + Math.random(), tt: (k ? '⚠️ 성이 위태로워요! ' : '') + M[0], tx: M[1] }; G.fx.push([G.ax, G.ay, 100, 'lvl']); break; } } }
  if (G.castle) { if (G.baseHp < (G.bhPrev || 0) - 1e-6) G.bhQ = 6; else if ((G.bhQ = (G.bhQ || 0) - dt) <= 0 && G.baseHp > 0) G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.006 * dt); G.bhPrev = G.baseHp; }
  if (G.castle && G.baseHp <= 0) endRound(false); else if (wipe) endRound(false);
  else if (G.endless && G.finalDead) endRound(true);
  else if (G.obj === 'b' && G.bossDead) endRound(true);  else if (G.obj === 'r' && camps === 0) endRound(true);
  else if (G.cmOn && camps > 0 && G.cmDl && G.t >= G.cmDl) { endRound(false); G.res.cmf = camps; G.res.cmk = 'c'; }
  else if (!G.endless && G.t >= G.dur) { const fl = (G.cmOn && camps > 0) ? 'c' : (G.cmS && !G.cmD) ? 'b' : (G.cmR && camps > 0) ? 'r' : ''; if (fl) { endRound(false); G.res.cmf = camps || 1; G.res.cmk = fl; } else endRound(G.obj === 'd' || G.obj === 's' || G.obj === 'e'); }
}
function endRound(win) {
  G.baseHp = Math.max(0, G.baseHp); G.ph = 'result'; G.res = { win, rd: G.rd, id: Date.now() + '' + rint(1000) }; if (win && G.cm && !G.endless) { const m = G.cmM ? 1 : 0; G.res.rw = { sh: (G.cl || 1) + m, tk: 1 + m + ((G.cl || 1) >= 2 ? 1 : 0) }; } G.en = []; G.ev = null; if (!G.endless) { G.res.rs = { sm: G.sm ? G.sm.ok | 0 : 0, s3: G.s3 | 0, du: G.duWins | 0, cm: G.cm ? 1 : 0, hd: G.dif === DIFF.hard ? 1 : 0, ch: win ? [9, 19, 24, 29].indexOf(G.rd) : -1, kc: G.kc | 0, lv: G.lvC | 0, t: Math.floor(G.t), al: G.altN | 0, bk: G.bossDead ? 1 : 0 }; if (G.daily && !G.dailyDone) { G.dailyDone = 1; G.res.dl = { sc: (win ? 1000 : 0) + (G.kc | 0) * 4 + (G.sm ? G.sm.ok | 0 : 0) * 200 + (G.castle ? Math.round(Math.max(0, G.baseHp) / G.baseMax * 300) : 0) + (G.qokT | 0) * 30 }; } }
  G.lvq = 0; for (const id of G.order) { const p = G.pl[id]; p.offer = null; p.qz = null; p.mo = null; if (win && !G.endless) { const ks = Object.keys(MER).filter((k) => ((p.mer || {})[k] || 0) < 5); p.mo = ks.sort(() => Math.random() - 0.5).slice(0, 3); } }
  if (G.es) { G.es.tot = Math.floor(G.t); G.es.r = G.er + 1; G.es.over = true; G.es.clear = !!win; G.ph = 'end'; }
  else saveGame('auto', win ? G.rd + 1 : G.rd);
}
function autoMer() { for (const id of G.order) { const p = G.pl[id]; if (p.mo && p.mo.length) { p.mer = p.mer || {}; const k = p.mo[rint(p.mo.length)]; p.mer[k] = (p.mer[k] || 0) + 1; p.mo = null; } } }
function nextRound() {
  autoMer(); G.bonus = 0;
  if (G.rd + 1 >= R.length) { if (!G.endless) { G.ph = 'end'; return; } G.cyc = (G.cyc || 0) + 1; startRound(0); return; } startRound(G.rd + 1);
}
function hostMsg(from, m) {
  if (!G || !G.pl[from] && m.k !== 'prof') return;
  const p = G.pl[from];
  if (m.k === 'prof') { if (G.ph !== 'lobby' && !p) return; if (!p) addPlayer(from, m.name, m.role); else { p.name = String(m.name || p.name).slice(0, 8); if (ROLE[m.role]) p.role = m.role; } if (p || G.pl[from]) { const q0 = G.pl[from]; q0.aura = AUR[m.aura] && AUR[m.aura].s !== 't' ? m.aura : ''; q0.trail = AUR[m.tr] && AUR[m.tr].s === 't' ? m.tr : ''; q0.lvfx = LVF[m.lf] ? m.lf : ''; q0.ps = pasClean(m.ps); q0.bdr = BRD[m.bd] ? m.bd : ''; } { const q = G.pl[from]; if (q && m.tk) q.tk = String(m.tk).slice(0, 24); } return; }
  if (m.k === 'in') { const l = Math.hypot(m.mx, m.my) || 1, s = l > 1 ? 1 / l : 1; p.mvx = m.mx * s; p.mvy = m.my * s; }
  else if (m.k === 'skill' && G.ph === 'battle' && G.du && G.du.ph === 'fight' && p.cd <= 0 && p.hp > 0) { p.cd = 6; p.fz = 0.7; const l = Math.hypot(p.mvx, p.mvy) || 1; const dx = (Math.abs(p.mvx) + Math.abs(p.mvy) > 0.05 ? p.mvx / l : 1), dy = (Math.abs(p.mvx) + Math.abs(p.mvy) > 0.05 ? p.mvy / l : 0); p.x += dx * 130; p.y += dy * 130; G.fx.push([p.x, p.y, 40, 'puff']); }
  else if (m.k === 'skill' && G.ph === 'battle' && !G.du && p.cd <= 0 && !p.down) castSkill(p);
  else if (m.k === 'cr' && G.ph === 'battle' && !G.du && G.cm && p.cr && (p.cc || 0) <= 0 && !p.down && p.hp > 0) castCr(p);
  else if (m.k === 'pause' && G.ph === 'battle' && (G.order.length === 1 || from === G.order[0])) { G.paused = !!m.v; G.pausedAt = G.paused ? Date.now() : 0; }
  else if (m.k === 'summon' && G.ph === 'battle' && G.obj !== 'e' && !G.du) doSummon(false);
  else if (m.k === 'upg' && G.ph === 'battle' && G.obj !== 'e' && G.upg < 5 && G.food >= UPC[G.upg]) { G.food -= UPC[G.upg]; G.upg++; if (G.castle) { G.baseMax = Math.round(G.baseMax * 1.25); G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.3); } else for (const q of G.order) { const h = G.pl[q]; h.hp = Math.min(h.mx, h.hp + h.mx * 0.3); } G.fx.push([G.ax, G.ay, 110, 'merge']); }
  else if (m.k === 'merge' && G.ph === 'battle') { if (m.a >= 0 && m.a < SLOTN && m.b >= 0 && m.b < SLOTN) doMerge(m.a | 0, m.b | 0); }
  else if (m.k === 'qa' && p.offer && p.qz && p.qs === 0 && from === G.qzr && m.i >= 0 && m.i < p.qz.o.length) {
    if ((m.i | 0) === p.qz.a) { p.qok = (p.qok || 0) + 1; p.qstk = (p.qstk || 0) + 1; { const esc = G.obj === 'e'; let t = ''; if (esc) { p.hp = Math.min(p.mx, p.hp + p.mx * 0.25); t = '체력 +25%'; } else { G.food += 30; t = '군량 +30'; } if (p.qstk % 3 === 0) { for (const q of G.order) { const h = G.pl[q]; h.hp = Math.min(h.mx, h.hp + h.mx * 0.3); } if (!esc) G.food += 50; t += ' · 🔥연속 정답 보너스' + (esc ? ' 전원 체력 +30%' : ' 군량 +50 · 전원 체력 +30%'); G.fx.push([p.x, p.y, 90, 'lvl']); } p.qrw = t; } if (G.es) G.es.q++; G.qokT = (G.qokT || 0) + 1; resolveQuiz(true); if (p.qz && p.qz.evo) evoFinish(); } else resolveQuiz(false);
  }
  else if (m.k === 'card' && p.offer && p.qs !== 0 && m.i >= 0 && m.i < p.offer.length && (!p.qz || from === G.qzr) && !(p.qrd > 0)) { if (p.qz) applyShared(p, p.offer[m.i | 0]); else { applyCard(p, p.offer[m.i | 0]); p.offer = null; } }
  else if (m.k === 'cheer' && p.offer && p.qz && p.qs !== 0 && from !== G.qzr && m.i >= 0 && m.i < p.offer.length) { G.chs = G.chs || {}; G.chs[from] = [m.i | 0, 8]; }
  else if (m.k === 'vote' && G.ev && (m.i === 0 || m.i === 1)) G.ev.votes[from] = m.i;
  else if (m.k === 'rep' && G.ph === 'battle' && G.castle && !G.paused && G.food >= G.dif.rc && G.baseHp > 0 && G.baseHp < G.baseMax && (G.repCd || 0) <= 0) { G.food -= G.dif.rc; G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * G.dif.rh); G.repCd = 5; G.fx.push([G.ax, G.ay, 80, 'sum']); }
  else if (m.k === 'mer' && G.ph === 'result' && p.mo && m.i >= 0 && m.i < p.mo.length) { p.mer = p.mer || {}; const k = p.mo[m.i | 0]; p.mer[k] = (p.mer[k] || 0) + 1; p.mo = null; }
  else if (m.k === 'ans' && (G.ph === 'result' || G.ph === 'brief') && G.ans[from] == null) G.ans[from] = m.i | 0;
}
function hostCtl(c, v) { // 방장 전용 조작
  if (c === 'start') { G.daily = v.daily ? 1 : 0; G.dailyMod = v.daily ? v.mod : null; G.dailyDone = 0; G.duWins = 0; G.sel.start = v.start; G.sel.dur = FAST || v.dur; G.dif = DIFF[v.diff] || DIFF.normal; G.sel.diff = v.diff; G.bonus = 0; G.wallN = v.wall | 0; G.endless = !!v.endless; G.cm = !!v.coop && !v.endless; G.cl = Math.min(3, Math.max(1, (v.cl | 0) || 2)); fillBots(G.cm ? (v.bots | 0) : 0); G.cyc = 0; G.bpi = 0; G.esw = null; G.es = G.endless ? { tot: 0, k: 0, q: 0, from: v.start, over: false, r: 1, clear: false } : null; for (const id of G.order) { G.pl[id].cards = {}; G.pl[id].mer = {}; } if (G.cm && !v.fix) { G.sel.dur = FAST || 300; v.start = rint(R.length); G.cmObj = ['d', 'e', 's', 'b', 'r'][rint(5)]; } else G.cmObj = v.obj || null; { let st = v.start; if (G.endless) { st = 0; for (let i = v.start; i < R.length; i++) if (ROUND_OBJ[i] === 'd') { st = i; break; } } startRound(st); } }
  else if (c === 'endless' && G.ph === 'end' && !G.endless) { G.endless = true; G.cyc = 0; G.bpi = 0; G.bonus = 0; G.es = { tot: 0, k: 0, q: 0, from: 0, over: false, r: 1, clear: false }; G.ph = 'brief'; startRound(0); }
  else if (c === 'fight' && G.ph === 'brief') beginBattle();
  else if (c === 'next' && G.ph === 'result' && G.cm) { for (const id of G.order) { G.pl[id].cards = {}; G.pl[id].mer = {}; } G.cmObj = ['d', 'e', 's', 'b', 'r'][rint(5)]; startRound(rint(R.length)); }
  else if (c === 'next' && G.ph === 'result') { if (G.res.win) nextRound(); else startRound(G.rd); }
  else if (c === 'retry' && G.ph === 'result') startRound(G.rd);
  else if (c === 'skip' && G.ph === 'result' && !G.res.win && R[G.rd].df) nextRound();
  else if (c === 'lobby') { dropBots(); G.ph = 'lobby'; }
}
function makeSnap() {
  const g = G; const s = { ph: g.ph, rd: g.rd, t: g.t, dur: g.dur, sel: g.sel, order: g.order,
    pl: g.order.map((id) => { const p = g.pl[id]; return { id, name: p.name, bt: p.bot ? 1 : 0, aw: p.away ? 1 : 0, role: p.role, au: p.aura || '', tr: p.trail || '', lf: p.lvfx || '', bd: p.bdr || '', sd: p.sdT > 0 ? 1 : 0, cr: p.cr || '', cc: Math.ceil(p.cc || 0), x: p.x, y: p.y, hp: p.hp, mx: p.mx, lv: p.lv, down: p.down, cd: p.cd, offer: p.offer, offT: p.offT, rd: Math.ceil(Math.max(0, p.qrd || 0)), mo: p.mo || null, mer: p.mer || {}, qz: p.qz ? { q: p.qz.q, o: p.qz.o, tag: p.qz.tag, by: p.qz.by, bn: p.qz.bn, ...(p.qs ? { a: p.qz.a, w: p.qz.w } : {}) } : null, qs: p.qs | 0, qok: p.qok | 0, qrw: p.qrw || '', qst: p.qstk | 0, cards: p.cards, fz: p.fz, rg: Math.round(heroStats(p).rg) }; }) };
  if (g.ph === 'battle' || g.ph === 'result' || g.ph === 'brief') { s.ww = g.ww; s.wh = g.wh; s.ax = g.ax; s.ay = g.ay; s.obj = g.obj; s.mod = g.mod || null; s.cm = g.cm ? 1 : 0; s.cmm = g.cmOn ? 'c' : g.cmS ? 'b' : g.cmR ? 'r' : ''; s.cmn = (g.cmOn || g.cmR) ? (g.du ? g.du.enSaved : g.en).filter((e) => e.t === 'camp').length : -1; s.cg = Math.round(g.cmG || 0); s.cgd = g.cmD ? 1 : 0; s.cpl = g.cmS ? g.cmPl.map((q, i) => [q[0], q[1], (g.cmOc || [])[i] | 0]) : null; s.cdl = g.cmOn ? Math.max(0, Math.ceil(g.cmDl - g.t)) : g.cmR ? Math.max(0, Math.ceil(g.dur - g.t)) : 0; s.cl = g.cl | 0; s.bi = g.bInv > 0 ? 1 : 0; s.rcd = Math.ceil(g.repCd || 0); s.rc = g.dif.rc; s.rh = Math.round(g.dif.rh * 100); s.bis = g.dif.bi; s.wv = g.obj === 'e' ? g.ambT : g.waveT; s.castle = g.castle; s.lives = g.lives; s.gi = g.gi; s.goals = g.goals; s.dirs = g.dirs; s.cpos = g.campPos; s.cpn = g.en.filter((e) => e.t === 'camp').length; s.cpt = g.campTotal || 0; s.bh = g.baseHp; s.bm = g.baseMax; s.food = Math.floor(g.food); s.cost = summonCost(); s.un = g.units; s.xp = g.xp; s.need = g.need;
    s.du = g.du ? { sn: styOf(g.du.b).n, cx: Math.round(g.du.cx), cy: Math.round(g.du.cy), R: g.du.R, ph: g.du.ph, tm: Math.ceil(Math.max(0, g.du.tm)), hp: g.du.b.hp / g.du.b.mx, bn: bnm(g.du.b), tl: g.du.tl.map((t) => [t.k, Math.round(t.x), Math.round(t.y), t.r || 0, Math.round(t.x2 || 0), Math.round(t.y2 || 0), +(t.t / t.t0).toFixed(2), +(t.a || 0).toFixed(2)]), pj: g.du.pj.map((q) => [Math.round(q.x), Math.round(q.y)]) } : null;
    s.en = (g.du ? [g.du.b] : g.en).slice(0, 220).map((e) => [e.id, e.t, Math.round(e.x), Math.round(e.y), Math.round(e.hp / e.mx * 100) / 100, e.ef > 0 ? 1 : 0, e.el, e.pk === 'cannon' ? 1 : 0, e.bn || 0]); s.wx = g.wx ? g.wx.k : ''; s.mor = g.t < (g.moraleT || 0) ? Math.ceil(g.moraleT - g.t) : 0; s.qzr = g.qzr; s.esw = g.obj === 'e' ? (g.esw || null) : null; s.esl = g.esl || 0; { const S = g.sm, m = S && S.cur; s.sm = m ? { k: m.k, n: SMD[m.k][0], t: Math.ceil(Math.max(0, m.t)), a: m.a, b: m.b, ok: S.ok, pts: smPts(m) } : (S ? { ok: S.ok, nt: Math.ceil(S.nt) } : null); } s.ch = Object.keys(g.chs || {}).map((id) => [g.pl[id] ? g.pl[id].name : '', g.chs[id][0]]); s.paused = g.paused; s.fl = g.fl || 0; s.sf = g.sf || 0; s.so = g.souls.slice(-260).map((q) => [Math.round(q.x), Math.round(q.y), q.v]); s.pj = (g.du ? [] : g.pj).slice(0, 90).map((b) => [Math.round(b.x), Math.round(b.y), Math.round(b.vx), Math.round(b.vy), b.k, b.tx !== undefined ? Math.round(b.tx) : 0, b.ty !== undefined ? Math.round(b.ty) : 0, b.R || 80]); s.mg = g.magT > 0; s.info = g.info; s.nl = Math.round(g.nl * 100) / 100; s.nd = g.dif === DIFF.hard ? 0.96 : 0.9; s.vp = !!g.ev; s.cp = g.order.length === 1 && !!g.pl[g.order[0]].offer; s.cr = g.crates.map((c) => [c.x, c.y, c.k]); s.upg = g.upg; s.lc = g.lvC | 0; s.an = g.altN | 0; s.bc = g.bc && g.bc.st < 2 ? [Math.round(g.bc.x), Math.round(g.bc.y), g.bc.st, Math.round(g.bc.p / 30 * 100)] : null; s.al = (g.altars || []).map((a) => [Math.round(a.x), Math.round(a.y), Math.round(a.g * 100), a.d ? 1 : 0]); s.ucost = UPC[g.upg] || 0; s.slots = slotsOpen(g.upg); { const WM = { archer: 'bow', bow: 'bow', cannon: 'cannon', gun: 'musket', hwa: 'hwacha', stone: 'stone', thrust: 'spear', slash: 'sword' };
      for (const sh of g.shots) { if (sh[9] != null) continue; for (const id of g.order) { const p = g.pl[id], w = WM[sh[5]]; if (w && sh[0] === p.x && sh[1] === p.y - 20) { if ((p.cards[w] || 0) >= 5 || p.cards['evo_' + w]) sh[9] = 1; break; } } } }
    s.sh = g.shots; s.fx = g.fx; s.ev = g.ev ? { t: g.ev.t, q: g.ev.q, o: g.ev.o, votes: g.ev.votes, left: g.ev.left } : null; s.evR = g.evR ? g.evR.done : null; s.buff = g.buffAtk > 0; s.slow = g.slowT > 0; }
  s.sg = g.sig || ''; s.endless = !!g.endless; s.es = g.es ? { tot: g.es.over ? g.es.tot : Math.floor(g.t), k: g.es.k, q: g.es.q, over: !!g.es.over, r: g.es.over ? g.es.r : g.er + 1, clear: !!g.es.clear } : null; s.er = g.er | 0; s.bn = g.bn || null; s.rd = g.rd;
  if (g.ph === 'result') { s.res = g.res; } if (g.ph === 'result' || g.ph === 'brief') s.ans = g.ans;
  return s;
}

// =====================================================================
//  클라이언트 (모든 기기: 화면 / 입력)
// =====================================================================
let V = null;                // 최신 스냅샷
const RP = new Map();        // id -> 화면 표시 좌표(부드럽게)
let me = { name: '', role: 'archer', tr: (() => { try { const d = JSON.parse(localStorage.getItem('jd_cw') || 'null'); return d && d.eq2 ? String(d.eq2) : ''; } catch (e) { return ''; } })(), aura: (() => { try { const d = JSON.parse(localStorage.getItem('jd_cw') || 'null'); return d && d.eq ? String(d.eq) : ''; } catch (e) { return ''; } })() };
let TK = (() => { try { let k = sessionStorage.getItem('hdg_tk'); if (!k) { k = Math.random().toString(36).slice(2, 12) + Date.now().toString(36).slice(-4); sessionStorage.setItem('hdg_tk', k); } return k; } catch (e) { return Math.random().toString(36).slice(2, 14); } })();
// 마지막으로 들어간 방 기억 (탭이 닫히거나 새로고침돼도 「이어하기」로 돌아와요)
const LASTROOM = { get() { try { const r = JSON.parse(localStorage.getItem('jd_last') || 'null'); return r && Date.now() - r.t < 15 * 60 * 1000 ? r : null; } catch (e) { return null; } }, set(r) { try { localStorage.setItem('jd_last', JSON.stringify(r)); } catch (e) {} }, clear() { try { localStorage.removeItem('jd_last'); } catch (e) {} } };
function saveLast() { LASTROOM.set({ url: Net.rurl, code: Net.rcode, tk: TK, name: me.name, role: me.role, t: Date.now() }); }
let sel = -1, lastIn = [0, 0], joy = { on: false, id: null, ox: 0, oy: 0, x: 0, y: 0 }, keys = {};
let lastPh = '', lastRd = -1, lastOffer = '', lastEvKey = '', draftSel = { start: 0, dur: 300 };
const cam = { x: 0, y: 0, rd: -1, t0: 0 };
const ST = (() => { let o = {}; try { o = JSON.parse(localStorage.getItem('jd_set') || '{}'); } catch (e) {} return Object.assign({ fxs: 'small', joy: 'm', hand: 'R', q: 'auto', snd: 'on', bgm: 'on', sv: 60, bv: 100 }, o); })();
let autoLow = false, fAcc = 0, fN = 0, skipF = 0, bossBan = 0, bossName = '', bannerBn = ['적장', ''];
const isLow = () => ST.q === 'low' || (ST.q === 'auto' && autoLow);
const JRS = { s: 42, m: 55, l: 72 }; let JR = 55;
function saveSt() { try { localStorage.setItem('jd_set', JSON.stringify(ST)); } catch (e) {} }
function toast(m) { let d = document.getElementById('toast'); if (!d) { d = document.createElement('div'); d.id = 'toast'; document.getElementById('notes').appendChild(d); } d.textContent = m; d.dataset.off = ''; d.style.opacity = 1; clearTimeout(d._t); d._t = setTimeout(() => { d.style.opacity = 0; d.dataset.off = '1'; }, 3200); }
function applyVol() { try { if (SFX._o) SFX._o.gain.value = Math.max(0, Math.min(1, ST.sv / 100)); if (BGM.bus && BGM.on) BGM.bus.gain.value = MUS.cur ? 0 : 0.22 * ST.bv / 100; if (MUS.cur && MUS.N[MUS.cur]) MUS.N[MUS.cur].out.gain.value = MUS.lvl(); } catch (e) {} const a = $('volSfx'), b = $('volBgm'); if (a) { a.value = ST.sv; $('volSfxN').textContent = ST.sv + '%'; } if (b) { b.value = ST.bv; $('volBgmN').textContent = ST.bv + '%'; } }
function applySt() { applyVol(); JR = JRS[ST.joy] || 55; const ring = $('joyRing'), knob = $('joyKnob'); ring.style.width = ring.style.height = JR * 2 + 'px'; $('sBattle').classList.toggle('lefty', ST.hand === 'L');
  const rs = isLow() ? 0.75 : 1, nw = Math.round(W * rs); if (cv.width !== nw) { cv.width = nw; cv.height = Math.round(H * rs); }
  document.querySelectorAll('#setBox [data-k]').forEach((b) => b.classList.toggle('on', ST[b.dataset.k] === b.dataset.v)); }
const CAPS = {};
const effects = []; // 클라이언트 쪽 효과 {x,y,r,k,a}
// ---- 도트 아이콘 (12x12, 코드로 그려요) ----
const PALX = { k: '#3b2a1a', w: '#ffffff', g: '#b4bfca', G: '#6a7580', r: '#d9453a', o: '#ff9a2e', y: '#ffd84a', b: '#a8723a', B: '#5b3a1c', n: '#3f7fd6', c: '#7fe3ff', p: '#9b6bd6', l: '#5aa84a' };
const PIXMAP = {
  spear: ['.....gg.....', '....gwwg....', '....gwwg....', '.....gg.....', '.....kk.....', '.....rr.....', '.....bb.....', '.....bb.....', '.....bb.....', '.....bb.....', '.....bb.....', '.....BB.....'],
  gong: ['....kkkk....', '...kyyyyk...', '..kyyoooyk..', '.kyyoyyoyyk.', '.kyoyyyyoyk.', '.kyoyyyyoyk.', '.kyyoyyoyyk.', '..kyyoooyk..', '...kyyyyk...', '....kkkk....', '...b....b...', '..bb....bb..'],
  bomb: ['.........y..', '........yoy.', '.......ko...', '....kkkkk...', '...kGGGGGk..', '..kGgGGGGGk.', '..kGgGGGGGk.', '..kGGGGGGGk.', '..kGGGGGGGk.', '...kGGGGGk..', '....kkkkk...', '............'],
  hwacha: ['..r.r.r.r...', '..r.r.r.r...', '..w.w.w.w...', '.kkkkkkkkk..', '.kbbbbbbbk..', '.kbbbbbbbk..', '.kkkkkkkkk..', '..kk....kk..', '.kggk..kggk.', '.kgGk..kgGk.', '..kk....kk..', '............'],
  gun: ['............', '............', '............', '.kbbk.......', 'kbBBbkGGGGGG', 'kbBBbkgggggG', '.kbbkGGGGGGk', '..kk.y......', '............', '............', '............', '............'],
  powder: ['..y..o..y...', '...o.y.o....', '............', '..kkkkkkk...', '.kBbbbbbBk..', '.kkkkkkkkk..', '.kBbbbbbBk..', '.kBbbbbbBk..', '.kkkkkkkkk..', '.kBbbbbbBk..', '..kkkkkkk...', '............'],
  bow: ['............', '..kk..w.....', '.kb...w.....', 'kb....w.....', 'kb..wwwwwwg.', 'kb....w.....', '.kb...w.....', '..kk..w.....', '............', '............', '............', '............'],
  horse: ['...kk.......', '..kbbk......', '..kbbbk.....', '.kbbbbbk....', '.kbwkbbbk...', '.kbbbbbbbk..', '..kbbbbbbk..', '...kbbbbk...', '....kbbk....', '...kBBBBk...', '..kBBBBBBk..', '............'],
  armor: ['.kk......kk.', 'kggk....kggk', 'kgggkkkkgggk', '.kgggggggggk', '..kgGgggGgk.', '..kgGgggGgk.', '..kgggggggk.', '..kgGgggGgk.', '..kgGgggGgk.', '...kgggggk..', '....kkkkk...', '............'],
  soul: ['.....c......', '....cc......', '....cwc.....', '...cwwwc....', '...cwwwc....', '..cwwcwwc...', '..cwcccwc...', '..ccccccc...', '...ccccc....', '....ccc.....', '............', '............'],
  sword: ['..........gw', '.........gww', '........gww.', '.......gww..', '......gww...', '.....gww....', '..y.gww.....', '...yyg......', '..kbyy......', '.kbBk.......', 'kbBk........', '.kk.........'],
  flail: ['......k.k...', '.....kGGGk..', '....kkGgGkk.', '.....kGGGk..', '......kGk...', '.....gk.....', '....g.......', '...gk.......', '..g.........', '.kbk........', 'kbBk........', '.kk.........'],
  buddha: ['............', '.ooooo...o..', '.....o...o..', '.....o...o..', '.....o...o..', '.ooooooooo..', '.o...o......', '.o...o......', '.o...o......', '.o...ooooo..', '............', '............'],
  scroll: ['..kkkkkkkk..', '.kyyyyyyyyk.', '.kwwwwwwwwk.', '.kwkkkkkkwk.', '.kwwwwwwwwk.', '.kwkkkkkkwk.', '.kwwwrrwwwk.', '.kwwrrrrwwk.', '.kwwwrrwwwk.', '.kwwwwwwwwk.', '.kyyyyyyyyk.', '..kkkkkkkk..'],
  magnet: ['.rr......rr.', '.rr......rr.', '.rr......rr.', '.rr......rr.', '.rr......rr.', '.rrr....rrr.', '..rrr..rrr..', '...rrrrrr...', '....rrrr....', '..ww....ww..', '..ww....ww..', '............']
};
const ORD = ['bow', 'cannon', 'sword', 'buddha', 'spear', 'flail', 'bomb', 'hwacha', 'musket', 'rocket', 'stone', 'nu', 'turtle', 'armor', 'horse', 'gong', 'powder', 'train', 'forge', 'guard', 'medic', 'crit', 'study', 'spirit', 'scout'];
(() => { const T = (f) => { const m = []; for (let y = 0; y < 12; y++) { let r = ''; for (let x = 0; x < 12; x++) r += f(x, y); m.push(r); } return m; };
  PIXMAP.musket = PIXMAP.gun;
  PIXMAP.cannon = ['............', '............', '.......kkk..', '..kkkkkGGGk.', '.kGGGGGGGgGk', '.kGGGGGGGGGk', '..kkkkkGGGk.', '..kbbbk.kk..', '.kbBBBbk....', '.kbBkBbk....', '..kbbbk.....', '...kkk......'];
  PIXMAP.nu = ['............', '..k.....k...', '...k....k...', '....k...k...', '....kbbbbbbg', '....kbbbbbbg', '....k...k...', '...k....k...', '..k.....k...', '............', '............', '............'];
  PIXMAP.rocket = ['.....r......', '....rwr.....', '....rwr.....', '....kwk.....', '....kwk.....', '....kwk.....', '....kwk.....', '...kkwkk....', '..k.kwk.k...', '....oyo.....', '.....o......', '............'];
  PIXMAP.stone = ['............', '............', '....kkkk....', '...kGgGGk...', '..kGgGGGGk..', '..kGGGGGGk..', '..kGGGgGGk..', '...kGGGGk...', '....kkkk....', '............', '............', '............'];
  PIXMAP.forge = ['..kkkkkk....', '.kGGGGGGk...', '.kGgGGGGk...', '..kkkkkk....', '....kb......', '....kb......', '....kb......', '....kb......', '....kB......', '....kB......', '............', '............'];
  PIXMAP.train = T((x, y) => { const d = Math.hypot(x - 5.5, y - 5.5); return d < 1.5 ? 'y' : d < 2.8 ? 'r' : d < 4 ? 'w' : d < 5.2 ? 'r' : d < 6 ? 'k' : '.'; });
  PIXMAP.guard = ['.kkkkkkkkkk.', 'knnnnnnnnnnk', 'knnwwnnwwnnk', 'knnnnwwnnnnk', 'knnnnwwnnnnk', 'knnwwnnwwnnk', '.knnnnnnnnk.', '..knnnnnnk..', '...knnnnk...', '....knnk....', '.....kk.....', '............'];
  PIXMAP.medic = ['....kkkk....', '....kllk....', '....kllk....', '.kkkkllkkkk.', '.kllllllllk.', '.kllllllllk.', '.kkkkllkkkk.', '....kllk....', '....kllk....', '....kkkk....', '............', '............'];
  PIXMAP.crit = ['.....oo.....', '.....oo.....', '..o..oo..o..', '...o.oo.o...', '....oyyo....', 'ooooyyyyoooo', 'ooooyyyyoooo', '....oyyo....', '...o.oo.o...', '..o..oo..o..', '.....oo.....', '.....oo.....'];
  PIXMAP.study = ['............', '............', '.kkkkkkkkkk.', '.kbbbbkbbbk.', '.kbwwbkbwwk.', '.kbwwbkbwwk.', '.kbwwbkbwwk.', '.kbbbbkbbbk.', '.kkkkkkkkkk.', '............', '............', '............'];
  PIXMAP.spirit = ['.....r......', '....rr......', '....rro.....', '...rroor....', '...rooor....', '..rrooyor...', '..rooyyor...', '..rooyyor...', '..rrooyor...', '...rrooor...', '....rrrr....', '............'];
  PIXMAP.scout = ['.kb.........', '.kbrrrrrr...', '.kbrrwwrr...', '.kbrrrrrr...', '.kb..rrr....', '.kb.........', '.kb.........', '.kb.........', '.kb.........', '.kb.........', 'kkkk........', '............'];
  PIXMAP.turtle = ['............', '....gggg....', '...gGGGGg...', '..gGgGGgGg..', '.kkkkkkkkkk.', 'kbbbbbbbbbbk', '.kbBbbBbbBk.', '..kkkkkkkk..', '.o........o.', '............', '............', '............']; })();
const ICC = {}, ICU = {};
function ICOC(id) { if (id.startsWith('evo_')) id = id.slice(4); if (ICC[id]) return ICC[id]; const m = PIXMAP[id] || PIXMAP.soul, c = document.createElement('canvas'); c.width = 12; c.height = 12; const g = c.getContext('2d');
  m.forEach((row, y) => { for (let x = 0; x < 12; x++) { const ch = row[x]; if (ch && ch !== '.' && PALX[ch]) { g.fillStyle = PALX[ch]; g.fillRect(x, y, 1, 1); } } }); return ICC[id] = c; }
function ICON(id) { if (id.startsWith('evo_')) id = id.slice(4); if (ICU[id]) return ICU[id]; const c = document.createElement('canvas'); c.width = 48; c.height = 48; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(ICOC(id), 0, 0, 48, 48); return ICU[id] = c.toDataURL(); }
// ---- 효과음 (코드로 만든 소리, 파일 없음) ----
const SFX = { ctx: null, last: {}, TH: { hit: 70, slash: 90, bow: 80, gun: 120, boom: 120, gong: 300, pop: 80, pick: 50, lvl: 300, boss: 1000, night: 1000, cannon: 200 },
  init() { if (this.ctx) return; try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} },
  out() { if (!this._o) { this._o = this.ctx.createGain(); this._o.connect(this.ctx.destination); } this._o.gain.value = Math.max(0, Math.min(1, ST.sv / 100)); return this._o; },
  tone(f0, f1, d, type, v) { const c = this.ctx, o = c.createOscillator(), g = c.createGain(), t = c.currentTime; o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + d); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0008, t + d); o.connect(g); g.connect(this.out()); o.start(t); o.stop(t + d + 0.02); },
  noise(d, v, f) { const c = this.ctx, n = Math.floor(c.sampleRate * d), b = c.createBuffer(1, n, c.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = b; fl.type = 'lowpass'; fl.frequency.value = f; g.gain.value = v; s.connect(fl); fl.connect(g); g.connect(this.out()); s.start(); },
  p(n) { if (!this.ctx || ST.snd === 'off') return; const t = performance.now(); if (t - (this.last[n] || 0) < (this.TH[n] || 50)) return; this.last[n] = t;
    if (n === 'hit') { this.noise(0.07, 0.16, 2600); this.tone(220, 90, 0.07, 'square', 0.05); }
    else if (n === 'slash') { this.noise(0.12, 0.13, 5200); }
    else if (n === 'bow') { this.tone(520, 160, 0.09, 'triangle', 0.09); }
    else if (n === 'gun') { this.noise(0.18, 0.28, 1800); this.tone(120, 50, 0.15, 'sawtooth', 0.08); }
    else if (n === 'cannon') { this.noise(0.25, 0.3, 900); this.tone(90, 40, 0.25, 'sine', 0.2); }
    else if (n === 'boom') { this.noise(0.4, 0.4, 700); this.tone(80, 30, 0.4, 'sine', 0.25); }
    else if (n === 'gong') { this.tone(196, 150, 0.9, 'sine', 0.3); this.tone(392, 300, 0.7, 'sine', 0.12); this.noise(0.15, 0.1, 3000); }
    else if (n === 'pop') { this.tone(300, 120, 0.1, 'sine', 0.07); }
    else if (n === 'pick') { this.tone(700, 1300, 0.12, 'sine', 0.1); }
    else if (n === 'lvl') { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.tone(f, f * 1.01, 0.22, 'triangle', 0.16), i * 90)); }
    else if (n === 'boss') { this.tone(70, 55, 0.9, 'sawtooth', 0.22); setTimeout(() => this.tone(60, 45, 0.9, 'sawtooth', 0.22), 450); this.noise(0.6, 0.15, 400); }
    else if (n === 'night') { this.tone(300, 150, 1.2, 'sine', 0.15); } }
};

// ===== 배경음(코드로 만드는 음악: 파일·인터넷 없이 재생) =====
const BGM = { on: false, lv: 0, step: 0, next: 0, bus: null, timer: null, SC: [293.66, 349.23, 392, 440, 523.25, 587.33, 698.46], BPM: 104,
  PH: [[0,-1,-1,2,-1,3,-1,-1,4,-1,3,-1,2,-1,-1,-1,0,-1,-1,2,-1,3,-1,-1,5,-1,4,-1,3,-1,-1,-1], [3,-1,-1,4,-1,5,-1,-1,4,-1,3,-1,2,-1,0,-1,2,-1,-1,3,-1,2,-1,0,1,-1,0,-1,0,-1,-1,-1], [0,-1,2,-1,3,-1,4,-1,5,-1,-1,4,3,-1,2,-1,3,-1,4,-1,5,-1,6,-1,5,-1,4,-1,3,-1,-1,-1], [4,-1,-1,3,-1,2,-1,-1,3,-1,2,-1,0,-1,-1,-1,2,-1,-1,0,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1]],
  start() { if (this.on || !SFX.ctx || ST.bgm === 'off') return; const c = SFX.ctx; this.bus = c.createGain(); this.bus.gain.value = 0.22 * ST.bv / 100; this.bus.connect(c.destination); this.on = true; this.next = c.currentTime + 0.15; this.step = 0; this.timer = setInterval(() => this.tick(), 90); },
  stop() { if (!this.on) return; this.on = false; clearInterval(this.timer); try { this.bus.gain.setTargetAtTime(0, SFX.ctx.currentTime, 0.2); } catch (e) {} },
  sync() { if (ST.bgm === 'off') { this.stop(); MUS.set(''); return; } if (!this.on) { this.start(); } if (!this.on) return; const v = (typeof V !== 'undefined') ? V : null; let lv = 0; if (v && v.ph === 'battle') { lv = v.paused ? 1 : v.du ? 3 : (v.en || []).some((e) => e[1] === 'boss') ? 3 : (v.t < 30 && !v.endless) ? 1 : 2; } this.lv = lv; MUS.set(v && v.ph === 'battle' ? (v.du ? 'duel' : 'c' + (R[v.rd] ? R[v.rd].ch : 0)) : 'calm'); },
  osc(f, t, d, type, v, lp) { const c = SFX.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0004, t + d); let n = o; if (lp) { const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; o.connect(fl); n = fl; } n.connect(g); g.connect(this.bus); o.start(t); o.stop(t + d + 0.05); },
  thud(t, v, f0) { const c = SFX.ctx, o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f0 || 150, t); o.frequency.exponentialRampToValueAtTime(52, t + 0.16); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.26); o.connect(g); g.connect(this.bus); o.start(t); o.stop(t + 0.3); },
  tak(t, v) { const c = SFX.ctx, n = Math.floor(c.sampleRate * 0.05), b = c.createBuffer(1, n, c.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = b; fl.type = 'bandpass'; fl.frequency.value = 1900; g.gain.value = v; s.connect(fl); fl.connect(g); g.connect(this.bus); s.start(t); },
  tick() { if (!this.on || !SFX.ctx) return; const c = SFX.ctx; if (c.state !== 'running') { this.next = c.currentTime + 0.1; return; } const sd = 60 / this.BPM / 4;
    while (this.next < c.currentTime + 0.35) { const t = this.next, i = this.step % 128, b = i % 16, lv = this.lv, bar = Math.floor(i / 16);
      if (b === 0 && bar % 2 === 0) { this.osc(73.42, t, sd * 30, 'triangle', 0.05, 380); this.osc(110, t, sd * 30, 'triangle', 0.03, 380); }
      const m = this.PH[Math.floor(i / 32)][i % 32]; if (m >= 0) { const f = this.SC[m]; this.osc(f, t, sd * 3.2, 'triangle', lv >= 2 ? 0.075 : 0.09, 2200); this.osc(f * 2.003, t, sd * 1.6, 'sine', 0.018); }
      if (lv >= 1 && (b === 0 || (lv >= 2 && b === 8))) this.thud(t, lv >= 2 ? 0.2 : 0.11, 150);
      if (lv >= 2) { if (b === 11 || b === 6) this.thud(t, 0.12, 120); if (b === 4 || b === 12) this.tak(t, 0.05); if (b === 14) this.tak(t, 0.025); }
      if (lv >= 3) { if (b % 2 === 0) this.thud(t, 0.07, 100); if (b === 0 && bar % 2 === 0) { this.osc(98, t, sd * 14, 'sawtooth', 0.03, 500); this.osc(138.6, t, sd * 14, 'sawtooth', 0.02, 500); } if (b === 8) this.tak(t, 0.06); }
      this.next += sd; this.step++; } } };

// ===== 음원 파일 배경음악 (v0.34): 일기토(보스전)에는 준비된 곡을 틀고, 끝나면 원래 배경음으로 돌아와요 =====
const MUSF = { duel: 'music/duel.mp3', calm: 'music/calm.mp3', c0: 'music/c0.mp3', c1: 'music/c1.mp3', c2: 'music/c2.mp3', c3: 'music/c3.mp3' };
const MUS = { cur: '', el: {}, N: {}, V: { duel: 0.38, calm: 0.3, c0: 0.34, c1: 0.34, c2: 0.34, c3: 0.34 }, lvl() { return (this.V[this.cur] || 0.34) * ST.bv / 100; },
  mk(k) { if (this.N[k] || !MUSF[k] || !SFX.ctx) return this.N[k]; const c = SFX.ctx, N = { g: [c.createGain(), c.createGain()], e: [new Audio(MUSF[k]), new Audio(MUSF[k])], i: 0, on: false }; const out = c.createGain(); out.gain.value = 0; out.connect(c.destination); N.out = out; for (let q = 0; q < 2; q++) { N.e[q].preload = 'auto'; N.e[q].loop = false; N.e[q].addEventListener('error', () => { N.bad = true; N.on = false; }); N.g[q].gain.value = q ? 0 : 1; try { c.createMediaElementSource(N.e[q]).connect(N.g[q]); } catch (e) {} N.g[q].connect(out); } this.N[k] = N; return N; },
  set(k) { const c = SFX.ctx; if (!c) return; if (ST.bgm === 'off') k = ''; if (k && this.N[k] && this.N[k].bad) k = ''; if (k === this.cur) return; const old = this.cur ? this.N[this.cur] : null; this.cur = k;
    if (old) { try { old.out.gain.cancelScheduledValues(c.currentTime); old.out.gain.setTargetAtTime(0, c.currentTime, 0.25); } catch (e) {} old.on = false; setTimeout(() => { if (!old.on) old.e.forEach((x) => { try { x.pause(); } catch (e) {} }); }, 1500); }
    if (k) { const N = this.mk(k); if (!N) { this.cur = ''; return; } N.on = true; N.i = 0; N.e[0].currentTime = 0; N.g[0].gain.value = 1; N.g[1].gain.value = 0; try { N.e[1].pause(); } catch (e) {} const pr = N.e[0].play(); if (pr && pr.catch) pr.catch(() => { N.on = false; this.cur = ''; }); try { N.out.gain.cancelScheduledValues(c.currentTime); N.out.gain.setValueAtTime(0, c.currentTime); N.out.gain.linearRampToValueAtTime(this.lvl(), c.currentTime + 0.6); } catch (e) {} }
    if (BGM.bus && BGM.on) { try { BGM.bus.gain.setTargetAtTime(k ? 0 : 0.22 * ST.bv / 100, c.currentTime, 0.3); } catch (e) {} } },
  tick() { const k = this.cur, N = k && this.N[k], c = SFX.ctx; if (!N || !N.on || !c) return; const a = N.e[N.i], d = a.duration; try { N.out.gain.setTargetAtTime(this.lvl(), c.currentTime, 0.1); } catch (e) {} if (d && isFinite(d) && a.currentTime > d - 3.2 && !N.xf) { const j = 1 - N.i, b = N.e[j]; N.xf = true; b.currentTime = 0; const pr = b.play(); if (pr && pr.catch) pr.catch(() => {}); N.g[N.i].gain.setValueAtTime(1, c.currentTime); N.g[N.i].gain.linearRampToValueAtTime(0, c.currentTime + 3); N.g[j].gain.setValueAtTime(0, c.currentTime); N.g[j].gain.linearRampToValueAtTime(1, c.currentTime + 3); setTimeout(() => { N.xf = false; try { a.pause(); } catch (e) {} N.i = j; }, 3300); } } };
setInterval(() => { try { MUS.tick(); } catch (e) {} }, 300);
setInterval(() => { try { BGM.sync(); } catch (e) {} }, 400);
document.addEventListener('visibilitychange', () => { if (!SFX.ctx) return; if (document.hidden) SFX.ctx.suspend(); else SFX.ctx.resume(); });
['pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.addEventListener(ev, () => { SFX.init(); if (SFX.ctx && SFX.ctx.state === 'suspended') SFX.ctx.resume(); BGM.sync(); }, { passive: true }));

let lastGV = null, gvT = 0, lastInfoId = 0, infoTm = 0;
const gems = []; let shake = 0, lastBh = -1, lastPjV = null, pjT = 0, nightC = null, nightBan = 0, lastXp = 0, lastRdX = -1, lastSf = 0, lastRdSf = -1;

function sendHost(m) { if (Net.host) hostMsg(Net.id, m); else Net.send('host', m); }
function show(id) { for (const s of document.querySelectorAll('.screen')) s.classList.toggle('on', s.id === id); const st = document.getElementById('stage'); if (st) st.dataset.scr = id; }
function esc(s) { return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
const SRC = { '교': ['교과서', '#4aa3ff'], '지': ['지도서', '#7ad07a'], '보': ['교과서 밖 보충', '#ffb347'] };

// ----- 로비 -----
// ---- 저장 (이 브라우저에만 저장돼요 · 혼자 하기 전용) ----
const SLOTS = ['auto', '1', '2', '3'];
function saveGame(slot, rd) { if (!G || G.order.length !== 1 || Net.mode !== 'single') return false; const p = G.pl[G.order[0]]; const d = { ts: Date.now(), rd, dur: G.sel.dur, diff: G.sel.diff || 'normal', wall: G.wallN || 0, role: p.role, name: p.name, ver: VER }; try { localStorage.setItem('jd_sv_' + slot, JSON.stringify(d)); return true; } catch (e) { return false; } }
function readSave(slot) { try { const d = JSON.parse(localStorage.getItem('jd_sv_' + slot) || 'null'); return d && typeof d.rd === 'number' ? d : null; } catch (e) { return null; } }
function openSaves(mode, rd) {
  const box = $('saveBox'); $('svTitle').textContent = mode === 'save' ? '💾 어느 칸에 저장할까요?' : '📂 이어하기'; $('svNote').textContent = mode === 'save' ? '저장한 라운드의 처음부터 이어서 시작해요. (전투 도중의 위치는 저장되지 않아요)' : '저장한 라운드의 처음부터 시작해요. 자동 저장은 라운드가 끝날 때마다 갱신돼요.';
  $('svList').innerHTML = SLOTS.filter((k) => mode === 'load' || k !== 'auto').map((k) => { const d = readSave(k), nm = k === 'auto' ? '자동 저장' : '슬롯 ' + k; const info = d ? `${d.rd >= R.length ? '🏆 완주' : esc(R[d.rd].nm)} · ${({ easy: '쉬움', normal: '보통', hard: '어려움' })[d.diff] || '보통'} · ${new Date(d.ts).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}` : '비어 있어요'; const dis = mode === 'load' ? (!d || d.rd >= R.length) : false; return `<button class="svb" data-k="${k}" ${dis ? 'disabled' : ''}><b>${nm}</b><small>${info}</small></button>`; }).join('');
  $('svList').querySelectorAll('.svb').forEach((b) => b.onclick = () => { const k = b.dataset.k; if (mode === 'save') { const ok = saveGame(k, rd); toast(ok ? `슬롯 ${k}에 저장했어요` : '저장하지 못했어요'); box.classList.remove('on'); } else { box.classList.remove('on'); loadGame(k); } });
  box.classList.add('on');
}
async function loadGame(slot) {
  const d = readSave(slot); if (!d || d.rd >= R.length) return; $('nick').value = d.name || '학생'; me.role = ROLE[d.role] ? d.role : 'archer'; await startAs('single'); if (Net.mode !== 'single') return; sendProf(); hostCtl('start', { start: d.rd, dur: d.dur, diff: d.diff, wall: d.wall });
}
function renderUpdates(all) { const b = $('umBody'); if (!b) return; const L = all ? UPDATES : UPDATES.slice(0, 2); b.innerHTML = L.map((u) => `<div class="up"><b>${u.v}</b> <small>${u.d}</small><ul>${u.t.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join(''); $('umSub').textContent = all ? '지금까지의 업데이트예요.' : '최근 업데이트 ' + L.length + '개만 보여 드려요.'; $('umAll').style.display = all || UPDATES.length <= 2 ? 'none' : 'inline-block'; $('umAll').textContent = '이전 업데이트 모두 보기 (' + UPDATES.length + '개)'; }
function openUpd(all) { renderUpdates(all); $('updModal').classList.add('on'); }
function closeUpd() { $('updModal').classList.remove('on'); try { localStorage.setItem('jd_upd_seen', VER); } catch (e) {} }
function initUpd() { $('umClose').onclick = closeUpd; $('umX').onclick = closeUpd; $('updModal').addEventListener('pointerdown', (e) => { if (e.target.id === 'updModal') closeUpd(); }); $('umAll').onclick = () => openUpd(true); $('btnUpdL').onclick = () => openUpd(false); let seen = ''; try { seen = localStorage.getItem('jd_upd_seen') || ''; } catch (e) {} if (seen !== VER && !FAST) setTimeout(() => openUpd(false), 1800); }
function initLobby() {
  try { matchMedia('(orientation: portrait) and (pointer: coarse)').addEventListener('change', (e) => { if (e.matches && V && V.ph === 'battle' && !V.paused) sendHost({ k: 'pause', v: true }); }); } catch (e) {}
  initUpd();
  { // 전체화면 버튼 (앱 안 브라우저는 막혀 있어서 안내를 보여 줘요)
    const ua = navigator.userAgent, inApp = /KAKAOTALK|NAVER\(inapp|Instagram|FBAN|FBAV|Line\/|DaumApps/i.test(ua), de = document.documentElement;
    const can = !!(de.requestFullscreen || de.webkitRequestFullscreen), isFs = () => !!(document.fullscreenElement || document.webkitFullscreenElement), tip = $('fsTip');
    const note = () => { tip.textContent = inApp ? '지금은 카카오톡 같은 앱 안의 브라우저라 전체화면이 안 돼요. 오른쪽 아래 ⋮ 메뉴에서 "다른 브라우저로 열기"를 눌러 크롬이나 삼성 인터넷에서 열어 주세요.' : /iPhone|iPad/.test(ua) ? '아이폰/아이패드는 전체화면 기능이 막혀 있어요. 공유 버튼 → "홈 화면에 추가"로 앱처럼 열면 주소창이 사라져요.' : '이 브라우저에서는 전체화면을 쓸 수 없어요. 크롬이나 삼성 인터넷으로 열어 보세요.'; tip.classList.add('on'); clearTimeout(note.t); note.t = setTimeout(() => tip.classList.remove('on'), 9000); };
    $('pHome').onclick = () => { if (confirmLeave()) { LASTROOM.clear(); location.reload(); } };
    $('btnFs').onclick = $('pFs').onclick = async () => {
      if (isFs()) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} return; }
      if (inApp || !can) { note(); return; }
      try { await (de.requestFullscreen || de.webkitRequestFullscreen).call(de); try { await screen.orientation.lock('landscape'); } catch (e) {} } catch (e) { note(); }
    };
    const sync = () => { $('btnFs').textContent = $('pFs').textContent = isFs() ? '⛶ 전체화면 끄기' : '⛶ 전체화면'; };
    document.addEventListener('fullscreenchange', sync); document.addEventListener('webkitfullscreenchange', sync);
    if (inApp && matchMedia('(pointer:coarse)').matches) setTimeout(() => { if (!isFs()) note(); }, 2500);
  }
  $('btnLoad').onclick = () => openSaves('load'); $('svClose').onclick = () => $('saveBox').classList.remove('on'); $('pSave').onclick = () => openSaves('save', V ? V.rd : 0); $('rsSave').onclick = () => openSaves('save', V && V.res && V.res.win ? V.rd + 1 : V.rd);
  { const sv = (localStorage.getItem('hdg_relay') || '').trim(); $('relayUrl').value = sv && !sv.includes('YOUR-WORKER') && /^wss?:\/\//.test(sv) ? sv : DEFAULT_RELAY; } { const rc = (Q.get('room') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); if (rc) $('roomCode').value = rc; if (Q.get('relay')) { $('relayUrl').value = Q.get('relay'); } } $('nick').value = localStorage.getItem('hdg_nick') || '';
  const sc = $('selStart'); sc.innerHTML = CH.map((c, i) => `<option value="${i * (i < 2 ? 10 : 5) + (i === 3 ? 0 : 0)}">${i + 1}. ${c.n}</option>`).join('');
  sc.innerHTML = [0, 10, 20, 25].map((v, i) => `<option value="${v}">${i + 1}. ${CH[i].n}</option>`).join('');
  $('btnSingle').onclick = () => startAs('single');
  $('btnCreate').onclick = () => startAs('create');
  $('btnJoin').onclick = () => startAs('join');
  let diffSel = 'normal'; const DT_ = { easy: '적이 적고 약해요 · 영웅 체력 +30% · 시작 군량 +50', normal: '기본 난이도예요', hard: '적이 많고 강해요 · 영웅 체력 −10% · 시작 군량 −20' };
  const setDiff = (d) => { diffSel = d; document.querySelectorAll('#diffRow button').forEach((x) => x.classList.toggle('on', x.dataset.d === d)); $('diffTip').textContent = DT_[d]; }; document.querySelectorAll('#diffRow button').forEach((b) => (b.onclick = () => setDiff(b.dataset.d))); setDiff('normal');
  const roleTip = (r) => { const R0 = ROLE[r]; $('roleTip').innerHTML = `<b>${R0.n}</b> — ${R0.d}<br>` + R0.tag.map((x) => `<span class="tg">${x}</span>`).join('') + `<br>🔥 스킬 <b>${SKILL[r].n}</b> — ${SKILL[r].d}`; }; roleTip('archer'); pasTip(); refreshHid();
  $('btnStart').onclick = () => { draftSel = { start: +$('selStart').value, dur: +$('selDur').value, diff: diffSel }; hostCtl('start', draftSel); };
  $('btnCoop').onclick = () => { draftSel = { start: +$('selStart').value, dur: +$('selDur').value, diff: diffSel, coop: true, bots: +$('selBots').value, cl: +$('selCl').value }; hostCtl('start', draftSel); };
  $('btnStartE').onclick = () => { draftSel = { start: +$('selStart').value, dur: +$('selDur').value, diff: diffSel, endless: true }; hostCtl('start', draftSel); };
  $('btnLeave').onclick = () => { if (confirmLeave()) { LASTROOM.clear(); location.reload(); } };
  document.querySelectorAll('#roleRow button').forEach((b) => { b.onclick = () => { if (LEG[b.dataset.r] && !legOK(b.dataset.r)) { const c = cwLoad(), tg = cwTarget(c), k = b.dataset.r; $('roleTip').innerHTML = tg === k ? `🔒 <b>전설 영웅 ${LEG[k].n}</b> — 협동전을 깨서 영웅 조각 ${LEG[k].need}개를 모으면 열려요! (지금 ${c.sh}/${LEG[k].need})` : `🔒 <b>전설 영웅 ${LEG[k].n}</b> — 먼저 전설 영웅 ‘${LEG[tg].n}’을 열면 조각이 ‘${LEG[k].n}’ 쪽으로 모여요!`; return; } if (b.dataset.r === 'admiral' && !hidOK()) { $('roleTip').innerHTML = '🔒 <b>히든 영웅</b> — 모든 라운드를 끝까지 깨면 열려요!'; return; } me.role = b.dataset.r; sendProf(); roleTip(b.dataset.r); pasTip(); document.querySelectorAll('#roleRow button').forEach((x) => x.classList.toggle('on', x === b)); }; });
  document.querySelector('#roleRow button').classList.add('on');
  { const lr = LASTROOM.get(), rb = $('btnResume'); if (lr && rb) { rb.style.display = 'inline-block'; rb.textContent = '🔌 방 ' + lr.code + ' 이어하기'; rb.onclick = () => { try { sessionStorage.setItem('hdg_tk', lr.tk); } catch (e) {} TK = lr.tk; $('nick').value = lr.name || $('nick').value; $('roomCode').value = lr.code; if (lr.url && lr.url !== DEFAULT_RELAY) $('relayUrl').value = lr.url; startAs('join'); }; } }
}
// 끊겼던 친구가 같은 기기·같은 탭으로 다시 들어오면 영웅을 그대로 돌려줘요
function rejoin(from, d) {
  const tk = String(d.tk || ''); if (!tk) return; const p = G.order.map((id) => G.pl[id]).find((x) => x && x.tk === tk); if (!p || p.id === G.order[0]) return;
  const old = p.id; G.pl[from] = p; delete G.pl[old]; p.id = from; G.order = G.order.map((x) => (x === old ? from : x)); p.away = 0;
  if (G.ev && G.ev.votes[old] != null) { G.ev.votes[from] = G.ev.votes[old]; delete G.ev.votes[old]; } if (G.ans && G.ans[old] != null) { G.ans[from] = G.ans[old]; delete G.ans[old]; }
  G.info = { id: Date.now() + Math.random(), tt: '🔌 ' + p.name + ' 다시 들어왔어요', tx: '이어서 함께 싸워요!' };
}
function sendProf() { sendHost({ k: 'prof', name: me.name, role: me.role, tk: TK, aura: me.aura || '', tr: me.tr || '', lf: myCos().lf, bd: myCos().bd, ps: pasActive() }); }
async function startAs(mode) {
  me.name = ($('nick').value || '').trim().slice(0, 8) || '학생'; localStorage.setItem('hdg_nick', me.name);
  $('err').textContent = '';
  try {
    if (mode === 'single') { Net.mode = 'single'; Net.host = true; Net.id = 'me'; }
    else {
      let url = $('relayUrl').value.trim(); if (!url || url.includes('YOUR-WORKER')) { url = DEFAULT_RELAY; $('relayUrl').value = url; }
      if (url !== DEFAULT_RELAY && /^wss?:\/\//.test(url)) localStorage.setItem('hdg_relay', url); else if (url === DEFAULT_RELAY) localStorage.removeItem('hdg_relay');
      if (!/^wss?:\/\//.test(url)) throw '릴레이 주소를 먼저 넣어 주세요(선생님이 한 번만 설정)';
      let code = ($('roomCode').value || '').trim().toUpperCase(); Net.rurl = url;
      if (mode === 'create') code = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[rint(32)]).join('');
      else if (!code) throw '방 코드를 입력해 주세요';
      Net.rcode = code; await Net.connect(url, code, mode === 'create');
    }
  } catch (e) { $('err').textContent = typeof e === 'string' ? e : '연결 실패'; return; }
  Net.onClosed = () => { LASTROOM.clear(); alert('방이 닫혔어요. 처음 화면으로 돌아갑니다.'); location.reload(); };
  if (Net.host) {
    G = newG(); addPlayer(Net.id, me.name, me.role);
    G.pl[Net.id].tk = TK; G.pl[Net.id].aura = AUR[me.aura] && AUR[me.aura].s !== 't' ? me.aura : ''; G.pl[Net.id].trail = AUR[me.tr] && AUR[me.tr].s === 't' ? me.tr : ''; { const mc = myCos(); G.pl[Net.id].lvfx = mc.lf; G.pl[Net.id].bdr = mc.bd; G.pl[Net.id].ps = pasActive(); }
    Net.onJoin = () => {}; Net.onLeave = (id) => { const p = G.pl[id]; if (!p) return; if (G.ph === 'lobby' || G.ph === 'end' || id === G.order[0]) { delete G.pl[id]; G.order = G.order.filter((x) => x !== id); if (G.ev) delete G.ev.votes[id]; } else { p.away = Date.now(); p.mvx = p.mvy = 0; G.info = { id: Date.now() + Math.random(), tt: '📶 ' + p.name + ' 연결이 끊겼어요', tx: '3분 안에 다시 들어오면 이어서 할 수 있어요.' }; } };
    Net.onData = (from, d) => { if (d.k === 'prof' && !G.pl[from] && G.ph !== 'lobby') { rejoin(from, d); return; } hostMsg(from, d); };
    setInterval(hostTick, 1000 / 30); setInterval(hostBroadcast, 1000 / 15);
  } else { Net.onData = (from, d) => { if (d.s) { V = d.s; lastSnapAt = performance.now(); } }; Net.onDrop = reconnectLoop; sendProf(); saveLast(); setInterval(() => { if (Net.ws && Net.ws.readyState === 1) saveLast(); }, 30000); }
  keepAwake(); if (Net.host && Net.mode === 'online') window.addEventListener('beforeunload', (e) => { if (G && G.order.length > 1) { e.preventDefault(); e.returnValue = ''; } });
  $('roomLabel').textContent = Net.mode === 'online' ? '방 코드  ' + Net.room : '혼자 하기'; $('btnCopy').style.display = Net.mode === 'online' && Net.host ? 'inline-block' : 'none'; $('btnCopy').onclick = () => { const u = new URL(location.href.split('#')[0]); u.search = ''; u.searchParams.set('room', Net.room); if ($('relayUrl').value && $('relayUrl').value !== DEFAULT_RELAY) u.searchParams.set('relay', $('relayUrl').value.trim()); const t = u.toString(); const ok = () => { $('btnCopy').textContent = '✅ 복사했어요!'; setTimeout(() => ($('btnCopy').textContent = '🔗 초대 링크 복사'), 1800); }; try { navigator.clipboard.writeText(t).then(ok, () => prompt('이 주소를 복사해 친구에게 보내세요', t)); } catch (e) { prompt('이 주소를 복사해 친구에게 보내세요', t); } };
  $('hostBox').style.display = Net.host ? 'block' : 'none'; $('rsStart').style.display = Net.host ? 'flex' : 'none'; $('guestBox').style.display = Net.host ? 'none' : 'block';
  show('sRoom'); requestAnimationFrame(frame);
}
// ----- 연결이 끊겼을 때 다시 들어가기 / 화면 꺼짐 방지 / 방장 멈춤 알림 -----
let lastSnapAt = performance.now(), dropT = 0, wl = null, wasHid = false;
function dropBox(on) { let d = document.getElementById('dropBox'); if (!d) { d = document.createElement('div'); d.id = 'dropBox'; document.body.appendChild(d); } d.style.display = on ? 'block' : 'none'; return d; }
function reconnectLoop() {
  if (dropT) return; const box = dropBox(true); let n = 0, busy = false;
  dropT = setInterval(async () => {
    if (busy) return; busy = true; n++; box.textContent = '📶 연결이 끊겼어요. 다시 연결하는 중… (' + n + ')';
    try { await Net.connect(Net.rurl, Net.rcode, false); clearInterval(dropT); dropT = 0; dropBox(false); lastSnapAt = performance.now(); sendProf(); toast('다시 연결됐어요!'); }
    catch (e) { busy = false; if (e === '그런 방이 없어요' || n >= 30) { clearInterval(dropT); dropT = 0; LASTROOM.clear(); alert('방에 다시 들어가지 못했어요. 처음 화면으로 돌아갑니다.'); location.reload(); } }
  }, 2000);
}
async function keepAwake() { try { if (navigator.wakeLock && !wl && document.visibilityState === 'visible') { wl = await navigator.wakeLock.request('screen'); wl.addEventListener('release', () => { wl = null; }); } } catch (e) { wl = null; } }
document.addEventListener('visibilitychange', () => { if (document.hidden) wasHid = true; else { keepAwake(); if (wasHid && G && Net.host && Net.mode === 'online' && G.order.length > 1) toast('⚠ 방장 화면이 가려지면 친구 화면이 멈춰요. 이 화면을 켜 둬 주세요.'); wasHid = false; } });
setInterval(() => { const lag = Net.mode === 'online' && !Net.host && V && V.ph === 'battle' && !dropT && performance.now() - lastSnapAt > 2500; const t = document.getElementById('lagTag'); if (t) t.style.display = lag ? 'block' : 'none'; }, 500);
function confirmLeave() { return !(Net.host && Net.mode === 'online' && G && G.order.length > 1) || confirm('방장이 나가면 방이 닫히고 모든 친구가 나가게 돼요. 정말 나갈까요?'); }
let acc = 0, lastT = performance.now();
// ----- 협동전 봇 (빈자리 채우기) -----
const BOT_ROLES = ['militia', 'monk', 'gunner', 'archer'], BOT_NM = { guard: '🤖방패봇', ranger: '🤖불화살봇', supply: '🤖보급봇' };
function dropBots() { for (const id of [...G.order]) if (G.pl[id] && G.pl[id].bot) { delete G.pl[id]; if (G.ev) delete G.ev.votes[id]; if (G.ans) delete G.ans[id]; } G.order = G.order.filter((id) => G.pl[id]); }
function fillBots(total) {
  dropBots(); total = Math.min(4, total | 0); let k = 0;
  while (G.order.length < total) { const used = new Set(G.order.map((id) => G.pl[id].role)), r = BOT_ROLES.find((x) => !used.has(x)) || 'archer', id = 'bot' + (++k); addPlayer(id, '🤖봇' + k, r); G.pl[id].bot = true; }
}
const BOT_WP = ['bow', 'cannon', 'sword', 'buddha', 'spear', 'flail', 'bomb', 'hwacha', 'musket', 'rocket', 'stone', 'nu', 'turtle'];
function botCard(p) { // 봇은 이미 키우던 카드를 더 키우고, 무기는 3개까지만 모아요
  const c = p.cards || {}, nw = BOT_WP.filter((k) => c[k]).length; let bi = 0, bs = -1;
  p.offer.forEach((id, i) => { let s = Math.random(); if (String(id).startsWith('evo_')) s += 100; else if (BOT_WP.includes(id)) s += c[id] ? 12 + c[id] : (nw < 3 ? 8 : 2); else if (c[id]) s += 6 + c[id]; else if (['armor', 'guard', 'medic', 'forge', 'gong', 'train', 'powder', 'crit'].includes(id)) s += 5; else if (id === 'wall' && G.castle) s += 3; else if (id === 'heal' || id === 'food' || id === 'volun') s += 1; else s += 2; if (s > bs) { bs = s; bi = i; } });
  return bi;
}
let lastBt = 0;
function botAI(dd) {
  const now = performance.now(), dt = dd || Math.min(0.2, (now - lastBt) / 1000); lastBt = now;
  if (!G || !G.cm || G.paused) return;
  const all = G.order.map((id) => G.pl[id]), bots = all.filter((p) => p && p.bot); if (!bots.length) return;
  const hum = all.filter((p) => !p.bot && !p.away && p.hp > 0 && !(p.down > 0)), d2 = (a, x, y) => Math.hypot(a.x - x, a.y - y), ch = (m) => Math.random() < dt / m;
  const camps = G.en.filter((e) => e.t === 'camp');
  for (const p of bots) {
    const B = p.bt = p.bt || { o: 0, dir: 1, df: 0, s: 0 }; const rep = bots[0] === p; B.df -= dt; if (B.df <= 0) { B.df = 2 + Math.random() * 2; B.dir = -B.dir; }
    if (G.ph === 'brief') { const q = R[G.rd].q; if (q && G.ans[p.id] == null && ch(2.5)) hostMsg(p.id, { k: 'ans', i: Math.random() < 0.65 ? q[2] : rint(q[1].length) }); continue; }
    if (G.ph === 'result') { if (p.mo && ch(2)) hostMsg(p.id, { k: 'mer', i: rint(p.mo.length) }); continue; }
    if (G.ph !== 'battle') continue;
    if (G.ev) { if (G.ev.votes[p.id] == null && ch(1.8)) hostMsg(p.id, { k: 'vote', i: rint(2) }); p.mvx = p.mvy = 0; continue; }
    if (p.offer) { B.o += dt; if (B.o > 1.6) { B.o = 0.6; if (p.qz && p.qs === 0) { if (p.id === G.qzr) hostMsg(p.id, { k: 'qa', i: Math.random() < 0.65 ? p.qz.a : rint(p.qz.o.length) }); } else hostMsg(p.id, { k: 'card', i: botCard(p) }); } } else B.o = 0;
    if (p.hp <= 0 || p.down > 0) { p.mvx = p.mvy = 0; continue; }
    let tx = G.ax, ty = G.ay, stop = 110;
    if (G.du) {
      const b = G.du.b; p.mvx = p.mvy = 0;
      if (G.du.ph === 'fight') { const dx = p.x - b.x, dy = p.y - b.y, L = Math.hypot(dx, dy) || 1, want = G.du.R * 0.5, rad = (want - L) / want, tx_ = -dy / L * B.dir + dx / L * -rad * 0.9, ty_ = dx / L * B.dir + dy / L * -rad * 0.9, l2 = Math.hypot(tx_, ty_) || 1; p.mvx = tx_ / l2; p.mvy = ty_ / l2; if (p.cd <= 0 && ch(2.2)) hostMsg(p.id, { k: 'skill' }); }
      continue;
    }
    const foes = G.en.filter((e) => e.t !== 'camp'), near = (r) => foes.filter((e) => d2(e, p.x, p.y) < r);
    if (p.cr === 'ranger' || (G.obj === 'r' && p.cr !== 'supply')) { const c = camps.slice().sort((a, b) => d2(a, p.x, p.y) - d2(b, p.x, p.y))[0]; if (c) { tx = c.x; ty = c.y; stop = 230; } else { const e = foes.slice().sort((a, b) => d2(a, G.ax, G.ay) - d2(b, G.ax, G.ay))[0]; if (e && d2(e, G.ax, G.ay) < 650) { tx = e.x; ty = e.y; stop = 240; } else stop = 170; } }
    else if (p.cr === 'supply') { const f = hum.slice().sort((a, b) => a.hp / a.mx - b.hp / b.mx)[0] || all.find((q) => q.id !== p.id && q.hp > 0); if (f) { tx = f.x; ty = f.y; stop = 120; } }
    else { stop = 120; }
    let hold = false; if (G.cmS && !G.cmD) { const bi = bots.indexOf(p), ix = hum.length > 0 ? (bi === 0 ? 0 : -1) : (bi < 2 ? bi : -1); if (ix >= 0) { tx = G.cmPl[ix][0]; ty = G.cmPl[ix][1]; stop = 30; hold = true; } }
    if (!hold && G.sm && G.sm.cur && G.sm.cur.k === 'twin' && bots.indexOf(p) === 0) { tx = G.sm.cur.pb[0]; ty = G.sm.cur.pb[1]; stop = 14; hold = true; }
    const dx = tx - p.x, dy = ty - p.y, L = Math.hypot(dx, dy);
    if (L > stop) { p.mvx = dx / L; p.mvy = dy / L; } else if (hold) { p.mvx = p.mvy = 0; } else { const ax = -dy / (L || 1) * B.dir, ay = dx / (L || 1) * B.dir; p.mvx = ax * 0.35; p.mvy = ay * 0.35; }
    if (p.cd <= 0 && near(300).length >= 3 && ch(1.5)) hostMsg(p.id, { k: 'skill' });
    if (G.cm && p.cr && (p.cc || 0) <= 0) {
      let go = false;
      if (p.cr === 'guard') go = (G.castle && G.baseHp < G.baseMax * 0.6 && G.bInv <= 0) || near(240).length >= 8;
      else if (p.cr === 'ranger') go = near(380).length >= 5 || camps.some((c) => d2(c, p.x, p.y) < 380);
      else go = all.some((q) => q.hp > 0 && q.hp < q.mx * 0.5) || all.some((q) => q.down > 0 && q.down < 1e8);
      if (go && ch(0.8)) hostMsg(p.id, { k: 'cr' });
    }
    B.s += dt; if (B.s > 2) { B.s = 0;
      if (G.obj !== 'e' && rep) { // 팀 살림은 봇 한 명이 대표로 (사람이 직접 해도 돼요)
        let did = false; const n = slotsOpen(G.upg);
        for (let i = 0; i < n && !did; i++) for (let j = 0; j < n && !did; j++) { const A = G.units[i], Bq = G.units[j]; if (i !== j && A && Bq && A.t === Bq.t && A.lv === Bq.lv && Bq.lv < 4) { hostMsg(p.id, { k: 'merge', a: i, b: j }); did = true; } }
        if (!did && G.upg < 5 && G.food >= UPC[G.upg] + 20) { hostMsg(p.id, { k: 'upg' }); did = true; }
        if (!did && G.food >= summonCost() + 20 && G.units.some((x, i) => i < n && !x)) { hostMsg(p.id, { k: 'summon' }); did = true; }
      }
      if (p.cr === 'guard' && G.castle && G.baseHp < G.baseMax * 0.6 && G.food >= G.dif.rc + 30 && (G.repCd || 0) <= 0) hostMsg(p.id, { k: 'rep' }); }
  }
}
function hostTick() { botAI(); if (Net.mode === 'online') { const nw = Date.now(); for (const id of [...G.order]) { const p = G.pl[id]; if (p && p.away && nw - p.away > 180000) { delete G.pl[id]; G.order = G.order.filter((x) => x !== id); if (G.ev) delete G.ev.votes[id]; } } if (G.paused && G.pausedAt && G.order.length > 1 && nw - G.pausedAt > 90000) { G.paused = false; G.pausedAt = 0; } }
  const now = performance.now(); let dt = Math.min(0.1, (now - lastT) / 1000); lastT = now; if (G.ph === 'battle') { stepBattle(dt); if (FAST && window.__ff) {} } }
function hostBroadcast() { const s = makeSnap(); V = s; if (Net.mode === 'online') Net.send('all', { s }); G.shots = []; G.fx = []; }

// ----- 입력 -----
function setupInput() {
  { let pv = 0; $('volSfx').oninput = function () { ST.sv = +this.value; saveSt(); applyVol(); const n = performance.now(); if (n - pv > 160) { pv = n; SFX.init(); SFX.p('gun'); } }; $('volBgm').oninput = function () { ST.bv = +this.value; saveSt(); applyVol(); }; }
  document.querySelectorAll('#setBox [data-k]').forEach((b) => b.onclick = () => { ST[b.dataset.k] = b.dataset.v; if (b.dataset.k === 'q') autoLow = false; saveSt(); applySt(); });
  $('btnPause').onpointerdown = () => sendHost({ k: 'pause', v: true }); $('pResume').onclick = () => sendHost({ k: 'pause', v: false });
  $('pHelp').onclick = () => openTut(); $('setHelp').onclick = () => { $('setBox').classList.remove('on'); openTut(); };
  $('tutNext').onclick = () => tutGo(1); $('tutPrev').onclick = () => tutGo(-1); $('tutSkip').onclick = () => closeTut();
  $('btnGear').onpointerdown = () => $('setBox').classList.toggle('on'); $('btnGearL').onclick = () => $('setBox').classList.toggle('on'); $('setClose').onclick = () => $('setBox').classList.remove('on');
  const z = $('joyZone'), knob = $('joyKnob'), ring = $('joyRing');
  const pt = (e) => { const r = $('stage').getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
  z.addEventListener('pointerdown', (e) => { z.setPointerCapture(e.pointerId); const [x, y] = pt(e); joy = { on: true, id: e.pointerId, ox: x, oy: y, x, y }; ring.style.display = knob.style.display = 'block'; ring.style.left = x - JR + 'px'; ring.style.top = y - JR + 'px'; knob.style.left = x - 24 + 'px'; knob.style.top = y - 24 + 'px'; });
  z.addEventListener('pointermove', (e) => { if (!joy.on || e.pointerId !== joy.id) return; const [x, y] = pt(e); joy.x = x; joy.y = y; let dx = x - joy.ox, dy = y - joy.oy; const l = Math.hypot(dx, dy); if (l > JR) { dx *= JR / l; dy *= JR / l; } knob.style.left = joy.ox + dx - 24 + 'px'; knob.style.top = joy.oy + dy - 24 + 'px'; });
  const up = (e) => { if (e.pointerId !== joy.id) return; joy.on = false; ring.style.display = knob.style.display = 'none'; };
  z.addEventListener('pointerup', up); z.addEventListener('pointercancel', up);
  addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = 1; if (e.key === ' ') sendHost({ k: 'skill' }); if (e.key === 'Enter') sendHost({ k: 'summon' }); });
  addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = 0; });
  $('btnSummon').onpointerdown = () => sendHost({ k: 'summon' }); $('btnUp').onpointerdown = () => sendHost({ k: 'upg' }); $('btnRep').onpointerdown = () => sendHost({ k: 'rep' });
  $('btnSkill').onpointerdown = () => sendHost({ k: 'skill' });
  $('btnCr').onpointerdown = () => sendHost({ k: 'cr' });
  $('cv').addEventListener('pointerdown', (e) => { if (!V || V.ph !== 'battle') return; const [px, py] = pt(e), x = px / Z + cam.x, y = py / Z + cam.y; let hit = -1, bd = 34; for (let i = 0; i < (V.slots || 8); i++) { const s = slotPos(i, V.ax, V.ay), d = Math.hypot(s[0] - x, s[1] - 6 - y); if (d < bd) { bd = d; hit = i; } }
    if (hit < 0) { sel = -1; return; }
    if (sel < 0) { if (V.un && V.un[hit]) sel = hit; } else { if (sel !== hit) sendHost({ k: 'merge', a: sel, b: hit }); sel = -1; } });
  $('btnCw').onclick = () => openCw(); $('cwClose').onclick = () => $('cwBox').classList.remove('on'); $('btnDex').onclick = () => buildBook('syn'); $('btnPas').onclick = () => buildBook('pas'); $('btnRank').onclick = () => buildBook('daily'); $('bookBack').onclick = () => show('sLobby'); document.querySelectorAll('#bookTabs button[data-t]').forEach((b) => b.onclick = () => buildBook(b.dataset.t)); $('btnEndless').onclick = () => hostCtl('endless'); $('btnNext').onclick = () => hostCtl('next'); $('btnRetry').onclick = () => hostCtl('retry'); $('btnSkip').onclick = () => hostCtl('skip');
  $('btnFight').onclick = () => hostCtl('fight'); $('btnHome').onclick = () => { if (confirmLeave()) { LASTROOM.clear(); location.reload(); } };
}
function sendMove() {
  let mx = 0, my = 0;
  if (joy.on) { mx = (joy.x - joy.ox) / JR; my = (joy.y - joy.oy) / JR; }
  if (keys.a || keys.arrowleft) mx -= 1; if (keys.d || keys.arrowright) mx += 1; if (keys.w || keys.arrowup) my -= 1; if (keys.s || keys.arrowdown) my += 1;
  const l = Math.hypot(mx, my); if (l > 1) { mx /= l; my /= l; } if (l < 0.18 && !(keys.a || keys.d || keys.w || keys.s)) { mx = 0; my = 0; }
  if (Math.abs(mx - lastIn[0]) > 0.04 || Math.abs(my - lastIn[1]) > 0.04) { lastIn = [mx, my]; sendHost({ k: 'in', mx, my }); }
}

// ----- 화면 갱신 (단계가 바뀔 때만 DOM 재구성) -----
function myP() { return V && V.pl.find((p) => p.id === Net.id); }
function syncUI() {
  if (!V) return;
  const key = V.ph + ':' + V.rd + ':' + (V.res ? V.res.win : '');
  if (V.ph === 'lobby') {
    { const n = V.pl.length, CO = COOP[Math.min(4, n) - 1]; $('coopInfo').innerHTML = n > 1 ? `👥 <b>${n}명 협동</b> · 적이 더 단단해지고(체력 ×${CO.h}) 정예${CO.gen ? '와 적장' : ''}이 더 자주 나와요` : '🙋 혼자 하기 · 사람이 늘수록 적이 더 단단해지고 정예·적장이 늘어요'; } $('plist').innerHTML = V.pl.map((p) => `<li>${p.id === Net.id && titleOf() ? '<small>[' + esc(titleOf()) + ']</small> ' : ''}<b>${esc(p.name)}</b> <span style="color:${ROLE[p.role].c}">${ROLE[p.role].n}</span>${p.id === Net.id ? ' (나)' : ''}</li>`).join('');
    if (lastPh !== 'lobby') show('sRoom');
  } else if (lastPh !== V.ph || lastRd !== V.rd) {
    if (V.ph === 'brief') buildBrief(); else if (V.ph === 'battle') { show('sBattle'); } else if (V.ph === 'result') buildResult(); else if (V.ph === 'end') buildEnd();
  }
  if (V.ph === 'lobby' && Net.host) { $('btnStart').disabled = false; }
  if (V.ph === 'result') updateResult(); if (V.ph === 'brief') updateBrief();
  if (V.ph === 'battle') updateHUD();
  if (lastPh !== V.ph) RP.clear();
  lastPh = V.ph; lastRd = V.rd;
}
const TUT = [
  ['🎯 라운드마다 목표가 달라요', '🏯 성을 지켜라 · 🚩 탈출하라 · ⏳ 끝까지 버텨라<br>⚔️ 적장을 쓰러뜨려라 · 🔥 보급창고를 부숴라<br><small>역사 속 전투 모습에 맞춰 목표가 바뀌어요.</small>'],
  ['🕹 움직이기와 공격', '화면 왼쪽을 누르고 끌면 영웅이 움직여요.<br>영웅은 가까운 적을 <b>자동으로 공격</b>해요.<br><small>조총·활 병사의 탄환은 날아오는 게 보여요 — 움직여서 피하세요! 영웅마다 공격 방식이 달라요 — 궁수는 관통, 의병은 베기, 승병은 튕겨내기, 화포수는 폭발!</small>'],
  ['🛡 병력 소집과 합치기', '<b>소집</b> 버튼으로 군량을 써서 병사를 불러요.<br>같은 병사 두 명을 차례로 누르면 <b>합쳐져서 더 강해져요.</b><br><small>🌾 군량은 적을 쓰러뜨리거나 상자를 열면 얻어요.</small>'],
  ['⭐ 레벨업과 무기 키우기', '적을 쓰러뜨리면 <b>조선인의 혼</b>(파란 불꽃)이 떨어져요. 가까이 가서 먹으면 레벨업!<br>📜 공명첩을 주우면 곡식이 늘어요.<br>레벨이 오르면 카드를 골라요 — 새 무기를 얻거나 무기를 <b>레벨 5까지</b> 키울 수 있어요.<br><small>창 찌르기 · 환도 · 편곤 · 불경 · 비격진천뢰 · 화차 (무기는 최대 4가지) · 징 · 말 · 능력 카드</small>'],
  ['🏯 성과 진영 강화', '<b>성 강화</b>(또는 진영 강화)는 군량으로 5번까지 올려요.<br>성 체력이 늘고 성이 화살을 쏘거나, 병사가 더 세지고 병사 칸이 늘어요.<br><small>📜 전투가 끝나면 역사 이야기와 퀴즈가 나와요. 퀴즈를 맞히면 군량이 늘어요!</small>']
];
let tutI = 0;
function openTut() { tutI = 0; $('tutBox').classList.add('on'); tutGo(0); }
function closeTut() { $('tutBox').classList.remove('on'); try { localStorage.setItem('jd_tut', '1'); } catch (e) {} }
function tutGo(d) { tutI += d; if (tutI >= TUT.length) { closeTut(); return; } if (tutI < 0) tutI = 0; const [h, b] = TUT[tutI]; $('tutH').innerHTML = h; $('tutB').innerHTML = b; $('tutPg').textContent = (tutI + 1) + ' / ' + TUT.length; $('tutNext').textContent = tutI === TUT.length - 1 ? '시작하기!' : '다음 ▶'; $('tutPrev').style.visibility = tutI ? 'visible' : 'hidden'; }
function buildBrief() {
  const r = R[V.rd], ch = CH[r.ch], s = SRC[r.src]; const first = r.ch !== (V.rd ? R[V.rd - 1].ch : -1);
  const idx = R.filter((x, i) => x.ch === r.ch && i <= V.rd).length, tot = R.filter((x) => x.ch === r.ch).length;
  $('bkChap').textContent = V.endless ? `♾ 무한 모드 · 라운드당 1분 · 99라운드까지` : `${ch.n} (${ch.y}) · ${idx}/${tot}라운드`;
  $('bkName').textContent = r.nm; $('bkPlace').textContent = `${r.pl} · ${r.yr}년`;
  $('bkSrc').innerHTML = '';
  $('bkText').textContent = (V.endless ? '♾ 무한 모드: 한 전장에서 라운드마다 1분씩, 99라운드까지 이어져요. 라운드가 오를수록 적이 강해지고 적장이 더 자주 나와요. 레벨과 카드는 계속 쌓이고, 가끔 밤이 와요. 99라운드에는 최종 보스가 기다려요!\n\n' : '') + (first ? ch.sum + '\n\n' : '') + r.b;
  const cl = CLUE[r.cl]; $('bkClue').innerHTML = `<b>힌트</b> ${cl.t}<br><small>${cl.d}</small>`;
  const ob = V.obj || ROUND_OBJ[V.rd], OI = OBJINFO[ob]; $('bkGoal').innerHTML = V.cm ? '<b>🎲 이번 시나리오: 비밀!</b><br><small>전투가 시작되면 알려줘요. 어떤 임무가 걸릴지 아무도 몰라요 — 5분 단판 승부!</small>' : `<b>${OI.ic} 이번 목표: ${OI.n}</b>${V.sg && SIGD[V.sg] && !V.endless ? '<br><b style="color:#8a4b00">' + SIGD[V.sg][0] + ' 이번 판 특징: ' + SIGD[V.sg][1] + '</b> <small>— ' + SIGD[V.sg][2] + '</small>' : ''}<br><small>${objText(V.rd, V.obj || ob)}${r.df ? ' (역사에서는 어려웠던 싸움! 시간을 벌면 성공이에요)' : ''}</small>` + (V.mod ? `<br><small style="color:#7a4a00">${MODS[V.mod][0]} 전장 변수 · <b>${MODS[V.mod][1]}</b> — ${MODS[V.mod][2]}</small>` : '');
  $('bkMap').style.background = `linear-gradient(135deg, #cfe9b8, #a9d4a0)`; $('bkMap').innerHTML = `<div style="font-size:54px;line-height:90px;text-align:center">${OI.ic}</div>`;
  $('bqText').textContent = '📝 퀴즈! ' + r.q[0]; $('bqOpts').innerHTML = r.q[1].map((o, i) => `<button class="qo" data-i="${i}">${esc(o)}</button>`).join(''); $('bqWhy').textContent = '';
  document.querySelectorAll('#bqOpts .qo').forEach((b) => b.onclick = () => { if (b.disabled) return; sendHost({ k: 'ans', i: +b.dataset.i }); });
  $('btnFight').style.display = Net.host ? 'inline-block' : 'none'; $('bkWait').style.display = Net.host ? 'none' : 'block';
  show('sBrief'); { let seen = '1'; try { seen = localStorage.getItem('jd_tut') || ''; } catch (e) {} if (!seen) openTut(); }
}
function buildResult() {
  recordResult();
  const r = R[V.rd], win = V.res.win; show('sResult'); $('sResult').scrollTop = 0;
  $('rsTitle').textContent = win ? (r.df ? '버텨 냈어요!' : '승리!') : (V.res.cmf ? ({ b: '봉화를 못 올렸어요…', r: '시간 안에 못 부쉈어요…' }[V.res.cmk] || '보급기지를 못 부쉈어요…') : '거점이 무너졌어요…');
  $('rsTitle').style.color = win ? '#2f6b2a' : '#a8322a';
  { const rw = $('rsReward'), c = cwCredit(); if (c) { rw.style.display = 'block'; const tn = c.tg ? LEG[c.tg].n : '', tl = c.tgNow ? ` (${c.have}/${LEG[c.tgNow].need})` : ''; rw.innerHTML = `🎁 협동 보상 · 🎟 뽑기권 +${c.tk}${c.sh ? ` · 🧩 ${tn ? tn + ' 조각' : '(전설 완성→뽑기권으로)'} +${c.sh}${tn ? tl : ''}` : ''}${c.un ? `<br>🌟 전설 영웅 ${LEG[c.un].n} 해금!` : ''}<br><small>보관함에서 뽑기를 해 보세요!</small>`; } else rw.style.display = 'none'; }
  { const nx = R[V.rd + 1], ch = CH[r.ch];
    const SRCT = { '교': '📗 교과서', '지': '📘 지도서', '보': '📙 교과서 밖 보충 · 선생님과 확인해요' }, TH = { mount: '⛰️', sea: '🌊', plain: '🌾', river: '🏞️' };
    const FIC = { d: '영웅을 소환하고 카드로 강해지며 성을 지키는 것은 게임을 위해 만든 규칙이에요.', e: '달려서 탈출하는 임무는 게임용 연출이에요.', s: '제한 시간 동안 버티는 방식과 영웅·카드는 게임을 위해 만든 규칙이에요.', r: '보급창고를 부수는 임무는 게임을 위해 만든 규칙이에요.', b: '적장과의 일기토(1:1 대결)와 장수의 공격 모습은 게임용 연출이에요.' };
    $('rsHist').innerHTML = `<div class="rv"><div class="rvh">${TH[r.th] || '📜'} 역사 한 컷 <small>${esc(r.pl)} · ${r.yr}년</small></div>`
      + `<div class="rvs"><b>${esc(r.nm)}</b> — ${esc(ch.n)}(${esc(ch.y)}) <span class="rvtag">${SRCT[r.src] || ''}</span></div>`
      + `<div class="rvf ok">✅ <b>실제 역사</b><br>${esc(r.r)}</div>`
      + `<div class="rvf fic">🎮 <b>게임 속 설정</b> <small>(실제와 달라요)</small><br>${esc(FIC[ROUND_OBJ[V.rd]] || '')}${r.df ? ' 실제 역사에서 이 전투는 조선에게 어려운 싸움이었고, 게임에서는 \'시간 벌기\'로 표현했어요.' : ''}</div>`
      + `<div class="rvq"><b>🔑 꼭 기억해요</b><br>${esc(r.q[0])}<br>👉 <b>${esc(r.q[1][r.q[2]])}</b> — ${esc(r.q[3])}</div>`
      + (win && nx ? `<div class="rvn">▶ 다음 전투: <b>${esc(nx.nm)}</b> (${esc(nx.pl)} · ${nx.yr}년)</div>` : '') + `</div>`; }
  $('qText').textContent = '퀴즈! ' + r.q[0];
  $('qOpts').innerHTML = r.q[1].map((o, i) => `<button class="qo" data-i="${i}">${esc(o)}</button>`).join('');
  document.querySelectorAll('.qo').forEach((b) => b.onclick = () => { if (b.disabled) return; sendHost({ k: 'ans', i: +b.dataset.i }); });
  { const me = V.pl.find((x) => x.id === Net.id), box = $('merBox'); if (win && me && me.mo && me.mo.length) { box.style.display = 'block'; box.innerHTML = '<div style="font-weight:bold;margin-bottom:4px">🎖 공훈을 1개 골라요 <small>(다음 라운드부터 계속 쌓여요)</small></div><div class="row">' + me.mo.map((k, i) => `<button class="sec merb" data-i="${i}">${MER[k][0]} ${MER[k][1]}<br><small>${MER[k][2]} · 지금 Lv.${(me.mer && me.mer[k]) || 0}</small></button>`).join('') + '</div>'; box.querySelectorAll('.merb').forEach((b) => b.onclick = () => { sendHost({ k: 'mer', i: +b.dataset.i }); box.innerHTML = '<div>🎖 공훈을 받았어요!</div>'; }); } else box.style.display = 'none'; }
  $('qBox').style.display = 'none'; $('rsSave').style.display = (Net.mode === 'single') ? 'inline-block' : 'none';
  $('qWhy').textContent = '';
  $('rsHost').style.display = Net.host ? 'block' : 'none';
  $('btnNext').style.display = (win || V.cm) ? 'inline-block' : 'none'; $('btnRetry').style.display = (!win || V.cm) ? 'inline-block' : 'none';
  $('btnSkip').style.display = (!win && r.df) ? 'inline-block' : 'none';
  $('rsWait').style.display = Net.host ? 'none' : 'block';
  // 읽기 시간 강제: 10초 동안 버튼이 잠겨요
  clearInterval(rvTm); let left = FAST ? 1 : 10; const L = [['btnNext', V.cm ? '🎲 새 시나리오 한 판 더' : '다음 라운드'], ['btnRetry', V.cm ? '같은 시나리오 다시' : '다시 도전'], ['btnSkip', '역사 확인했으니 다음으로']];
  const paint = () => { for (const [id, tx] of L) { const b = $(id); b.disabled = left > 0; b.textContent = left > 0 ? `📖 읽는 중… ${left}` : tx; } };
  paint(); rvTm = setInterval(() => { left--; paint(); if (left <= 0) clearInterval(rvTm); }, 1000);
}
let rvTm = 0;
function updateBrief() {
  const r = R[V.rd], mine = V.ans ? V.ans[Net.id] : null, n = Object.keys(V.ans || {}).length;
  document.querySelectorAll('#bqOpts .qo').forEach((b) => { const i = +b.dataset.i; if (mine != null) { b.disabled = true; b.classList.toggle('ok', i === r.q[2]); b.classList.toggle('no', i === mine && i !== r.q[2]); } });
  $('bqWhy').innerHTML = mine != null ? `${mine === r.q[2] ? '⭕ 정답!' : '❌ 아쉬워요'} ${esc(r.q[3])}<br><small>답한 친구 ${n}/${V.pl.length}명 · 정답자 1명당 이번 판 군량 +15</small>` : `<small>배경을 읽고 퀴즈를 풀면 전투를 시작할 수 있어요 (답한 친구 ${n}/${V.pl.length}명)</small>`;
  { const nb = V.pl.filter((x) => !x.bt && !(V.ans && V.ans[x.id] != null)).map((x) => x.name); if (V.pl.length > 1 && nb.length && V.ph === 'brief') $('bqWhy').innerHTML += `<br><small>⏳ 아직 안 푼 친구: ${nb.map(esc).join(', ')}</small>`; }
  $('btnFight').disabled = mine == null; $('btnFight').textContent = mine == null ? '퀴즈를 풀면 시작!' : '전투 시작!';
}
function updateResult() {
  const r = R[V.rd]; if (true) return; const mine = V.ans ? V.ans[Net.id] : null; const n = Object.keys(V.ans || {}).length;
  document.querySelectorAll('.qo').forEach((b) => { const i = +b.dataset.i; if (mine != null) { b.disabled = true; b.classList.toggle('ok', i === r.q[2]); b.classList.toggle('no', i === mine && i !== r.q[2]); } });
  $('qWhy').innerHTML = mine != null ? `${mine === r.q[2] ? '⭕ 정답!' : '❌ 아쉬워요'} ${esc(r.q[3])}<br><small>답한 친구 ${n}/${V.pl.length}명 · 정답자 1명당 다음 판 군량 +15</small>` : `<small>답한 친구 ${n}/${V.pl.length}명</small>`;
}
const LEG = { gwonyul: { need: 10, n: '권율', btn: 'roleLeg' }, gimsimin: { need: 12, n: '김시민', btn: 'roleLeg2' }, gwakjaeu: { need: 12, n: '곽재우', btn: 'roleLeg3' }, hyujeong: { need: 12, n: '휴정', btn: 'roleLeg4' }, yujeong: { need: 14, n: '유정', btn: 'roleLeg5' }, jinrin: { need: 14, n: '진린', btn: 'roleLeg6' } };
// ----- 영웅 꾸미기 이펙트 (후광: 발밑 고리+입자·날개 / 이동 흔적: 걸을 때 남는 자국) -----
const RB = (t, i) => { const s = Math.sin(t * 12.9898 + i * 78.233) * 43758.5453; return s - Math.floor(s); };
function ptc(cx, x, y, r, col, al) { cx.globalAlpha = Math.max(0, al); cx.fillStyle = col; cx.beginPath(); cx.arc(x, y, Math.max(0.5, r), 0, 7); cx.fill(); }
function star4(cx, x, y, r, col, al) { cx.globalAlpha = Math.max(0, al); cx.fillStyle = col; cx.beginPath(); cx.moveTo(x, y - r); cx.lineTo(x + r * 0.28, y - r * 0.28); cx.lineTo(x + r, y); cx.lineTo(x + r * 0.28, y + r * 0.28); cx.lineTo(x, y + r); cx.lineTo(x - r * 0.28, y + r * 0.28); cx.lineTo(x - r, y); cx.lineTo(x - r * 0.28, y - r * 0.28); cx.closePath(); cx.fill(); }
function wings(cx, x, y, tm, c1, c2, big) { const fl = Math.sin(tm * 3.2) * 0.22, S = big ? 1.25 : 1; cx.save(); for (const sd of [-1, 1]) { cx.save(); cx.translate(x + sd * 8, y - 30); cx.scale(sd * S, S); cx.rotate(-0.35 + fl); for (let f = 0; f < 4; f++) { const L = 46 - f * 7, a = -0.15 + f * 0.3; cx.globalAlpha = 0.82; cx.fillStyle = f % 2 ? c2 : c1; cx.strokeStyle = 'rgba(255,255,255,.7)'; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(0, 0); cx.quadraticCurveTo(L * 0.5, -14 + f * 5 - 4, L, -6 + f * 11); cx.quadraticCurveTo(L * 0.5, 4 + f * 5, 0, 5); cx.closePath(); cx.save(); cx.rotate(a * 0.4); cx.fill(); cx.stroke(); cx.restore(); } cx.restore(); } cx.restore(); }
function drawAura(cx, A, x, fy, tm, LOW, ring, SC) {
  if (!A) return; const r = A.r || 0, pu = r ? 1 + 0.12 * Math.sin(tm * 4) : 1, fx = A.fx || '', n = (k) => (LOW ? Math.ceil(k / 2) : k);
  cx.save(); { const S = SC || 1.5; cx.translate(x, fy); cx.scale(S, S); cx.translate(-x, -fy); }
  if (fx === 'wing' || fx === 'phx') wings(cx, x, fy, tm, fx === 'phx' ? '#ff7a2a' : '#ffe27a', fx === 'phx' ? '#ffd24a' : '#fff6c0', fx === 'phx');
  if (fx === 'rain') { for (let k = 0; k < 3; k++) { cx.globalAlpha = 0.85; cx.strokeStyle = 'hsl(' + ((tm * 120 + k * 60) % 360) + ',90%,60%)'; cx.lineWidth = 3.5; cx.beginPath(); cx.ellipse(x, fy, (26 + k * 7) * pu, (10 + k * 3) * pu, 0, 0, 7); cx.stroke(); } }
  else if (ring !== false) { cx.strokeStyle = A.c; cx.lineWidth = r === 2 ? 5 : 3.5; cx.globalAlpha = 0.85; cx.beginPath(); cx.ellipse(x, fy, 30 * pu, 12 * pu, 0, 0, 7); cx.stroke(); if (r >= 1) { cx.globalAlpha = 0.3; cx.fillStyle = A.c; cx.fill(); } if (r === 2) { cx.globalAlpha = 0.9; cx.beginPath(); cx.ellipse(x, fy, 40 * pu, 16 * pu, 0, 0, 7); cx.stroke(); } }
  if (fx === 'flame' || fx === 'phx') for (let k = 0; k < n(8); k++) { const ph = (tm * 1.3 + k / 8) % 1, a = k * 2.4 + tm * 0.6; ptc(cx, x + Math.cos(a) * 26 * (1 - ph * 0.4), fy + Math.sin(a) * 9 - ph * 52, (1 - ph) * 7 + 1, ph < 0.5 ? '#ffd24a' : '#ff4a1a', 1 - ph); }
  if (fx === 'frost') for (let k = 0; k < n(7); k++) { const a = tm * 1.1 + k * 0.9, ph = (tm * 0.5 + k / 7) % 1; star4(cx, x + Math.cos(a) * 30, fy - 8 - ph * 44 + Math.sin(a) * 6, 4 + (k % 3), '#e6fbff', 1 - ph * 0.6); }
  if (fx === 'bolt' || fx === 'storm') { const sd = Math.floor(tm * (fx === 'storm' ? 7 : 4)); if (RB(sd, 1) > 0.35 || fx === 'storm') for (let b = 0; b < (fx === 'storm' ? 2 : 1); b++) { let px = x + (RB(sd, 2 + b) - 0.5) * 60, py = fy - 78; cx.globalAlpha = 0.95; cx.strokeStyle = fx === 'storm' ? '#cfe4ff' : '#ffe14a'; cx.lineWidth = 2.5; cx.beginPath(); cx.moveTo(px, py); for (let s = 0; s < 5; s++) { px += (RB(sd, 5 + s + b * 9) - 0.5) * 22; py += 17; cx.lineTo(px, py); } cx.stroke(); } if (fx === 'storm') { cx.globalAlpha = 0.55; cx.fillStyle = '#56607a'; cx.beginPath(); cx.ellipse(x, fy - 82, 30, 9, 0, 0, 7); cx.ellipse(x - 14, fy - 78, 16, 7, 0, 0, 7); cx.ellipse(x + 15, fy - 78, 16, 7, 0, 0, 7); cx.fill(); } }
  if (fx === 'petal' || fx === 'leaf') for (let k = 0; k < n(7); k++) { const ph = (tm * 0.45 + k / 7) % 1, up = fx === 'leaf'; cx.save(); cx.globalAlpha = 1 - ph * 0.7; cx.fillStyle = up ? (k % 2 ? '#6fd07d' : '#a6e58a') : (k % 2 ? '#ffb3cf' : '#ffd6e6'); cx.translate(x + Math.sin(tm * 1.6 + k * 1.7) * 32, up ? fy - 6 - ph * 56 : fy - 66 + ph * 62); cx.rotate(tm * 2 + k); cx.beginPath(); cx.ellipse(0, 0, 5, 2.6, 0, 0, 7); cx.fill(); cx.restore(); }
  if (fx === 'star') for (let k = 0; k < n(6); k++) { const tw = 0.5 + 0.5 * Math.sin(tm * 4 + k * 2); star4(cx, x + Math.cos(tm * 0.8 + k * 1.05) * 34, fy - 6 - ((k * 13 + tm * 14) % 60), 3 + tw * 3, k % 2 ? '#fff6a8' : '#ffffff', 0.4 + tw * 0.6); }
  if (fx === 'orb') for (let k = 0; k < 3; k++) { const a = tm * 2.2 + k * 2.09, ox = x + Math.cos(a) * 36, oy = fy - 24 + Math.sin(a) * 14 - 8; for (let t = 1; t <= 4; t++) { const a2 = a - t * 0.18; ptc(cx, x + Math.cos(a2) * 36, fy - 32 + Math.sin(a2) * 14, 5 - t, A.c, 0.35 - t * 0.07); } ptc(cx, ox, oy, 6, A.c, 0.95); ptc(cx, ox, oy, 3, '#fff', 0.9); }
  if (fx === 'moon') { cx.globalAlpha = 0.22 + 0.1 * Math.sin(tm * 2); cx.fillStyle = '#dfe8ff'; cx.beginPath(); cx.arc(x, fy - 74, 18, 0, 7); cx.fill(); cx.globalAlpha = 0.95; cx.fillStyle = '#fff3b0'; cx.beginPath(); cx.arc(x, fy - 74, 9, 0.5 * Math.PI, 1.5 * Math.PI); cx.arc(x - 3, fy - 74, 7, 1.5 * Math.PI, 0.5 * Math.PI, true); cx.fill(); }
  if (fx === 'wave') for (let k = 0; k < 3; k++) { const ph = (tm * 0.7 + k / 3) % 1; cx.globalAlpha = (1 - ph) * 0.8; cx.strokeStyle = '#7fd4ff'; cx.lineWidth = 2.5; cx.beginPath(); cx.ellipse(x, fy, 18 + ph * 34, 7 + ph * 13, 0, 0, 7); cx.stroke(); }
  if (fx === 'wing' && !LOW) for (let k = 0; k < 5; k++) { const ph = (tm * 0.9 + k / 5) % 1; star4(cx, x + Math.sin(k * 3.1 + tm) * 30, fy - 20 - ph * 50, 3 + (k % 3), '#fff3a0', 1 - ph); }
  cx.restore();
}
// 이동 흔적: 걸을 때 발밑에 남는 자국 (화면 쪽 기억만 쓰고 서버로 보내지 않아요)
const TRL = {};
function trailTick(key, x, y, A, tm, LOW) {
  let T = TRL[key]; if (!T) T = TRL[key] = { x, y, ps: [], last: 0 };
  const d = Math.hypot(x - T.x, y - T.y); T.x = x; T.y = y;
  if (A && d > 1.2 && d < 90 && tm - T.last > (LOW ? 0.09 : 0.045)) { T.last = tm; T.ps.push({ x: x + (Math.random() - 0.5) * 8, y: y + (Math.random() - 0.5) * 4, t: tm, s: Math.random(), k: A.fx }); if (T.ps.length > (LOW ? 14 : 30)) T.ps.shift(); }
  T.ps = T.ps.filter((q) => tm - q.t < 1.1);
}
function trailDraw(cx, key, A, tm, SC) {
  const T = TRL[key]; if (!T || !T.ps.length) return; cx.save();
  for (const q of T.ps) { const a = (tm - q.t) / 1.1, k = q.k; cx.save(); cx.translate(q.x, q.y); cx.scale(SC || 1.6, SC || 1.6); cx.translate(-q.x, -q.y);
    if (k === 'tdust') ptc(cx, q.x, q.y - a * 6, 3 + a * 8, '#c9b48a', 0.5 * (1 - a));
    else if (k === 'tleaf') { cx.save(); cx.globalAlpha = 1 - a; cx.fillStyle = q.s > 0.5 ? '#6fd07d' : '#a6e58a'; cx.translate(q.x + Math.sin(a * 6 + q.s * 9) * 6, q.y - a * 14); cx.rotate(q.s * 6 + a * 4); cx.beginPath(); cx.ellipse(0, 0, 5, 2.6, 0, 0, 7); cx.fill(); cx.restore(); }
    else if (k === 'tspark') { ptc(cx, q.x + (q.s - 0.5) * 20 * a, q.y - a * 30, 4 * (1 - a) + 1, a < 0.4 ? '#ffe27a' : '#ff6a2a', 1 - a); }
    else if (k === 'tpetal') { cx.save(); cx.globalAlpha = 1 - a; cx.fillStyle = q.s > 0.5 ? '#ffb3cf' : '#ffd6e6'; cx.translate(q.x + Math.sin(a * 5 + q.s * 7) * 8, q.y - 8 + a * 10); cx.rotate(q.s * 6 + a * 5); cx.beginPath(); cx.ellipse(0, 0, 5.5, 3, 0, 0, 7); cx.fill(); cx.restore(); }
    else if (k === 'tfrost') star4(cx, q.x, q.y - a * 8, 6 * (1 - a * 0.5), q.s > 0.5 ? '#e6fbff' : '#8fe9ff', 1 - a);
    else if (k === 'train') ptc(cx, q.x, q.y, 8 * (1 - a * 0.6), 'hsl(' + ((q.t * 160 + q.s * 40) % 360) + ',90%,60%)', 0.85 * (1 - a));
    else if (k === 'tgold') { ptc(cx, q.x, q.y, 7 * (1 - a * 0.5), '#ffd24a', 0.55 * (1 - a)); star4(cx, q.x + (q.s - 0.5) * 18, q.y - a * 26, 4 + q.s * 3, '#fff6c0', 1 - a); }
    else ptc(cx, q.x, q.y, 5 * (1 - a), A.c, 1 - a); cx.restore(); }
  cx.restore();
}

// ----- 업적으로 얻는 꾸미기: 레벨업 연출(LVF)·이름표 테두리(BRD) -----
const LVF = { l_spark: '불꽃놀이', l_gold: '황금 폭죽', l_petal: '꽃비', l_bolt: '번개 기둥', l_star: '별무리', l_snow: '눈꽃', l_dragon: '용 승천', l_rain: '무지개 파동' };
const BRD = { b_wood: '나무 테두리', b_leaf: '풀잎 테두리', b_bolt: '번개 테두리', b_flame: '불꽃 테두리', b_gold: '황금 테두리', b_sea: '푸른 바다 테두리', b_ink: '먹 테두리', b_ice: '얼음 테두리', b_crimson: '붉은 테두리', b_rain: '무지개 테두리' };
const ACHRW = { first: 'b_wood', w10: 'l_spark', w30: 'l_gold', sm5: 'b_leaf', sm25: 'l_petal', stk: 'b_bolt', du3: 'l_bolt', du10: 'b_flame', q30: 'l_star', q100: 'b_gold', coop: 'l_snow', hard: 'l_dragon', c0: 'b_sea', c1: 'b_ink', c2: 'b_ice', c3: 'b_crimson', d1: 'l_rain', d3: 'b_rain' };
const rwName = (k) => LVF[k] ? '레벨업 연출 「' + LVF[k] + '」' : '이름표 테두리 「' + BRD[k] + '」';
function myCos() { const d = achLoad(), has = (k) => ACH.some((a) => ACHRW[a[0]] === k && d.ok[a[0]]); return { lf: d.lf && LVF[d.lf] && has(d.lf) ? d.lf : '', bd: d.bd && BRD[d.bd] && has(d.bd) ? d.bd : '' }; }
// 레벨업 연출 그리기 (t: 0→1, sc: 크기, big: 내 것은 입자 더 많이)
function drawLvFx(c, k, x, y, t, sc, big) {
  const fa = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3, n = (m) => (big ? m : Math.ceil(m / 2)); c.save(); c.translate(x, y); c.scale(sc, sc); c.globalAlpha = fa;
  if (k === 'l_spark') { for (let i = 0; i < n(14); i++) { const a = i * 0.45 + RB(i, 1) * 0.4, v = 60 + RB(i, 2) * 60; ptc(c, Math.cos(a) * v * t, -Math.sin(a * 0.5 + 0.8) * v * t * 1.2 + 90 * t * t - 20, 4 * (1 - t) + 1, i % 2 ? '#ffd24a' : '#ff6a2a', fa); } }
  else if (k === 'l_gold') { c.strokeStyle = '#ffd24a'; c.lineWidth = 4; c.beginPath(); c.ellipse(0, 0, 20 + t * 60, 8 + t * 24, 0, 0, 7); c.stroke(); for (let i = 0; i < n(12); i++) { const a = i * 0.52; ptc(c, Math.cos(a) * 40 * t * (0.6 + RB(i, 3)), -30 - t * 80 * (0.5 + RB(i, 4)) + 40 * t * t, 5 * (1 - t * 0.6), i % 2 ? '#ffd24a' : '#fff3a0', fa); star4(c, Math.cos(a + 1) * 30 * t, -10 - t * 70, 5, '#fff', fa * 0.8); } }
  else if (k === 'l_petal') { for (let i = 0; i < n(12); i++) { c.save(); c.globalAlpha = fa; c.fillStyle = i % 2 ? '#ffb3cf' : '#ffd6e6'; c.translate(Math.sin(t * 5 + i * 1.3) * 34 + (RB(i, 5) - 0.5) * 30, -90 + t * 100 * (0.7 + RB(i, 6) * 0.5)); c.rotate(t * 6 + i); c.beginPath(); c.ellipse(0, 0, 6, 3.2, 0, 0, 7); c.fill(); c.restore(); } }
  else if (k === 'l_bolt') { if (t < 0.45) { c.strokeStyle = '#fff6a8'; c.lineWidth = 4; c.globalAlpha = 1 - t * 1.6; let px = 0, py = -130; c.beginPath(); c.moveTo(px, py); for (let s = 0; s < 8; s++) { px += (RB(Math.floor(t * 18), s) - 0.5) * 22; py += 17; c.lineTo(px, py); } c.stroke(); c.fillStyle = 'rgba(255,255,200,.35)'; c.fillRect(-8, -130, 16, 130); } c.globalAlpha = fa; c.strokeStyle = '#ffe14a'; c.lineWidth = 3.5; c.beginPath(); c.ellipse(0, 0, 14 + t * 50, 6 + t * 20, 0, 0, 7); c.stroke(); }
  else if (k === 'l_star') { for (let i = 0; i < n(10); i++) { const a = i * 0.63 + t * 4, r2 = 12 + t * 56; star4(c, Math.cos(a) * r2, -t * 80 + Math.sin(a) * r2 * 0.4, 4 + (i % 3) * 1.5, i % 2 ? '#fff6a8' : '#ffffff', fa); } }
  else if (k === 'l_snow') { c.strokeStyle = '#bff3ff'; c.lineWidth = 3; c.beginPath(); c.ellipse(0, 0, 14 + t * 54, 6 + t * 22, 0, 0, 7); c.stroke(); for (let i = 0; i < n(12); i++) star4(c, Math.sin(i * 2.1 + t * 3) * 40, -100 + t * 100 * (0.6 + RB(i, 7) * 0.6), 4 + (i % 3), '#e6fbff', fa); }
  else if (k === 'l_dragon') { c.lineCap = 'round'; for (let s = 0; s < 2; s++) { c.strokeStyle = s ? '#fff3a0' : '#4fd08a'; c.lineWidth = s ? 3 : 8; c.beginPath(); for (let i = 0; i <= 22; i++) { const u = i / 22 * Math.min(1, t * 1.6), a = u * 14 + (s ? 0 : 0.0); const px = Math.sin(a) * (26 - u * 8), py = -u * 110; if (i) c.lineTo(px, py); else c.moveTo(px, py); } c.stroke(); } const u = Math.min(1, t * 1.6), a = u * 14; ptc(c, Math.sin(a) * (26 - u * 8), -u * 110, 9, '#ffd24a', fa); ptc(c, Math.sin(a) * (26 - u * 8) + 3, -u * 110 - 2, 2.5, '#222', fa); }
  else if (k === 'l_rain') { for (let i = 0; i < 4; i++) { const u = Math.max(0, t * 1.2 - i * 0.12); if (u <= 0 || u > 1) continue; c.globalAlpha = (1 - u) * fa; c.strokeStyle = 'hsl(' + (i * 70 + t * 200) + ',90%,60%)'; c.lineWidth = 4; c.beginPath(); c.ellipse(0, 0, 14 + u * 66, 6 + u * 27, 0, 0, 7); c.stroke(); } }
  c.restore();
}
// 이름표 테두리 그리기 (알약 모양 이름표 위에 덧그려요)
function drawBorder(c, k, x, y, w, h, tm, full) {
  const r = h / 2, L = x - w / 2, T = y - h / 2; c.save(); c.lineJoin = 'round';
  const path = (pad) => { const l = L - pad, tp = T - pad, ww = w + pad * 2, hh = h + pad * 2, rr0 = hh / 2; c.beginPath(); c.moveTo(l + rr0, tp); c.lineTo(l + ww - rr0, tp); c.arc(l + ww - rr0, tp + rr0, rr0, -1.5708, 1.5708); c.lineTo(l + rr0, tp + hh); c.arc(l + rr0, tp + rr0, rr0, 1.5708, 4.7124); c.closePath(); };
  const stroke = (col, lw, pad, dash, off) => { c.strokeStyle = col; c.lineWidth = lw; if (dash) { c.setLineDash(dash); c.lineDashOffset = off || 0; } path(pad); c.stroke(); c.setLineDash([]); };
  if (k === 'b_wood') { stroke('#7a4a1f', 3.5, 1); stroke('#c98a4a', 1.2, 1); }
  else if (k === 'b_leaf') { stroke('#3f9a4f', 3.2, 1); if (full) for (let i = 0; i < 5; i++) { const lx = L + (i + 0.5) * w / 5; c.fillStyle = '#7fd88a'; c.beginPath(); c.ellipse(lx, T - 2, 4.5, 2.2, (i % 2 ? 0.5 : -0.5), 0, 7); c.fill(); } }
  else if (k === 'b_bolt') { stroke('#c9a800', 3, 1); stroke(Math.sin(tm * 18) > 0 ? '#fff6a8' : '#ffe14a', 2, 1, [6, 8], -tm * 40); if (full && Math.sin(tm * 9) > 0.3) { c.strokeStyle = '#fff6a8'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(L + w * 0.7, T - 3); c.lineTo(L + w * 0.74, T - 9); c.lineTo(L + w * 0.7, T - 11); c.stroke(); } }
  else if (k === 'b_flame') { stroke('#c2400f', 3, 1); stroke('#ffb02e', 1.6, 1); if (full) for (let i = 0; i < 6; i++) { const ph = (tm * 1.4 + i / 6) % 1; ptc(c, L + (i + 0.5) * w / 6 + Math.sin(tm * 6 + i) * 2, T - ph * 11, 3 * (1 - ph) + 0.6, ph < 0.5 ? '#ffd24a' : '#ff4a1a', 1 - ph); } }
  else if (k === 'b_gold') { stroke('#b8860b', 3.5, 1); stroke('#ffe27a', 1.6, 1); const sx = ((tm * 0.8) % 1.4 - 0.2) * w; if (full) { const g2 = c.createLinearGradient(L + sx - 10, 0, L + sx + 10, 0); g2.addColorStop(0, 'rgba(255,255,255,0)'); g2.addColorStop(0.5, 'rgba(255,255,255,.9)'); g2.addColorStop(1, 'rgba(255,255,255,0)'); c.strokeStyle = g2; c.lineWidth = 3.5; path(1); c.stroke(); } }
  else if (k === 'b_sea') { stroke('#1f6fb8', 3, 1); stroke('#9fe0ff', 1.4, 1, [8, 6], -tm * 24); }
  else if (k === 'b_ink') { stroke('#1c1c1c', 4, 1); stroke('#ffffff', 1, 0.5); }
  else if (k === 'b_ice') { stroke('#5ab4e0', 3, 1); stroke('#eafcff', 1.4, 1, [3, 5], 0); if (full) for (let i = 0; i < 4; i++) star4(c, L + (i + 0.5) * w / 4, T - 2 - ((tm * 8 + i * 5) % 6), 3, '#e6fbff', 0.9); }
  else if (k === 'b_crimson') { stroke('#7a0f0f', 3.6, 1.5); stroke('#ff6a5a', 1.4, 0.2); }
  else if (k === 'b_rain') { const g2 = c.createLinearGradient(L, 0, L + w, 0); for (let i = 0; i <= 6; i++) g2.addColorStop(i / 6, 'hsl(' + ((tm * 120 + i * 60) % 360) + ',90%,60%)'); c.strokeStyle = g2; c.lineWidth = 3.6; path(1); c.stroke(); }
  c.restore();
}
// 이름표(알약)를 그리고, 테두리가 있으면 덧그려요
function pillB(c, txt, x, y, bg, fg, bd, tm, full) {
  c.font = 'bold 12px sans-serif'; const w = c.measureText(txt).width + 14; c.fillStyle = bg; { const l = x - w / 2, tp = y - 9, hh = 18, r0 = 9; c.beginPath(); c.moveTo(l + r0, tp); c.arcTo(l + w, tp, l + w, tp + hh, r0); c.arcTo(l + w, tp + hh, l, tp + hh, r0); c.arcTo(l, tp + hh, l, tp, r0); c.arcTo(l, tp, l + w, tp, r0); c.closePath(); } c.fill(); c.fillStyle = fg; c.textAlign = 'center'; c.fillText(txt, x, y + 4.5);
  if (bd && BRD[bd]) drawBorder(c, bd, x, y, w, 18, tm, full);
}
const HAUR = { gwonyul: { c: '#ffb13a', r: 2 }, gimsimin: { c: '#5ab4ff', r: 2 }, admiral: { c: '#7fe6ff', r: 2 }, gwakjaeu: { c: '#ff4a3a', r: 2 }, hyujeong: { c: '#ffe27a', r: 2 }, yujeong: { c: '#c28aff', r: 2 }, jinrin: { c: '#ff9a3a', r: 2 } }; // 전설·히든 영웅 기본 후광
// ----- 라운드 고유 규칙: 지형·병종에 따라 판마다 다른 특징 (게임 규칙이에요) -----
const SIGD = { mount: ['⛰', '산성', '적이 오르막을 올라와서 조금 느려요 (이동 −10%) · 성이 10% 더 튼튼해요'], plain: ['🌾', '넓은 벌판', '적이 많이 몰려오지만(+15%) 경험치를 15% 더 얻어요'], cav: ['🐎', '기병 돌격', '적 기병이 훨씬 자주 나와요! 대신 영웅 이동 속도 +8%'], sea: ['🌊', '바다 전투', '적 궁수·화포병이 늘어나요. 대신 영웅 사거리 +12%'], guer: ['🌲', '유격전', '기습이 더 잦아요! 대신 영웅 공격력 +10%'] };
const FXL = { boss: 1.2, lvl: 1.0, gw: 1.4, hk: 1.2, ks: 1.4, hg: 1.2, hj: 1.4, yj: 6, jr: 1.5 };
for (const k in LVF) FXL['lf_' + k] = 1.5;
const AUR = {
  // 후광 (s 없음) — fx: 입자·날개 이펙트 종류
  a_blue: { n: '파란 기운', r: 0, c: '#6db8ff' }, a_green: { n: '초록 기운', r: 0, c: '#6fd07d' }, a_pink: { n: '분홍 기운', r: 0, c: '#ff9ec4' }, a_white: { n: '하얀 기운', r: 0, c: '#ffffff' }, a_orange: { n: '주황 기운', r: 0, c: '#ffa94d' },
  a_star: { n: '별빛 기운', r: 0, c: '#ffe98a', fx: 'star' }, a_petal: { n: '벚꽃 기운', r: 0, c: '#ffb3cf', fx: 'petal' }, a_leaf: { n: '풀잎 기운', r: 0, c: '#7fd88a', fx: 'leaf' },
  a_fire: { n: '불꽃 기운', r: 1, c: '#ff5a2a', fx: 'flame' }, a_ice: { n: '얼음 기운', r: 1, c: '#8fe9ff', fx: 'frost' }, a_bolt: { n: '번개 기운', r: 1, c: '#ffe14a', fx: 'bolt' },
  a_orb: { n: '구슬 기운', r: 1, c: '#b48aff', fx: 'orb' }, a_rain: { n: '무지개 기운', r: 1, c: '#ff9ad0', fx: 'rain' }, a_moon: { n: '달빛 기운', r: 1, c: '#cfd9ff', fx: 'moon' }, a_wave: { n: '물결 기운', r: 1, c: '#5ab4ff', fx: 'wave' },
  a_gold: { n: '전설의 황금 후광', r: 2, c: '#ffd24a', fx: 'wing' }, a_phx: { n: '전설의 불사조', r: 2, c: '#ff7a2a', fx: 'phx' }, a_storm: { n: '전설의 뇌운', r: 2, c: '#9ec2ff', fx: 'storm' },
  // 이동 흔적 (s: 't') — 걸을 때 발밑에 남아요
  t_dust: { n: '흙먼지 길', r: 0, c: '#c9b48a', fx: 'tdust', s: 't' }, t_leaf: { n: '풀잎 길', r: 0, c: '#6fd07d', fx: 'tleaf', s: 't' },
  t_spark: { n: '불꽃 발자국', r: 1, c: '#ff8a2a', fx: 'tspark', s: 't' }, t_petal: { n: '벚꽃 길', r: 1, c: '#ffb3cf', fx: 'tpetal', s: 't' }, t_frost: { n: '서리 길', r: 1, c: '#8fe9ff', fx: 'tfrost', s: 't' },
  t_rain: { n: '무지개 길', r: 2, c: '#ff9ad0', fx: 'train', s: 't' }, t_gold: { n: '전설의 황금 길', r: 2, c: '#ffd24a', fx: 'tgold', s: 't' } };
const RN = ['일반', '희귀', '전설'], RC = ['#7a6a55', '#2f78c8', '#c98a00'];
function cwLoad() { try { const d = JSON.parse(localStorage.getItem('jd_cw') || 'null'); if (d && typeof d === 'object') return { tk: d.tk | 0, sh: d.sh | 0, own: d.own || {}, cos: Array.isArray(d.cos) ? d.cos : [], eq: AUR[d.eq] && AUR[d.eq].s !== 't' ? d.eq : '', eq2: AUR[d.eq2] && AUR[d.eq2].s === 't' ? d.eq2 : '', pity: d.pity | 0, pity2: d.pity2 | 0, cl: d.cl | 0, ids: Array.isArray(d.ids) ? d.ids : [] }; } catch (e) {} return { tk: 0, sh: 0, own: {}, cos: [], eq: '', eq2: '', pity: 0, pity2: 0, cl: 0, ids: [] }; }
function cwSave(d) { try { localStorage.setItem('jd_cw', JSON.stringify(d)); } catch (e) {} }
function legOK(k) { return !!cwLoad().own[k]; }
function cwTarget(d) { return Object.keys(LEG).find((k) => !d.own[k]) || ''; }
function cwAddSh(d, n) { let un = ''; while (n > 0) { const k = cwTarget(d); if (!k) { d.tk += n; break; } const take = Math.min(n, LEG[k].need - d.sh); d.sh += take; n -= take; if (d.sh >= LEG[k].need) { d.own[k] = 1; d.sh = 0; un = un || k; } } return un; }
const cwShown = {};
function cwCredit() { // 결과 화면에서 이 기기에 보상을 한 번만 넣어요
  const r = V && V.res; if (!r || !r.win || !r.rw || !r.id) return null; if (cwShown[r.id]) return cwShown[r.id];
  const d = cwLoad(); if (d.ids.includes(r.id)) return null; d.ids.push(r.id); if (d.ids.length > 40) d.ids.shift();
  const t0 = cwTarget(d), un = cwAddSh(d, r.rw.sh); d.tk += r.rw.tk; d.cl++; cwSave(d); return (cwShown[r.id] = { tk: r.rw.tk, sh: r.rw.sh, un, have: d.sh, tg: t0, tgNow: cwTarget(d), all: d.tk });
}
function cwDraw() {
  const d = cwLoad(); if (d.tk < 1) return null; d.tk--; d.pity++; d.pity2++; let r;
  if (d.pity2 >= 30) r = 2; else if (d.pity >= 10) r = Math.random() < 0.2 ? 2 : 1; else { const x = Math.random(); r = x < 0.05 ? 2 : x < 0.3 ? 1 : 0; }
  if (r >= 1) d.pity = 0; if (r === 2) d.pity2 = 0;
  const pool = Object.keys(AUR).filter((k) => AUR[k].r === r), id = pool[rint(pool.length)], dup = d.cos.includes(id); let sh = 0, un = false;
  if (!dup) d.cos.push(id); else { sh = 1 + r; un = cwAddSh(d, sh); }
  cwSave(d); return { id, r, dup, sh, un };
}

let pvRaf = 0;
function startPv() {
  const cv = document.getElementById('cwPv'); if (!cv) return; if (pvRaf) cancelAnimationFrame(pvRaf); const c = cv.getContext('2d'), LOW0 = isLow();
  const loop = () => { if (!document.getElementById('cwPv') || !$('cwBox').classList.contains('on')) { pvRaf = 0; return; }
    const tm = performance.now() / 1000, d = cwLoad(), x = 150 + Math.sin(tm * 0.9) * 78, fy = 92; c.clearRect(0, 0, 300, 120);
    c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.ellipse(x, fy, 18, 7, 0, 0, 7); c.fill();
    const TA = AUR[d.eq2] || null; trailTick('pv', x, fy, TA, tm, LOW0); if (TA) trailDraw(c, 'pv', TA, tm);
    const A = AUR[d.eq] || null; if (A) drawAura(c, A, x, fy, tm, LOW0);
    c.fillStyle = '#c0453a'; c.beginPath(); c.arc(x, fy - 28, 11, 0, 7); c.fill(); c.fillStyle = '#f5d2a8'; c.beginPath(); c.arc(x, fy - 40, 8, 0, 7); c.fill(); c.fillStyle = '#3b3b3b'; c.fillRect(x - 9, fy - 50, 18, 5);
    pvRaf = requestAnimationFrame(loop); };
  pvRaf = requestAnimationFrame(loop);
}
function openCw(msg) {
  const d = cwLoad(), box = $('cwBox'), tg = cwTarget(d), L = tg ? LEG[tg] : null; box.classList.add('on');
  const pct = L ? Math.round(d.sh / L.need * 100) : 100;
  let h = `<div class="cwr"><span>🎟 뽑기권 <b>${d.tk}</b>장</span><span>🧩 ${L ? L.n + ' 조각 <b>' + d.sh + '/' + L.need + '</b>' : '전설 영웅 <b>모두 완성</b>'}</span></div><div class="bar" style="margin:4px 0 8px"><i style="width:${pct}%;background:#ffb73a"></i></div>`;
  { const got = Object.keys(LEG).filter((k) => d.own[k]).map((k) => LEG[k].n); h += L ? `<p class="cwn">협동전을 깨면 조각을 얻어요. ${L.need}개를 모으면 전설 영웅 <b>${L.n}</b>이 열려요!${got.length ? '<br>🌟 얻은 전설 영웅: ' + got.join(', ') : ''}</p>` : '<p class="cwn">🌟 전설 영웅을 모두 얻었어요! 조각은 뽑기권으로 바뀌어요.</p>'; }
  h += `<div class="cwd"><button id="cwGo" ${d.tk < 1 ? 'class="dis"' : ''}>🎟 1장으로 뽑기</button><small>확률: 일반 70% · 희귀 25% · 전설 5% · 10번째엔 희귀 이상, 30번째엔 전설 확정 (지금 ${d.pity}/10 · ${d.pity2}/30) · 이미 있는 꾸미기가 나오면 영웅 조각이 돼요</small></div>`;
  h += `<div id="cwRes">${msg || ''}</div><b style="font-size:14px">내 꾸미기 (눌러서 장착)</b><div class="cwg">` + ['', 't'].map((sl) => `<div style="grid-column:1/-1;font-weight:800;font-size:13px;margin-top:4px">${sl ? '👣 이동 흔적 (걸을 때 남아요)' : '✨ 후광 (몸 주변 이펙트)'}</div>` + Object.keys(AUR).filter((k) => (AUR[k].s || '') === sl).map((k) => { const A = AUR[k], has = d.cos.includes(k); return `<button data-a="${k}" class="${has ? '' : 'lk'}${(d.eq === k || d.eq2 === k) ? ' on' : ''}"><i style="border-color:${has ? A.c : '#bbb'}"></i>${has ? A.n : '???'}<small style="color:${RC[A.r]}">${RN[A.r]}</small></button>`; }).join('')).join('') + '</div>';
  h = `<div style="text-align:center"><canvas id="cwPv" width="300" height="120" style="width:100%;max-width:300px;background:#d9ead0;border-radius:12px"></canvas><div style="font-size:12px;color:#7a6652">장착한 후광·흔적 미리보기</div></div>` + h; $('cwBody').innerHTML = h; startPv();
  $('cwGo').onclick = () => { const r = cwDraw(); if (!r) return; const A = AUR[r.id]; openCw(`<div class="cwp" style="border-color:${RC[r.r]}">✨ <b style="color:${RC[r.r]}">${RN[r.r]}</b> · ${A.n}${r.dup ? ` — 이미 있어서 🧩 조각 +${r.sh}` : ' — 새로 얻었어요!'}${r.un ? '<br>🌟 전설 영웅 ' + LEG[r.un].n + ' 해금!' : ''}</div>`); refreshHid(); };
  $('cwBody').querySelectorAll('.cwg button').forEach((b) => { b.onclick = () => { const c = cwLoad(); if (!c.cos.includes(b.dataset.a)) return; if (AUR[b.dataset.a].s === 't') { c.eq2 = c.eq2 === b.dataset.a ? '' : b.dataset.a; me.tr = c.eq2; } else { c.eq = c.eq === b.dataset.a ? '' : b.dataset.a; me.aura = c.eq; } cwSave(c); sendProf(); openCw(); }; });
}
function hidOK() { try { return localStorage.getItem('jd_hid') === '1'; } catch (e) { return false; } }
function refreshHid() { for (const k of Object.keys(LEG)) { const lb = $(LEG[k].btn); if (lb) lb.textContent = legOK(k) ? '🌟 ' + LEG[k].n : '🔒 전설'; } const hb = $('roleHid'); if (hb) hb.textContent = hidOK() ? '⭐ 이순신' : '🔒 히든'; }
function rankLoad() { try { return JSON.parse(localStorage.getItem('jd_rank') || '[]'); } catch (e) { return []; } }
function fmtT(t) { return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); }
function buildEnd() {
  show('sEnd'); const hostOnly = (id, on) => { $(id).style.display = on && Net.host ? 'inline-block' : 'none'; };
  if (V.endless && V.es && V.es.over) {
    const e = V.es, score = e.tot + e.k + e.q * 30 + (e.clear ? 1000 : 0), nm = (V.pl.find((x) => x.id === Net.id) || {}).name || '학생';
    let rk = rankLoad(); rk.push({ n: nm, s: score, t: e.tot, k: e.k, q: e.q, r: e.r, d: Date.now() }); rk.sort((a, b) => b.s - a.s); rk = rk.slice(0, 30); try { localStorage.setItem('jd_rank', JSON.stringify(rk)); } catch (x) {}
    const pos = rk.findIndex((x) => x.s === score && x.t === e.tot && x.k === e.k) + 1;
    $('endH').textContent = e.clear ? '🏆 99라운드 클리어!' : '♾ 무한 모드 종료!';
    $('endText').innerHTML = `<p><b>${e.r}번째 라운드</b>${e.clear ? '의 최종 보스를 쓰러뜨렸어요! 대단해요!' : '까지 버텼어요!'}</p><p>⏱ 버틴 시간 <b>${fmtT(e.tot)}</b> · ⚔ 처치 <b>${e.k}</b>마리 · 🧠 퀴즈 정답 <b>${e.q}</b>개</p><p>점수 = 버틴 초 + 처치 수 + 퀴즈 정답×30${e.clear ? ' + 클리어 보너스 1000' : ''} → <b>${score}점</b>${pos ? ` (내 기기 기록 ${pos}위)` : ''}</p><small>랭킹은 이 기기에만 저장돼요. 시작 화면의 🏆 랭킹에서 볼 수 있어요.</small>`;
    { const key = e.tot + ':' + e.k + ':' + e.r; if (key !== lastEndKey) { lastEndKey = key; const mp = V.pl.find((x) => x.id === Net.id); let wl = 0; if (mp) for (const k in WEAP) wl = Math.max(wl, (mp.cards && mp.cards[k]) | 0); lastEndPas = pasResHtml(pasSettle({ food: V.food, win: e.clear, kc: e.k, lv: V.lc, t: e.tot, al: V.an, bk: 0, wl, es: 1 })); pasTip(); } $('endText').innerHTML += '<p>' + lastEndPas + '</p>'; }
    hostOnly('btnEndless', false); return;
  }
  try { localStorage.setItem('jd_hid', '1'); } catch (e) {} refreshHid();
  $('endH').textContent = '끝까지 지켜 냈어요! 🎉';
  $('endText').innerHTML = CH.map((c) => `<p><b>${c.n}</b> — ${esc(c.sum)} <small>(${c.pg})</small></p>`).join('') + '<p><b>⭐ 히든 영웅 이순신 해금!</b> 방에서 역할을 고를 때 이순신을 고를 수 있어요. 거북선의 포로 싸워요.</p><p><b>이제 무한 모드로 돌입합니다!</b> 30라운드가 끝없이 이어지고 적이 계속 강해져요. 버틴 시간·처치 수·퀴즈 정답으로 랭킹을 겨뤄 보세요.</p>';
  hostOnly('btnEndless', true);
}

// HUD
let dexT = 0;
function dexLoad() { try { return Object.assign({ s: {}, h: {}, b: {} }, JSON.parse(localStorage.getItem('jd_dex') || '{}')); } catch (e) { return { s: {}, h: {}, b: {} }; } }
function dexRec() { // 도감: 이 기기에서 만난 시너지·영웅·적장을 기록해요
  if (++dexT % 20) return; const me = V.pl.find((x) => x.id === Net.id); if (!me) return; const d = dexLoad(); let ch = false;
  if (!d.h[me.role]) { d.h[me.role] = 1; ch = true; }
  for (const y of SYN) { const lv = me.cards[y.a] && me.cards[y.b] ? ((me.cards[y.a] >= 5 && me.cards[y.b] >= 5) ? 2 : 1) : 0; if (lv > (d.s[y.k] || 0)) { d.s[y.k] = lv; ch = true; } }
  if (V.ph === 'battle') { d.bn = d.bn || {}; for (const e of V.en || []) if (e[1] === 'boss') { const nm = (e[8] || V.bn || BOSSN[V.rd] || [''])[0]; if (nm && !d.bn[nm]) { d.bn[nm] = 1; ch = true; } } }
  if (ch) try { localStorage.setItem('jd_dex', JSON.stringify(d)); } catch (e) {}
}
const HERO_BLURB = { gwakjaeu: '임진왜란 때 가장 먼저 의병을 일으킨 홍의장군 곽재우예요. 붉은 옷을 입고 날쌔게 싸웠어요.', hyujeong: '서산대사 휴정은 임진왜란이 나자 승려들에게 나라를 지키자는 글을 보내 승병을 일으키게 했어요.', yujeong: '사명대사 유정은 휴정의 제자로 승병을 이끌었고, 전쟁이 끝난 뒤 일본에 가서 포로를 데려오는 데 힘썼어요.', jinrin: '명나라 수군 장수 진린은 정유재란 때 조선 수군과 연합해 노량해전에서 이순신과 함께 싸웠어요. (교과서 밖 보충)', gimsimin: '진주대첩(1592)을 이끈 진주목사 김시민이에요. 3천여 명의 군사로 2만여 명의 왜군을 막아 냈어요.', gwonyul: '행주대첩(1593)을 이끈 장군 권율이에요. 화차로 불화살을 쏟아부어요.', archer: '활을 쏘는 사수예요. 멀리서 일직선의 적을 꿰뚫어요.', militia: '나라를 지키려고 스스로 일어난 백성 군대, 의병이에요. 환도로 앞의 적을 베어요.', monk: '임진왜란 때 서산대사 휴정, 사명대사 유정 같은 스님들이 승병을 이끌고 싸웠어요.', gunner: '화약 무기인 화포(대포)를 다루는 병사예요. 한 방에 무리를 날려요.', admiral: '이순신(1545~1598)은 조선 수군을 이끈 장수예요. 한산도 대첩을 이끌었고 노량 해전에서 전사했어요.' };

// ===== 업적·칭호·일일 도전 (v0.33) — 이 기기에만 저장돼요 =====
const ACH = [
  ['first', '첫 승리', '라운드에서 처음 이겨요', '새내기 수비대', (s) => s.win >= 1],
  ['w10', '든든한 방패', '라운드를 10번 이겨요', '든든한 방패', (s) => s.win >= 10],
  ['w30', '불패의 수비대', '라운드를 30번 이겨요', '불패의 수비대', (s) => s.win >= 30],
  ['sm5', '척척 해결사', '서브미션을 5번 성공해요', '척척 해결사', (s) => s.sm >= 5],
  ['sm25', '미션 마스터', '서브미션을 25번 성공해요', '미션 마스터', (s) => s.sm >= 25],
  ['stk', '호흡 척척', '한 판에서 서브미션 3연속 성공!', '호흡 척척', (s) => s.s3 >= 1],
  ['du3', '일기토 도전자', '일기토에서 3번 이겨요', '일기토 도전자', (s) => s.du >= 3],
  ['du10', '적장 사냥꾼', '일기토에서 10번 이겨요', '적장 사냥꾼', (s) => s.du >= 10],
  ['q30', '역사 박사', '퀴즈를 30개 맞혀요', '역사 박사', (s) => s.q >= 30],
  ['q100', '역사 대박사', '퀴즈를 100개 맞혀요', '역사 대박사', (s) => s.q >= 100],
  ['coop', '함께 지켜요', '협동전에서 이겨요', '함께 지켜요', (s) => s.coop >= 1],
  ['hard', '불꽃 같은 용기', '어려움 난이도에서 이겨요', '불꽃 같은 용기', (s) => s.hard >= 1],
  ['c0', '임진왜란 지킴이', '임진왜란 마지막 라운드를 이겨요', '임진왜란 지킴이', (s) => s.ch0 >= 1],
  ['c1', '정유재란 지킴이', '정유재란 마지막 라운드를 이겨요', '정유재란 지킴이', (s) => s.ch1 >= 1],
  ['c2', '정묘호란 지킴이', '정묘호란 마지막 라운드를 이겨요', '정묘호란 지킴이', (s) => s.ch2 >= 1],
  ['c3', '병자호란 지킴이', '병자호란 마지막 라운드를 이겨요', '병자호란 지킴이', (s) => s.ch3 >= 1],
  ['d1', '오늘의 도전자', '일일 도전을 1번 해요', '오늘의 도전자', (s) => s.dly >= 1],
  ['d3', '꾸준한 도전', '일일 도전을 3일 연속 해요', '꾸준한 도전', (s) => s.dst >= 3]
];
function achLoad() { try { const d = JSON.parse(localStorage.getItem('jd_ach') || '{}'); return { st: d.st || {}, ok: d.ok || {}, ti: d.ti || '', lf: d.lf || '', bd: d.bd || '' }; } catch (e) { return { st: {}, ok: {}, ti: '', lf: '', bd: '' }; } }
function achSave(d) { try { localStorage.setItem('jd_ach', JSON.stringify(d)); } catch (e) {} }
function titleOf() { const d = achLoad(), a = ACH.find((x) => x[0] === d.ti && d.ok[x[0]]); return a ? a[3] : ''; }
const kstDay = (off) => new Date(Date.now() + 9 * 3600e3 + (off || 0) * 86400e3).toISOString().slice(0, 10);
function dailyCfg() { let s = (Math.floor((Date.now() + 9 * 3600e3) / 86400e3) * 2654435761) >>> 0; const r = () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; const rd = Math.floor(r() * R.length), diff = ['easy', 'normal', 'normal', 'hard'][Math.floor(r() * 4)], mod = ['rich', 'vol', 'haste'][Math.floor(r() * 3)]; return { rd, diff, mod }; }
function dailyLoad() { try { const d = JSON.parse(localStorage.getItem('jd_daily') || '{}'); return { best: d.best || {}, last: d.last || '', st: d.st | 0, hist: d.hist || [] }; } catch (e) { return { best: {}, last: '', st: 0, hist: [] }; } }
function dailySave(d) { const ks = Object.keys(d.best).sort().slice(-30), b = {}; ks.forEach((k) => { b[k] = d.best[k]; }); d.best = b; d.hist = d.hist.slice(-30); try { localStorage.setItem('jd_daily', JSON.stringify(d)); } catch (e) {} }
async function startDaily() { await startAs('single'); const c = dailyCfg(); hostCtl('start', { start: c.rd, dur: 180, diff: c.diff, coop: false, bots: 0, daily: 1, mod: c.mod }); }
let qokSeen = 0, duSeen = 0, lastResId = '', lastEndKey = '', lastEndPas = '';
function recordResult() {
  if (!V || !V.res || V.endless || !V.res.rs || V.res.id === lastResId) { const dr0 = $('dailyRes'); if (dr0 && !(V && V.res && V.res.dl)) dr0.style.display = 'none'; return; }
  lastResId = V.res.id; const rs = V.res.rs, win = V.res.win, d = achLoad(), st = d.st, inc = (k, n) => { if (n > 0) st[k] = (st[k] | 0) + n; };
  if (win) { inc('win', 1); if (rs.cm) inc('coop', 1); if (rs.hd) inc('hard', 1); if (rs.ch >= 0) inc('ch' + rs.ch, 1); }
  inc('sm', rs.sm | 0); inc('s3', rs.s3 | 0);
  if ((rs.du | 0) < duSeen) duSeen = 0; inc('du', (rs.du | 0) - duSeen); duSeen = rs.du | 0;
  const me2 = V.pl.find((x) => x.id === Net.id), q = me2 ? me2.qok | 0 : 0; if (q < qokSeen) qokSeen = 0; inc('q', q - qokSeen); qokSeen = q;
  const dr = $('dailyRes'); if (dr) dr.style.display = 'none';
  if (V.res.dl) {
    const day = kstDay(), D = dailyLoad(), sc = V.res.dl.sc | 0;
    if (!D.hist.includes(day)) { D.st = D.last === kstDay(-1) ? D.st + 1 : 1; D.last = day; D.hist.push(day); inc('dly', 1); st.dst = Math.max(st.dst | 0, D.st); }
    D.best[day] = Math.max(D.best[day] | 0, sc); dailySave(D);
    if (dr) { dr.style.display = 'block'; dr.innerHTML = `📅 <b>일일 도전 점수 ${sc}점</b> · 오늘 최고 ${D.best[day]}점 · 연속 ${D.st}일<br><small>점수 = 승리 1000 + 처치×4 + 서브미션 성공×200 + 성 체력(최대 300) + 퀴즈 정답×30</small>`; }
  }
  { const pr = $('pasRes'), mp = V.pl.find((x) => x.id === Net.id); if (pr) { let wl = 0; if (mp) for (const k in WEAP) wl = Math.max(wl, (mp.cards && mp.cards[k]) | 0); const a = pasSettle({ food: V.food, win, kc: rs.kc, lv: rs.lv, t: rs.t, al: rs.al, bk: rs.bk, wl }); pr.style.display = 'block'; pr.innerHTML = pasResHtml(a); if (a.nw.length) setTimeout(() => toast('🔓 숙련도 해금! ' + a.nw.map((g) => g[1]).join(' · ')), 900); pasTip(); } }
  const nw = []; for (const a of ACH) if (!d.ok[a[0]] && a[4](st)) { d.ok[a[0]] = Date.now(); nw.push(a); } if (nw.length && !d.ti) d.ti = nw[0][0]; achSave(d);
  if (nw.length) setTimeout(() => toast('🏅 업적 달성! ' + nw.map((a) => a[1] + ' (칭호 「' + a[3] + '」 · 🎁 ' + rwName(ACHRW[a[0]]) + ')').join(' · ')), 1200);
}

let achRaf = 0;
function startAchPv() {
  const cv = document.getElementById('achPv'); if (!cv) return; if (achRaf) cancelAnimationFrame(achRaf); const c = cv.getContext('2d'), t0 = performance.now();
  const loop = () => { if (!document.getElementById('achPv') || !$('sBook').classList.contains('on')) { achRaf = 0; return; }
    const tm = performance.now() / 1000, mc = myCos(), ph = ((performance.now() - t0) / 1000) % 3, nm = (me && me.name) || '학생'; c.clearRect(0, 0, 300, 130);
    c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.ellipse(150, 104, 20, 7, 0, 0, 7); c.fill();
    c.fillStyle = '#c0453a'; c.beginPath(); c.arc(150, 76, 11, 0, 7); c.fill(); c.fillStyle = '#f5d2a8'; c.beginPath(); c.arc(150, 64, 8, 0, 7); c.fill();
    pillB(c, '★ ' + nm, 150, 38, '#ffd34d', '#2b2440', mc.bd, tm, true);
    if (mc.lf && ph < 1.5) drawLvFx(c, mc.lf, 150, 104, ph / 1.5, 1.3, true);
    achRaf = requestAnimationFrame(loop); };
  achRaf = requestAnimationFrame(loop);
}
function buildBook(tab) {
  tab = tab || 'syn'; show('sBook'); document.querySelectorAll('#bookTabs button[data-t]').forEach((b) => b.classList.toggle('on', b.dataset.t === tab));
  const d = dexLoad(), B = $('bookBody'); let h = '';
  if (tab === 'syn') {
    const got = SYN.filter((y) => d.s[y.k]).length; h = `<p class="bk-n">발견한 시너지 ${got}/${SYN.length} — 두 카드를 함께 가지면 보너스, 능력 짝은 둘 다 Lv.5면 특별 효과가 열려요!<br>⚔ <b>무기 진화</b>: 무기를 Lv.5로 키우고 그 무기의 <b>짝 능력</b>(카드에 ★로 표시)을 1개 이상 가진 채 적장을 쓰러뜨리면 문제가 나와요. 맞히면 진화!</p><div class="bk-g">` + SYN.map((y) => { const lv = d.s[y.k] | 0; return `<div class="bk-c${lv ? '' : ' lk'}"><div class="bk-i"><img src="${ICON(y.a)}"><span>+</span><img src="${ICON(y.b)}"></div><b>${lv ? esc(y.n) : '???'}</b><span>${lv ? esc(y.d) : '아직 못 찾았어요'}</span><small>${lv ? esc(y.t) : (WEAP[y.a] ? '무기 + 무기' : '능력 + 능력') + ' 조합'}</small><em>${y.w ? (lv ? '두 무기를 함께 쓰면 공격력 보너스!' : '') : lv === 2 ? '⭐ 특별 효과 발견: ' + esc(y.sd) : lv ? '🔒 둘 다 Lv.5 → ' + esc(y.sd) : ''}</em></div>`; }).join('') + '</div>';
  } else if (tab === 'hero') {
    h = '<div class="bk-g">' + Object.keys(ROLE).map((k) => { const r = ROLE[k], ok = k === 'admiral' ? hidOK() : LEG[k] ? legOK(k) : d.h[k]; return `<div class="bk-c${ok ? '' : ' lk'}"><b>${ok ? esc(r.n) : '???'}</b><span>${ok ? esc(HERO_BLURB[k]) : (k === 'admiral' ? '모든 라운드를 깨면 열려요' : LEG[k] ? '협동전 보상 조각 ' + LEG[k].need + '개로 열려요' : '아직 써 보지 않았어요')}</span><small>${ok ? esc(r.tag.join(' · ')) : ''}</small></div>`; }).join('') + '</div>';
  } else if (tab === 'boss') {
    const seen = {}; BOSSN.concat(BOSS_EXTRA).forEach((b, i) => { if (!b) return; const x = (seen[b[0]] = seen[b[0]] || { d: b[1], r: [], ok: 0 }); if (i < BOSSN.length) x.r.push(i); if ((d.bn || {})[b[0]] || d.b[i]) x.ok = 1; });
    const ks = Object.keys(seen); h = `<p class="bk-n">만난 적장 ${ks.filter((k) => seen[k].ok).length}/${ks.length} — 적장 설명은 교과서 밖 보충이라 선생님 확인이 필요해요.</p><div class="bk-g">` + ks.map((k) => { const x = seen[k]; return `<div class="bk-c${x.ok ? '' : ' lk'}"><b>${x.ok ? esc(k) : '???'}</b><span>${x.ok ? esc(x.d) : '아직 만나지 못했어요'}</span><small>${x.ok ? (x.r.length ? '출현: ' + x.r.map((i) => esc(R[i].nm)).join(', ') : '무한 모드 최종 보스') : ''}</small></div>`; }).join('') + '</div>';
  } else if (tab === 'daily') {
    const c = dailyCfg(), D = dailyLoad(), day = kstDay(), r0 = R[c.rd], dn = { easy: '쉬움', normal: '보통', hard: '어려움' }[c.diff], md = MODS[c.mod];
    const hist = Object.keys(D.best).sort().slice(-7).reverse().map((k) => `<tr><td>${k}</td><td>${D.best[k]}점</td></tr>`).join('');
    h = `<p class="bk-n">📅 ${day} 오늘의 도전 — 하루 한 판, 3분! (점수는 이 기기에만 저장돼요 · 날마다 장면·난이도·규칙이 바뀌어요)</p><div class="bk-c"><b>${esc(CH[r0.ch].n)} · ${esc(r0.nm)}</b><span>난이도 ${dn} · 3분 · 오늘의 규칙 ${md[0]} ${md[1]} — ${md[2]}</span><small>오늘 최고 ${D.best[day] | 0}점 · 연속 ${D.last === day || D.last === kstDay(-1) ? D.st : 0}일</small></div><div style="margin:10px 0"><button id="dlGo">📅 오늘의 도전 시작</button></div>` + (hist ? '<table class="bk-t"><tr><th>날짜</th><th>최고 점수</th></tr>' + hist + '</table>' : '<p class="bk-n">아직 기록이 없어요. 첫 도전을 해 보세요!</p>');
  } else if (tab === 'pas') {
    const D = pasLoad(), sl = pasSlots(D), eqn = D.eq.slice(0, sl).filter((k) => pasOpen(D, k)).length;
    h = `<p class="bk-n">🎖 <b>영웅 숙련도</b> — 판이 끝나면 남은 식량을 모아 패시브를 키워요. 이 기기에서는 <b>모든 영웅</b>이, 온라인에서도 똑같이 적용돼요. 목표를 이루면 새 패시브가 열리고 칸이 늘어나요.<br>🌾 가진 식량 <b>${D.food}</b> · 장착 칸 <b>${eqn}/${sl}</b> (칸 안에 장착한 패시브만 적용돼요)</p><div class="bk-g">` + Object.keys(PAS).map((k) => { const P = PAS[k], open = pasOpen(D, k), lv = Math.min(PAS_MAX, D.lv[k] | 0), eq = D.eq.slice(0, sl).includes(k), cost = PAS_COST[lv], gl = PAS_GOALS.find((g) => g[3] === k);
      return `<div class="bk-c${open ? '' : ' lk'}"><b>${P[0]} ${open ? P[1] : '???'} ${open ? '<small>Lv.' + lv + '/' + PAS_MAX + '</small>' : ''}</b><span>${open ? P[2] + ' (레벨마다)' : '🔒 목표: ' + esc(gl ? gl[1] : '')}</span>` + (open ? `<small>${'■'.repeat(lv)}${'□'.repeat(PAS_MAX - lv)}</small><div class="row" style="gap:6px;margin-top:4px">${lv < PAS_MAX ? `<button data-pu="${k}" class="${D.food >= cost ? '' : 'sec'}">강화 🌾${cost}</button>` : '<em>최대</em>'}${lv > 0 ? `<button data-pe="${k}" class="sec">${eq ? '✔ 장착 중 (해제)' : '장착'}</button>` : ''}</div>` : '') + '</div>'; }).join('') + '</div>' +
      `<p class="bk-n" style="margin-top:10px">🏁 목표 (누적: 처치 ${D.st.kills} · 제단 ${D.st.alt} · 적장 ${D.st.boss} · 최고 레벨 ${D.st.bestLv})</p><div class="bk-g">` + PAS_GOALS.map((g) => { const ok = !!D.ok[g[0]]; return `<div class="bk-c${ok ? '' : ' lk'}"><b>${ok ? '✅' : '⬜'} ${esc(g[1])}</b><span>${g[3] === '+' ? '🎒 패시브 칸 +1' : '🔓 ' + esc(PAS[g[3]][1]) + ' 해금'}</span></div>`; }).join('') + '</div>';
  } else if (tab === 'ach') {
    const A = achLoad(), got = ACH.filter((a) => A.ok[a[0]]).length;
    const mc = myCos();
    h = `<p class="bk-n">🏅 업적 ${got}/${ACH.length} — 업적마다 칭호와 🎁 꾸미기(레벨업 연출·이름표 테두리)를 받아요. 골라 쓰면 전투에서 보여요 (이 기기에만 저장돼요)</p><div style="text-align:center"><canvas id="achPv" width="300" height="130" style="background:#d9ead0;border-radius:12px"></canvas><div style="font-size:12px;color:#7a6652">내 이름표 테두리와 레벨업 연출 미리보기</div></div><div class="bk-g">` + ACH.map((a) => { const ok = A.ok[a[0]], rw = ACHRW[a[0]], on = mc.lf === rw || mc.bd === rw; return `<div class="bk-c${ok ? '' : ' lk'}"><b>${ok ? '🏅 ' : '🔒 '}${esc(a[1])}</b><span>${esc(a[2])}</span><small>${ok ? '칭호 「' + esc(a[3]) + '」' : '아직이에요'}</small><small>🎁 ${esc(rwName(rw))}</small>${ok ? `<button class="sec" data-ti="${a[0]}" style="margin-top:4px;font-size:13px;padding:3px 10px">${A.ti === a[0] ? '✅ 칭호 쓰는 중' : '이 칭호 쓰기'}</button><button class="sec" data-rw="${rw}" style="margin-top:4px;font-size:13px;padding:3px 10px">${on ? '✅ 꾸미기 쓰는 중' : '이 꾸미기 쓰기'}</button>` : ''}</div>`; }).join('') + '</div>';
  } else {
    const rk = rankLoad(); h = '<p class="bk-n">🏆 무한 모드 랭킹 (이 기기에만 저장돼요) · 점수 = 버틴 초 + 처치 수 + 퀴즈 정답×30</p>' + (rk.length ? '<table class="bk-t"><tr><th>순위</th><th>이름</th><th>점수</th><th>버틴 시간</th><th>처치</th><th>퀴즈</th><th>라운드</th></tr>' + rk.map((x, i) => `<tr><td>${i + 1}</td><td>${esc(x.n)}</td><td><b>${x.s}</b></td><td>${fmtT(x.t)}</td><td>${x.k}</td><td>${x.q}</td><td>${x.r}</td></tr>`).join('') + '</table>' : '<p>아직 기록이 없어요. 방에서 ♾ 무한 모드로 시작해 보세요!</p>');
  }
  B.innerHTML = h; B.scrollTop = 0;
  const dg = B.querySelector('#dlGo'); if (dg) dg.onclick = startDaily;
  B.querySelectorAll('button[data-rw]').forEach((b) => { b.onclick = () => { const A = achLoad(), k = b.dataset.rw, f = LVF[k] ? 'lf' : 'bd'; A[f] = A[f] === k ? '' : k; achSave(A); try { sendProf(); } catch (e) {} buildBook('ach'); }; });
  B.querySelectorAll('button[data-pu]').forEach((b) => { b.onclick = () => { const D = pasLoad(), k = b.dataset.pu, lv = D.lv[k] | 0, c = PAS_COST[lv]; if (!PAS[k] || !pasOpen(D, k) || lv >= PAS_MAX || D.food < c) { toast('식량이 모자라요 🌾' + (c || '')); return; } D.food -= c; D.lv[k] = lv + 1; if (!D.eq.includes(k) && D.eq.length < pasSlots(D)) D.eq.push(k); pasSave(D); sendProf(); pasTip(); buildBook('pas'); }; });
  B.querySelectorAll('button[data-pe]').forEach((b) => { b.onclick = () => { const D = pasLoad(), k = b.dataset.pe, i = D.eq.indexOf(k); if (i >= 0 && i < pasSlots(D)) D.eq.splice(i, 1); else { D.eq = D.eq.filter((x) => x !== k); if (D.eq.slice(0, pasSlots(D)).length >= pasSlots(D)) { toast('칸이 가득 찼어요. 다른 패시브를 먼저 해제해요'); return; } D.eq.push(k); } pasSave(D); sendProf(); pasTip(); buildBook('pas'); }; });
  if (tab === 'ach') startAchPv();
  B.querySelectorAll('button[data-ti]').forEach((b) => { b.onclick = () => { const A = achLoad(); A.ti = b.dataset.ti; achSave(A); buildBook('ach'); }; });
}
function updateHUD() {
  dexRec();
  const p = myP(); if (!p) return; const r = R[V.rd]; $('sBattle').classList.toggle('noarmy', V.obj === 'e');
  $('hudName').textContent = V.endless ? '♾ ' + ((V.er | 0) + 1) + '라운드' : r.nm; const rem = V.endless ? Math.ceil(60 - (V.t % 60)) : Math.max(0, Math.ceil(V.dur - V.t)); $('hudT').textContent = String(Math.floor(rem / 60)).padStart(2, '0') + ':' + String(rem % 60).padStart(2, '0');
  { const ov = $('wxOv'), wt = $('wxTag'); if (ov) { ov.className = V.ph === 'battle' && V.wx ? 'on ' + V.wx : ''; } if (wt) { const tx = V.ph === 'battle' ? [V.wx ? ({ rain: '🌧 비', fog: '🌫 안개', night: '🌙 밤' }[V.wx]) : '', V.mor ? '😞 사기 하락 ' + V.mor + '초' : ''].filter(Boolean).join(' · ') : ''; wt.textContent = tx; wt.style.display = tx ? 'block' : 'none'; } }
  { const st = $('smTag'), m = V.sm; if (V.ph === 'battle' && m && m.k) { st.style.display = 'block'; st.textContent = '🎯 ' + m.n + ' · ' + (m.k === 'ref' || m.k === 'twin' ? m.a + '%' : m.a + '/' + m.b) + ' · ⏱' + m.t + '초'; } else if (V.ph === 'battle' && m && m.nt != null) { st.style.display = 'block'; st.textContent = '🎯 다음 서브미션까지 ' + m.nt + '초 · 성공 ' + m.ok + '번'; } else st.style.display = 'none'; }
  $('escGo').style.display = (V.obj === 'e' && V.ph === 'battle') ? 'flex' : 'none';
  $('barT').style.width = Math.min(100, (V.endless ? (V.t % 60) / 60 : V.t / V.dur) * 100) + '%'; $('barB').style.width = (V.castle ? Math.max(0, V.bh / V.bm * 100) : Math.min(100, (V.obj === 'e' ? V.t / V.dur : V.obj === 'r' ? (V.cpt - V.cpn) / Math.max(1, V.cpt) : V.t / V.dur) * 100)) + '%'; { const OI = OBJINFO[V.obj]; let extra = ''; if (V.obj === 'e') extra = ` 🚩${V.fl || 0}`; else if (V.obj === 'r') extra = ` ${V.cpt - V.cpn}/${V.cpt}`; if (!V.castle) extra += `  ❤️×${Math.max(0, V.lives)}`; $('objBar').textContent = OI.ic + ' ' + OI.n + extra; }
  $('sBattle').classList.toggle('duel', !!V.du);
  { const pb = $('pauseBox'); pb.classList.toggle('on', !!V.paused); if (V.paused) { const r = R[V.rd], OI = OBJINFO[V.obj]; $('pTitle').innerHTML = `⏸ 잠시 멈춤 <small>${r.nm} · ${r.yr}년</small>`; $('pText').textContent = r.b; $('pResume').style.display = (Net.host || V.pl.length === 1) ? 'inline-block' : 'none'; $('pWait').style.display = (Net.host || V.pl.length === 1) ? 'none' : 'block'; }
    $('btnPause').style.display = (Net.host || V.pl.length === 1) ? 'block' : 'none'; $('pSave').style.display = Net.mode === 'single' ? 'inline-block' : 'none'; const tg = $('pauseTag'); tg.textContent = V.vp ? '🗳 투표하는 동안 게임이 멈춰요' : V.cp ? '⭐ 카드를 골라 주세요 (게임이 멈춰 있어요)' : ''; tg.style.display = (V.vp || V.cp) ? 'block' : 'none'; }
  $('hudFood').textContent = '🌾 ' + V.food; { const n = V.un.filter(Boolean).length; $('hudArmy').textContent = '🛡 병력 ' + n + '/' + V.slots; const me = V.pl.find((x) => x.id === Net.id); if (me) { let h = '<span class="wc">' + ROLE[me.role].n + ' · ' + ROLE[me.role].tag.join('·') + '</span>'; for (const k of ORD) { const lv = me.cards[k] || 0; if (!lv) continue; const ev = me.cards['evo_' + k]; h += `<span class="eq${WEAP[k] ? ' wp' : ''}${ev ? ' ev' : ''}" title="${CARDS.find((x) => x.id === k).n}"><img src="${ICON(k)}"><b>Lv.${lv}${ev ? '★' : ''}</b></span>`; } for (const y of SYN) { const a = me.cards[y.a] || 0, b2 = me.cards[y.b] || 0; if (a && b2) h += `<span class="wc w" title="${y.t}">${a >= 5 && b2 >= 5 ? '✨' : '🔗'} ${y.n}</span>`; } if (h !== $('hudWeap')._h) { $('hudWeap')._h = h; $('hudWeap').innerHTML = h; } }
    const bu = $('btnUp'); bu.innerHTML = (V.castle ? '성 강화' : '진영 강화') + (V.upg >= 5 ? '<br><small>최대</small>' : `<br><small>Lv.${V.upg} · 🌾${V.ucost}</small>`); bu.classList.toggle('dis', V.upg >= 5 || V.food < V.ucost); } { const br = $('btnRep'); br.style.display = V.castle ? 'flex' : 'none'; br.innerHTML = '성 수리<br><small>' + (V.rcd > 0 ? V.rcd + '초' : '🌾' + V.rc) + '</small>'; br.title = '성 체력 +' + V.rh + '%'; br.classList.toggle('dis', V.food < V.rc || V.bh >= V.bm || V.rcd > 0); const rt = $('raidTag'); let tx = ''; if (V.du) tx = ''; else if (V.bi) tx = '🛡 성이 잠시 안전해요!'; else if (V.ph === 'battle' && V.wv > 0 && !V.endless) { const n = Math.ceil(V.wv); tx = V.obj === 'e' ? `⚠️ 매복까지 ${n}초` : V.t < 30 ? `🌱 준비 시간 · 대규모 습격까지 ${n}초` : `⚔️ 대규모 습격까지 ${n}초`; } rt.textContent = tx; rt.style.display = tx ? 'block' : 'none'; }
  $('btnSummon').innerHTML = `소집<br><small>군량 ${V.cost}</small>`; $('btnSummon').classList.toggle('dis', V.food < V.cost || !V.un.includes(null));
  { const sk = V.du ? '구르기' : (SKILL[p.role] || SKILL.militia).n; $('btnSkill').style.fontSize = sk.length > 3 ? '19px' : ''; $('btnSkill').innerHTML = p.cd > 0 ? `${sk}<br><small>${Math.ceil(p.cd)}초</small>` : `${sk}<br><small>준비!</small>`; } $('btnSkill').classList.toggle('dis', p.cd > 0 || p.down > 0);
  { const bc = $('btnCr'), D = CRD[p.cr]; if (V.cm && D && V.ph === 'battle') { bc.style.display = 'flex'; bc.innerHTML = p.cc > 0 ? `${D.ic} ${D.ab}<br><small>${p.cc}초</small>` : `${D.ic} ${D.ab}<br><small>준비!</small>`; bc.classList.toggle('dis', p.cc > 0 || p.down > 0 || !!V.du); } else bc.style.display = 'none'; const ct = $('coopTag'); const ctx = (V.cm && V.ph === 'battle') ? cmText() : ''; ct.textContent = ctx; ct.style.display = ctx ? 'block' : 'none'; }
  $('barHp').style.width = Math.max(0, p.hp / p.mx * 100) + '%'; $('barXp').style.width = Math.min(100, V.xp / V.need * 100) + '%'; $('hudLv').textContent = 'Lv.' + p.lv; { const av = $('meAv'); if (av.dataset.r !== p.role && window.SPR && SPR[RSP[p.role]]) { av.dataset.r = p.role; av.src = SPR[RSP[p.role]].p || SPR[RSP[p.role]].d; } }
  $('sBattle').classList.toggle('pick', !!p.offer); const ok = p.offer ? p.offer.join() + '|' + (p.qz ? p.qz.q : '') + p.qs + '|' + (p.rd || 0) + '|' + JSON.stringify(V.ch || []) : ''; if (ok !== lastOffer) { lastOffer = ok; const box = $('cards'); if (!p.offer) box.style.display = 'none'; else if (p.qz && !p.qs) { box.style.display = 'flex'; box.className = 'qz'; const mineQ = p.qz.by === Net.id, solo = V.pl.filter((x) => !x.bot).length <= 1; box.innerHTML = `<div class="qzb"><em>${mineQ ? (p.qz.evo ? '⚔ 적장을 쓰러뜨렸어요! 내 차례예요! 맞히면 무기가 진화해요 · 틀리면 보급 카드 2장' : '🧠 레벨 업! 내 차례예요! 맞히면 카드 4장 · 틀리면 카드 2장') + (p.qst ? ' · 🔥' + p.qst + '연속' : '') : '👀 ' + esc(p.qz.bn || '친구') + ' 친구가 푸는 중! 같이 힌트를 알려 줘요 (' + (p.qz.evo ? '맞히면 무기가 진화해요!' : '맞히면 카드 4장 · 틀리면 2장') + ')'} · ${esc(p.qz.tag)}</em><b>${esc(p.qz.q)}</b><div class="qzo">${p.qz.o.map((o, i) => mineQ ? `<button data-i="${i}">${esc(o)}</button>` : `<button data-i="${i}" disabled style="opacity:.85">${esc(o)}</button>`).join('')}</div></div>`; box.querySelectorAll('button').forEach((d) => d.onpointerdown = () => { if (mineQ) sendHost({ k: 'qa', i: +d.dataset.i }); }); }
  else if (p.qz && p.qs === 2 && p.rd > 0) { box.style.display = 'flex'; box.className = 'qz'; box.innerHTML = `<div class="qzb" style="border-color:#a8322a"><em style="color:#a8322a">❌ 아쉬워요! ${p.qz.by === Net.id ? '' : esc(p.qz.bn || '친구') + ' 친구가 틀렸어요 · '}정답을 읽어 봐요</em><b>${esc(p.qz.q)}</b><div class="qzo"><button disabled style="background:#bfe8b0;opacity:1">⭕ 정답: ${esc(p.qz.o[p.qz.a])}</button></div><div style="font-size:14px;margin-top:6px;line-height:1.4">${esc(p.qz.w || '')}</div><div style="font-size:13px;margin-top:4px;color:#7a6652">📖 ${p.rd}초 뒤에 카드가 열려요 (카드 2장 중 선택)</div></div>`; }
  else { box.style.display = 'flex'; box.className = p.offer.length > 3 ? 'c4' : ''; box.innerHTML = (p.qz ? `<div class="qres ${p.qs === 1 ? 'ok' : 'no'}">${p.qs === 1 ? '⭕ ' + (p.qz.by === Net.id ? '정답! ' : esc(p.qz.bn || '친구') + ' 친구가 맞혔어요! ') + (p.qz.by === Net.id ? '카드 4장 중 하나를 골라요! (능력은 모두에게)' : '카드 4장이 열렸어요! 친구에게 추천 💬') + (p.qrw && p.qz.by === Net.id ? ' 🎁 ' + esc(p.qrw) : '') : '❌ 아쉬워요! 카드가 2장만 열려요' + (p.qz.by === Net.id ? ' · 하나를 골라요' : '')} ${esc(p.qz.w || '')}</div>` : '') + p.offer.map((id, i) => { const c = CARDS.find((x) => x.id === id), evo = id.startsWith('evo_'), base = evo ? id.slice(4) : id, cur = p.cards[id] || 0, pips = [1, 2, 3, 4, 5].map((n) => `<u class="${n <= cur ? 'f' : n === cur + 1 ? 'nx' : ''}"></u>`).join(''); const syn = SYN.filter((y) => (y.a === id && p.cards[y.b]) || (y.b === id && p.cards[y.a])).map((y) => `<i class="sy">🔗 ${y.n}</i>`).join('') + (WEAP[id] && WPAIR[id] ? `<i class="sy" style="color:#8a5a00">★ 진화 짝: ${cardName(WPAIR[id])}${p.cards[WPAIR[id]] ? ' ✔' : ''}</i>` : ''); return `<div class="card${evo ? ' evo' : ''}${!cur && !evo ? ' nw' : ''}" data-i="${i}">${evo ? '<em class="bd">★ 진화!</em>' : !cur ? '<em class="bd">NEW!</em>' : ''}<img class="ci" src="${ICON(base)}"><b>${c.n}</b><span class="ty">${WEAP[base] ? '무기' : ABIL[base] ? '능력' : '보급'}</span><i class="sy" style="color:#2f6b2a">${evo || WEAP[base] ? '👤 나만 (친구는 무기 +1)' : '🌐 모두에게!'}</i>${syn}${(V.ch || []).filter((r) => r[1] === i).length ? `<em class="rcm">👍 ${esc((V.ch || []).filter((r) => r[1] === i).map((r) => r[0]).join(', '))}</em>` : ''}<span>${c.d}</span>${evo ? '' : `<div class="pp5">${pips}</div>`}<small>${c.t}</small></div>`; }).join(''); const mineC = !p.qz || p.qz.by === Net.id; box.querySelectorAll('.card').forEach((d) => d.onpointerdown = () => { if (mineC) { sendHost({ k: 'card', i: +d.dataset.i }); box.style.display = 'none'; lastOffer = ''; } else sendHost({ k: 'cheer', i: +d.dataset.i }); }); } }
  if (V.info && V.info.id !== lastInfoId) { lastInfoId = V.info.id; const ib = $('infoBox'); ib.innerHTML = `<b>${esc(V.info.tt)}</b><span>${esc(V.info.tx)}</span>`; ib.classList.add('on'); clearTimeout(infoTm); infoTm = setTimeout(() => ib.classList.remove('on'), V.info.tx.length > 40 ? 5500 : 3000); }
  const ek = V.ev ? V.ev.t + V.ev.q : ''; const evb = $('evBox');
  if (ek !== lastEvKey) { lastEvKey = ek; if (!V.ev) evb.style.display = 'none'; else { evb.style.display = 'block'; evb.innerHTML = `<h3>${V.ev.t}</h3><p>${V.ev.q} <small>(친구들과 투표!)</small></p><div>${V.ev.o.map((o, i) => `<button class="evo" data-i="${i}"><b>${o.n}</b><small>${o.d}</small></button>`).join('')}</div><p id="evV"></p>`; evb.querySelectorAll('.evo').forEach((b) => b.onpointerdown = () => { sendHost({ k: 'vote', i: +b.dataset.i }); evb.querySelectorAll('.evo').forEach((x) => x.classList.toggle('on', x === b)); }); } }
  if (V.ev && $('evV')) { const c = [0, 0]; for (const k in V.ev.votes) c[V.ev.votes[k]]++; const wt = V.pl.length > 1 ? V.pl.filter((x) => !x.aw && V.ev.votes[x.id] == null).map((x) => x.name) : []; $('evV').textContent = `투표 ${c[0]} : ${c[1]}  ·  ${Math.ceil(V.ev.left)}초` + (wt.length ? ' · 기다리는 중: ' + wt.join(', ') : ''); }
  { const wtag = $('waitTag'); if (wtag) { let tx = ''; if (V.pl.length > 1) { const a = V.pl.filter((x) => x.aw).map((x) => x.name), w = V.pl.filter((x) => x.id !== Net.id && x.offer && V.qzr === x.id).map((x) => x.name); if (a.length) tx = '📶 연결 끊김: ' + a.join(', ') + ' (다시 들어올 수 있어요)'; else if (V.esw && V.esw.length) tx = '🚩 ' + V.esw.join(', ') + ' 친구가 아직 도착하지 못했습니다! 모두 오른쪽 끝에 닿아야 나아가요 (' + (V.esl || 0) + '초 뒤엔 함께 이동)'; else if (w.length) tx = '🃏 ' + w.join(', ') + ' 친구가 우리 모두의 카드를 고르는 중!'; } wtag.textContent = tx; wtag.style.display = tx ? 'block' : 'none'; } $('pAuto').style.display = (V.paused && V.pl.length > 1) ? 'block' : 'none'; }
  notesTidy();
}
// 알림 정리: 중요한 것만 먼저 보이고, 오래 켜져 있는 안내는 필요할 때만 보여요 (한 번에 최대 3개)
let wxSeen = '', wxUntil = 0;
function notesTidy() {
  const g = (id) => document.getElementById(id), on = (el) => el && el.style.display !== 'none' && el.textContent;
  const now = performance.now(), V0 = V || {};
  const sm = g('smTag'), rt = g('raidTag'), wt = g('wxTag'), ct = g('coopTag'), ib = g('infoBox'), tt = g('toast');
  const smIdle = sm && on(sm) && /^🎯 다음 서브미션까지/.test(sm.textContent), smNt = smIdle ? (V0.sm && V0.sm.nt | 0) : 99;
  if (smIdle && smNt > 8) sm.style.display = 'none';
  if (on(rt) && /습격까지|매복까지/.test(rt.textContent)) { const n = parseInt((rt.textContent.match(/(\d+)초/) || [])[1], 10); if (n > 15) rt.style.display = 'none'; }
  if (on(wt)) { if (wt.textContent !== wxSeen) { wxSeen = wt.textContent; wxUntil = now + 6000; } if (now > wxUntil) wt.style.display = 'none'; } else wxSeen = '';
  if (on(ct) && /올랐어요|모두 격파/.test(ct.textContent)) { if (ct._tx !== ct.textContent) { ct._tx = ct.textContent; ct._u = now + 5000; } if (now > ct._u) ct.style.display = 'none'; }
  const pr = [g('pauseTag'), g('waitTag'), g('lagTag'), ib && ib.classList.contains('on') ? ib : null, tt && tt.dataset.off !== '1' && tt.style.opacity !== '0' && tt.textContent ? tt : null, on(sm) && !smIdle ? sm : null, on(ct) ? ct : null, on(rt) ? rt : null, on(wt) ? wt : null, on(sm) ? sm : null];
  let n = 0; const seen = new Set();
  for (const el of pr) { if (!el || seen.has(el)) continue; seen.add(el); const shown = el === ib ? true : el === tt ? true : el.style.display !== 'none' && el.textContent; if (!shown) continue; if (++n > 3) { if (el === ib) ib.style.visibility = 'hidden'; else if (el === tt) tt.style.visibility = 'hidden'; else el.style.display = 'none'; } else { if (el === ib) ib.style.visibility = ''; if (el === tt) tt.style.visibility = ''; } }
}

// ----- 그리기 -----
const cv = $('cv'), cx = cv.getContext('2d');
let lastFT = performance.now();
function frame() {
  requestAnimationFrame(frame); sendMove(); const nowF = performance.now(), dtF = nowF - lastFT; lastFT = nowF;
  if (V) { syncUI(); if (lastPh === 'battle') { fAcc += Math.min(dtF, 200); fN++; if (fN >= 90) { const avg = fAcc / fN; fAcc = 0; fN = 0; if (ST.q === 'auto' && !autoLow && avg > 36) { autoLow = true; applySt(); toast('기기가 느려서 저사양 모드로 바꿨어요 (⚙ 설정에서 바꿀 수 있어요)'); } } }
    if (isLow() && (skipF ^= 1)) return;
    if (lastPh === 'battle' || lastPh === 'result' || lastPh === 'brief') draw(); }
}
function lerpTo(id, x, y, k) { const now = performance.now() / 1000; let r = RP.get(id);
  if (!r) { r = [x, y, x, y, 0, 0, now, now]; RP.set(id, r); return r; }
  const dt = Math.min(0.1, now - r[7]); r[7] = now;
  if (x !== r[2] || y !== r[3]) { const di = Math.max(0.02, now - r[6]); if (Math.hypot(x - r[2], y - r[3]) > 300) { r[0] = x; r[1] = y; r[4] = r[5] = 0; } else { const nx = (x - r[2]) / di, ny = (y - r[3]) / di; r[4] += (nx - r[4]) * 0.6; r[5] += (ny - r[5]) * 0.6; } r[2] = x; r[3] = y; r[6] = now; }
  const ex = Math.min(0.09, now - r[6]), px = r[2] + r[4] * ex, py = r[3] + r[5] * ex, a = 1 - Math.exp(-dt * 22); // 스냅샷 사이 예측 + 시간 기준 부드러운 추적
  r[0] += (px - r[0]) * a; r[1] += (py - r[1]) * a;
  if (now - r[6] > 0.2) { r[4] *= 0.8; r[5] *= 0.8; }
  return r; }
function rr(x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
function blob(x, y, r, c1, c2, ring, glow) {
  const g = cx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); g.addColorStop(0, c1); g.addColorStop(1, c2);
  if (glow) { cx.shadowColor = glow; cx.shadowBlur = 12; } cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill(); cx.shadowBlur = 0;
  if (ring) { cx.strokeStyle = ring; cx.lineWidth = 3; cx.stroke(); }
}
function face(x, y, r, mood) { // 눈·표정
  const ex = r * 0.38, ey = r * 0.12, er = Math.max(2, r * 0.26);
  cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(x - ex, y - ey, er, 0, 7); cx.arc(x + ex, y - ey, er, 0, 7); cx.fill();
  cx.fillStyle = '#26203a'; cx.beginPath(); cx.arc(x - ex + (mood === 'angry' ? 1 : 0), y - ey + 1, er * 0.55, 0, 7); cx.arc(x + ex - (mood === 'angry' ? 1 : 0), y - ey + 1, er * 0.55, 0, 7); cx.fill();
  cx.strokeStyle = '#26203a'; cx.lineWidth = Math.max(1.5, r * 0.11); cx.lineCap = 'round'; cx.beginPath();
  if (mood === 'angry') { cx.moveTo(x - ex - er, y - ey - er - 1); cx.lineTo(x - ex + er, y - ey - er * 0.2); cx.moveTo(x + ex + er, y - ey - er - 1); cx.lineTo(x + ex - er, y - ey - er * 0.2); }
  else if (mood === 'down') { cx.moveTo(x - ex - 2, y - ey - 1); cx.lineTo(x - ex + 2, y - ey + 1); cx.moveTo(x + ex - 2, y - ey + 1); cx.lineTo(x + ex + 2, y - ey - 1); }
  else { cx.moveTo(x - r * 0.25, y + r * 0.38); cx.quadraticCurveTo(x, y + r * 0.62, x + r * 0.25, y + r * 0.38); }
  cx.stroke();
}
function pill(txt, x, y, bg, fg) { cx.font = 'bold 12px sans-serif'; const w = cx.measureText(txt).width + 14; cx.fillStyle = bg; rr(x - w / 2, y - 9, w, 18, 9); cx.fill(); cx.fillStyle = fg; cx.textAlign = 'center'; cx.fillText(txt, x, y + 4.5); }
// ---- 캐릭터 꾸밈: 머리 장식 + 무기 (글자 대신 모양으로 구분) ----
function gear(kind, x, y, r) {
  cx.lineCap = 'round'; cx.lineJoin = 'round';
  if (kind === 'bow' || kind === 'archer') { // 투구 + 깃
    cx.fillStyle = '#9aa3b5'; cx.beginPath(); cx.arc(x, y - r * 0.15, r * 0.95, Math.PI, 0); cx.closePath(); cx.fill(); cx.strokeStyle = '#4b5366'; cx.lineWidth = 2; cx.stroke();
    cx.fillStyle = '#e05a4f'; cx.beginPath(); cx.arc(x, y - r * 1.05, r * 0.22, 0, 7); cx.fill();
  } else if (kind === 'spear' || kind === 'militia') { // 흰 머리띠
    cx.fillStyle = '#fff'; rr(x - r * 0.95, y - r * 0.6, r * 1.9, r * 0.32, r * 0.16); cx.fill(); cx.strokeStyle = '#c9ccd8'; cx.lineWidth = 1.5; cx.stroke();
    cx.fillStyle = '#fff'; cx.beginPath(); cx.moveTo(x + r * 0.9, y - r * 0.45); cx.lineTo(x + r * 1.5, y - r * 0.2); cx.lineTo(x + r * 0.95, y - r * 0.25); cx.fill();
  } else if (kind === 'gun' || kind === 'gunner') { // 전립(넓은 모자)
    cx.fillStyle = '#6b3f2a'; cx.beginPath(); cx.ellipse(x, y - r * 0.55, r * 1.35, r * 0.34, 0, 0, 7); cx.fill(); cx.strokeStyle = '#3d2216'; cx.lineWidth = 2; cx.stroke();
    cx.fillStyle = '#8a5236'; cx.beginPath(); cx.arc(x, y - r * 0.65, r * 0.62, Math.PI, 0); cx.closePath(); cx.fill(); cx.stroke();
  } else if (kind === 'cannon') { // 검은 투구
    cx.fillStyle = '#3a3f52'; cx.beginPath(); cx.arc(x, y - r * 0.15, r * 0.98, Math.PI, 0); cx.closePath(); cx.fill(); cx.strokeStyle = '#1d2030'; cx.lineWidth = 2; cx.stroke();
    cx.fillStyle = '#ffb347'; cx.beginPath(); cx.arc(x, y - r * 0.95, r * 0.2, 0, 7); cx.fill();
  } else if (kind === 'cav') { // 붉은 술 투구
    cx.fillStyle = '#b8c0d6'; cx.beginPath(); cx.arc(x, y - r * 0.15, r * 0.95, Math.PI, 0); cx.closePath(); cx.fill(); cx.strokeStyle = '#59627a'; cx.lineWidth = 2; cx.stroke();
    cx.strokeStyle = '#e03a3a'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(x, y - r * 1.05); cx.quadraticCurveTo(x + r * 0.5, y - r * 1.6, x + r * 0.7, y - r * 1.0); cx.stroke();
  } else if (kind === 'monk') { // 승려: 민머리 + 염주
    cx.fillStyle = 'rgba(255,255,255,.35)'; cx.beginPath(); cx.arc(x - r * 0.3, y - r * 0.7, r * 0.18, 0, 7); cx.fill();
    cx.strokeStyle = '#8a5a2b'; cx.lineWidth = 3; cx.setLineDash([2, 4]); cx.beginPath(); cx.arc(x, y + r * 0.7, r * 0.7, 0.2, Math.PI - 0.2); cx.stroke(); cx.setLineDash([]);
  }
}
function weapon(kind, x, y, r, ang) {
  cx.save(); cx.translate(x + r * 0.95, y + r * 0.1); cx.rotate(ang || -0.5); cx.lineCap = 'round';
  if (kind === 'bow' || kind === 'archer') { cx.strokeStyle = '#8a5a2b'; cx.lineWidth = 3; cx.beginPath(); cx.arc(0, 0, r * 0.85, -1.2, 1.2); cx.stroke(); cx.strokeStyle = '#fff'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(Math.cos(-1.2) * r * 0.85, Math.sin(-1.2) * r * 0.85); cx.lineTo(Math.cos(1.2) * r * 0.85, Math.sin(1.2) * r * 0.85); cx.stroke(); }
  else if (kind === 'spear' || kind === 'militia') { cx.strokeStyle = '#8a5a2b'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(-r * 0.5, r * 0.6); cx.lineTo(r * 1.1, -r * 0.9); cx.stroke(); cx.fillStyle = '#e8edf7'; cx.beginPath(); cx.moveTo(r * 1.35, -r * 1.2); cx.lineTo(r * 0.95, -r * 0.95); cx.lineTo(r * 1.15, -r * 0.7); cx.closePath(); cx.fill(); }
  else if (kind === 'gun' || kind === 'gunner') { cx.fillStyle = '#6b4a2e'; rr(-r * 0.2, -r * 0.12, r * 0.7, r * 0.3, 3); cx.fill(); cx.fillStyle = '#3a3f4a'; rr(r * 0.4, -r * 0.08, r * 0.9, r * 0.2, 2); cx.fill(); }
  else if (kind === 'cannon') { cx.fillStyle = '#2f3342'; rr(-r * 0.1, -r * 0.3, r * 1.1, r * 0.6, 5); cx.fill(); cx.fillStyle = '#ffb347'; cx.beginPath(); cx.arc(r * 1.0, 0, r * 0.18, 0, 7); cx.fill(); cx.fillStyle = '#4a4f66'; cx.beginPath(); cx.arc(r * 0.1, r * 0.35, r * 0.28, 0, 7); cx.fill(); }
  else if (kind === 'cav') { cx.strokeStyle = '#e8edf7'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(0, r * 0.5); cx.lineTo(r * 1.2, -r * 0.6); cx.stroke(); }
  else if (kind === 'monk') { cx.strokeStyle = '#8a5a2b'; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(-r * 0.4, r * 0.6); cx.lineTo(r * 0.9, -r * 0.8); cx.stroke(); cx.fillStyle = '#a97a45'; cx.beginPath(); cx.arc(r * 1.0, -r * 0.9, r * 0.28, 0, 7); cx.fill(); }
  cx.restore();
}
function drawHorse(x, y, r) { cx.fillStyle = '#8a5a3a'; cx.strokeStyle = '#4a2f1e'; cx.lineWidth = 2; cx.beginPath(); cx.ellipse(x, y + r * 0.85, r * 1.15, r * 0.55, 0, 0, 7); cx.fill(); cx.stroke(); cx.beginPath(); cx.ellipse(x + r * 1.1, y + r * 0.35, r * 0.34, r * 0.5, -0.5, 0, 7); cx.fill(); cx.stroke(); }

// ---- 스프라이트 (AI 그림) ----
const IMG = {}, IMGW = {}, FACE = new Map(), KICK = new Map();
(function () { const S = window.SPR || {}; for (const k in S) { const im = new Image(); im.src = S[k].d; IMG[k] = im; } })();
const FOEP = { 왜군: 'jp', 후금군: 'hg', 청군: 'qg' }, ETK = { grunt: 'inf', shoot: 'rng', cav: 'cav', tank: 'tank', boss: 'boss' };
const EH = { camp: 70, grunt: 52, shoot: 52, cav: 62, tank: 60, boss: 86 };
const RSP = { archer: 'h_archer', militia: 'h_militia', monk: 'h_monk', gunner: 'h_cannon', admiral: 'h_admiral', gwonyul: 'h_gwonyul', gimsimin: 'h_gimsimin', yujeong: 'h_yujeong', jinrin: 'h_jinrin', gwakjaeu: 'h_gwakjaeu', hyujeong: 'h_hyujeong' };
const fr10 = (tm, ph) => Math.floor(tm * 10 + ph);
const USP = { bow: 'u_bow', spear: 'u_spear', gun: 'u_gun', cannon: 'u_cannon', cav: 'u_cav' };
const GR = {}, OUT = 5;
function okImg(n) { if (GR[n]) return GR[n]; const im = IMG[n]; if (!im || !im.complete || !im.naturalWidth) return null;
  const S = (window.SPR || {})[n] || {}, c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0);
  c.iw = c.width; c.ih = c.height; c.pad = 0; c.n = S.n || 1; c.fw = S.fw || c.width; c.step = S.step || 1;
  // 성능: 큰 그림을 화면에 그릴 크기 근처로 한 번만 줄여 둬요 (매 프레임 축소하면 끊겨요)
  const maxH = /^(gate|camp|orb|hwacha)/.test(n) ? 220 : 120;
  if (c.ih > maxH) { const f = maxH / c.ih, nn = c.n, fw0 = c.fw, fw2 = Math.max(1, Math.round(fw0 * f)), h2 = Math.round(c.ih * f), c2 = document.createElement('canvas'); c2.width = fw2 * nn; c2.height = h2; const g2 = c2.getContext('2d'); g2.imageSmoothingEnabled = true; g2.imageSmoothingQuality = 'high';
    for (let i = 0; i < nn; i++) g2.drawImage(c, i * fw0, 0, fw0, c.ih, i * fw2, 0, fw2, h2);
    c2.iw = c2.width; c2.ih = h2; c2.pad = 0; c2.n = nn; c2.fw = fw2; c2.step = c.step; return GR[n] = c2; }
  return GR[n] = c; }
function white(name) { if (IMGW[name]) return IMGW[name]; const im = okImg(name); if (!im) return null; const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); return IMGW[name] = c; }
function spr(name, x, y, h, o) { o = o || {}; const im = okImg(name); if (!im) return; h *= SPS; const k = h / im.ih, fw = im.fw, w = fw * k, hh = im.height * k, fi = im.n > 1 ? ((Math.floor((o.fr || 0) / im.step) % im.n) + im.n) % im.n : 0;
  cx.save(); cx.globalAlpha *= (o.alpha == null ? 1 : o.alpha); cx.translate(x + (o.dx || 0), y - (o.bob || 0) + (o.dy || 0)); cx.rotate(o.lean || 0); cx.scale((o.flip ? -1 : 1) * (o.sx || 1), o.sy || 1);
  cx.drawImage(im, fi * fw, 0, fw, im.height, -w / 2, -hh, w, hh);
  if (o.flash) { const wi = white(name); if (wi) { cx.globalAlpha *= 0.75; cx.drawImage(wi, fi * fw, 0, fw, im.height, -w / 2, -hh, w, hh); } }
  cx.restore(); }
function shade(x, y, w, a) { cx.fillStyle = 'rgba(0,0,0,' + (a || 0.33) + ')'; cx.beginPath(); cx.ellipse(x, y, w, w * 0.32, 0, 0, 7); cx.fill(); }
function kickOf(key, tm) { const k = KICK.get(key); if (!k) return { dx: 0, dy: 0, sx: 1, sy: 1 }; const t = (tm - k.t) / 0.2; if (t >= 1) return { dx: 0, dy: 0, sx: 1, sy: 1 }; const e = Math.sin(Math.PI * Math.min(1, t * 1.15)); return { dx: k.ux * 7 * e, dy: k.uy * 3 * e, sx: 1 + 0.07 * e, sy: 1 - 0.05 * e }; }
function noteShot(a, tm) { const dx = a[2] - a[0], dy = a[3] - a[1], L = Math.hypot(dx, dy) || 1; let key = null;
  if (V.un) for (let i = 0; i < SLOTN; i++) { const q = slotPos(i, V.ax, V.ay); if (V.un[i] && Math.abs(q[0] - a[0]) < 40 && Math.abs(q[1] - a[1]) < 40) { key = 'u' + i; break; } }
  if (!key) { let bd = 60; for (const p of V.pl) { const q = RP.get(p.id); if (!q) continue; const d = Math.hypot(q[0] - a[0], q[1] - a[1]); if (d < bd) { bd = d; key = 'h' + p.id; } } }
  if (key) { KICK.set(key, { t: tm, ux: dx / L, uy: dy / L }); FACE.set(key, dx < 0); } }

// ---- 수묵채색 배경 (한 번만 그려서 재사용) ----
const BGC = {};
function seedR(n) { let v = n; return () => (v = (v * 16807) % 2147483647) / 2147483647; }
function makeBg(th) {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), rn = seedR(th.length * 977 + th.charCodeAt(0) * 31);
  const PAL = THEME[th]; let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, PAL[0]); gr.addColorStop(1, PAL[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 2800; i++) { g.fillStyle = 'rgba(90,66,36,' + (0.03 + rn() * 0.05) + ')'; g.fillRect(rn() * W, rn() * H, 1 + rn() * 2, 1 + rn() * 2); }
  g.lineWidth = 1; for (let i = 0; i < 220; i++) { const x = rn() * W, y = rn() * H, a = rn() * 6.28, l = 6 + rn() * 14; g.strokeStyle = 'rgba(120,90,50,.06)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  const blur = (px, fn) => { g.save(); if ('filter' in g) g.filter = 'blur(' + px + 'px)'; fn(); g.restore(); };
  for (let i = 0; i < 6; i++) { const cx0 = 80 + i * 170 + rn() * 60, cy0 = 30 + rn() * 70, s = 0.8 + rn() * 0.7; g.fillStyle = 'rgba(255,255,255,.62)'; for (const [dx, dy, r] of [[0, 0, 22], [24, -6, 26], [52, 2, 20], [26, 8, 22]]) { g.beginPath(); g.arc(cx0 + dx * s, cy0 + dy * s, r * s, 0, 7); g.fill(); } }
  const ridge = (y0, amp, jag, alpha, hue) => { const pts = []; let n = 36; for (let i = 0; i <= n; i++) { const x = i / n * (W + 40) - 20; pts.push([x, y0 - amp * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.52 + rn() * 1.6 + jag))) * (0.6 + rn() * 0.4)]); }
    g.beginPath(); g.moveTo(-20, y0 + 120); pts.forEach((p) => g.lineTo(p[0], p[1])); g.lineTo(W + 20, y0 + 120); g.closePath(); const f = g.createLinearGradient(0, y0 - amp, 0, y0 + 40); f.addColorStop(0, 'rgba(' + hue + ',' + alpha + ')'); f.addColorStop(1, 'rgba(' + hue + ',0)'); g.fillStyle = f; g.fill(); };
  const pines = (y0, n, a) => { for (let i = 0; i < n; i++) { const x = rn() * W, y = y0 + rn() * 40, h = 14 + rn() * 14; g.fillStyle = 'rgba(40,52,36,' + a + ')'; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x - h * 0.28, y); g.lineTo(x + h * 0.28, y); g.fill(); g.fillRect(x - 0.8, y, 1.6, 4); } };
  const mist = (y, a) => blur(6, () => { const f = g.createLinearGradient(0, y - 30, 0, y + 30); f.addColorStop(0, 'rgba(255,250,235,0)'); f.addColorStop(0.5, 'rgba(255,250,235,' + a + ')'); f.addColorStop(1, 'rgba(255,250,235,0)'); g.fillStyle = f; g.fillRect(0, y - 30, W, 60); });
  if (th === 'plain') { blur(2, () => { ridge(150, 60, 0.3, 0.32, '60,60,70'); ridge(190, 46, 1.2, 0.26, '70,62,50'); }); mist(150, 0.5); mist(215, 0.35); }
  else if (th === 'mount') { blur(2.5, () => { ridge(140, 110, 0.4, 0.4, '45,60,60'); ridge(190, 90, 1.5, 0.32, '50,62,48'); ridge(240, 60, 2.2, 0.25, '55,60,40'); }); pines(150, 18, 0.35); pines(200, 22, 0.32); mist(170, 0.55); mist(250, 0.4); }
  else if (th === 'sea') { const hz = 140; g.fillStyle = 'rgba(255,250,235,.28)'; g.fillRect(0, 0, W, hz); const sg = g.createLinearGradient(0, hz, 0, H); sg.addColorStop(0, 'rgba(70,110,125,.38)'); sg.addColorStop(1, 'rgba(40,80,100,.5)'); g.fillStyle = sg; g.fillRect(0, hz, W, H - hz);
    blur(2, () => { ridge(hz + 4, 40, 0.5, 0.35, '55,70,75'); }); g.lineCap = 'round'; for (let i = 0; i < 90; i++) { const x = rn() * W, y = hz + 14 + rn() * (H - hz - 14), l = 14 + (y - hz) * 0.08 + rn() * 12; g.strokeStyle = 'rgba(235,245,240,' + (0.14 + rn() * 0.18) + ')'; g.lineWidth = 1.2 + (y - hz) * 0.004; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 4, x + l, y); g.stroke(); } mist(hz + 6, 0.55); }
  else { blur(2, () => { ridge(150, 70, 0.8, 0.3, '55,65,70'); ridge(195, 45, 1.9, 0.24, '60,70,55'); }); mist(160, 0.5); g.fillStyle = 'rgba(70,115,125,.14)'; g.fillRect(0, 320, W, 90); mist(330, 0.25); g.lineCap = 'round'; for (let i = 0; i < 60; i++) { const x = rn() * W, y = 400 + rn() * 130, h = 16 + rn() * 22; g.strokeStyle = 'rgba(80,92,50,' + (0.25 + rn() * 0.2) + ')'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 3, y - h * 0.6, x + 6 * (rn() - 0.3), y - h); g.stroke(); } }
  if (th !== 'sea') { g.lineCap = 'round'; for (let i = 0; i < 80; i++) { const x = rn() * W, y = 260 + rn() * 270; g.strokeStyle = 'rgba(70,80,40,' + (0.2 + rn() * 0.2) + ')'; g.lineWidth = 1.3; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + k * 2, y - 6, x + k * 5, y - 10 - rn() * 3); g.stroke(); } } }
  const vg = g.createRadialGradient(W / 2, H / 2, 240, W / 2, H / 2, 640); vg.addColorStop(0, 'rgba(60,40,20,0)'); vg.addColorStop(1, 'rgba(60,50,30,.2)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  
  return c;
}

// ---- 넓은 들판 (한 번만 그려서 재사용) ----
const WLD = {};
function makeWorld(th, ww, wh, obj, key) {
  const c = document.createElement('canvas'); c.width = ww; c.height = wh; const g = c.getContext('2d'), rn = seedR(key * 7919 + 13);
  const sea = th === 'sea', base = sea ? '#9ed3dc' : th === 'mount' ? '#a8d29a' : th === 'river' ? '#b4dba4' : '#bde3a0';
  g.fillStyle = base; g.fillRect(0, 0, ww, wh);
  for (let i = 0; i < ww * wh / 9000; i++) { const x = rn() * ww, y = rn() * wh, r = 40 + rn() * 90; g.fillStyle = rn() < 0.5 ? 'rgba(255,255,255,.10)' : 'rgba(40,110,60,.07)'; g.beginPath(); g.ellipse(x, y, r, r * 0.6, 0, 0, 7); g.fill(); }
  if (sea) { g.lineCap = 'round'; for (let i = 0; i < ww * wh / 4000; i++) { const x = rn() * ww, y = rn() * wh, l = 20 + rn() * 30; g.strokeStyle = 'rgba(255,255,255,' + (0.18 + rn() * 0.2) + ')'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 6, x + l, y); g.stroke(); }
    const dw = ww * 0.62, dh = wh * 0.62, dx = (ww - dw) / 2, dy = (wh - dh) / 2; g.fillStyle = 'rgba(60,40,20,.25)'; g.fillRect(dx + 10, dy + 14, dw, dh); g.fillStyle = '#c99a62'; g.fillRect(dx, dy, dw, dh); for (let y = dy; y < dy + dh; y += 38) { g.fillStyle = (Math.floor((y - dy) / 38) % 2) ? '#bd8d56' : '#d3a86f'; g.fillRect(dx, y, dw, 37); g.strokeStyle = 'rgba(80,50,20,.35)'; g.lineWidth = 2; g.strokeRect(dx, y, dw, 38); }
    g.strokeStyle = '#7a4a24'; g.lineWidth = 14; g.strokeRect(dx, dy, dw, dh); }
  else {
    if (th === 'river') { g.fillStyle = 'rgba(120,190,215,.9)'; g.beginPath(); g.moveTo(0, wh * 0.78); for (let x = 0; x <= ww; x += 60) g.lineTo(x, wh * 0.78 + Math.sin(x / 190) * 40 - 30); for (let x = ww; x >= 0; x -= 60) g.lineTo(x, wh * 0.78 + 110 + Math.sin(x / 150 + 2) * 30); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 4; g.stroke(); }
    // 길
    const rd = []; const horiz = obj === 'e' || obj === 'r'; for (let i = 0; i <= 12; i++) rd.push(horiz ? [i / 12 * ww, wh * 0.5 + Math.sin(i / 12 * Math.PI * 4) * 130] : [ww / 2 + Math.sin(i * 1.1) * 160, i / 12 * wh]);
    const road = (w, col) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); rd.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.stroke(); }; road(74, 'rgba(120,90,50,.28)'); road(64, '#d9be86'); road(52, '#ecd9a6');
    // 바위/덤불
    for (let i = 0; i < ww * wh / 30000; i++) { const x = rn() * ww, y = rn() * wh, r = 8 + rn() * 12; g.fillStyle = 'rgba(0,0,0,.12)'; g.beginPath(); g.ellipse(x, y + r * 0.7, r * 1.2, r * 0.4, 0, 0, 7); g.fill(); g.fillStyle = '#b8b3a6'; g.beginPath(); g.ellipse(x, y, r, r * 0.75, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(x - r * 0.3, y - r * 0.3, r * 0.4, r * 0.25, 0, 0, 7); g.fill(); }
    // 꽃
    for (let i = 0; i < ww * wh / 2500; i++) { g.fillStyle = ['#fff6a8', '#ffd0dc', '#ffffff'][rint(3)]; g.beginPath(); g.arc(rn() * ww, rn() * wh, 2.2, 0, 7); g.fill(); }
    { const ch = R[key - 1].ch, cast = obj === 'd' || obj === 'b', cxm = ww / 2, cym = wh / 2, far = (x, y) => !(cast && Math.hypot(x - cxm, y - cym) < 340);
      if (ch >= 2) { g.fillStyle = 'rgba(238,246,255,.36)'; g.fillRect(0, 0, ww, wh); for (let i = 0; i < ww * wh / 22000; i++) { const x = rn() * ww, y = rn() * wh, r = 20 + rn() * 50; g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(x, y, r, r * 0.55, 0, 0, 7); g.fill(); } }
      for (let i = 0; i < ww * wh / 800000; i++) { const x = 120 + rn() * (ww - 360), y = 120 + rn() * (wh - 300), w = 150 + rn() * 130, h = 90 + rn() * 70; if (!far(x, y) || !far(x + w, y + h)) continue; g.fillStyle = ch >= 2 ? '#dfe9d6' : '#9fcb6a'; g.fillRect(x, y, w, h); g.strokeStyle = ch >= 2 ? '#b9c8ad' : '#7fae4e'; g.lineWidth = 2; for (let yy = y + 10; yy < y + h; yy += 12) { g.beginPath(); g.moveTo(x + 4, yy); g.lineTo(x + w - 4, yy); g.stroke(); } g.strokeStyle = '#b89462'; g.lineWidth = 5; g.strokeRect(x, y, w, h); }
      for (let i = 0; i < 4 + (ww > 3000 ? 3 : 0); i++) { const x = 160 + rn() * (ww - 520), y = 160 + rn() * (wh - 320), w = 180 + rn() * 160; if (!far(x, y) || !far(x + w, y)) continue; g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x + 6, y + 18, w, 18); g.fillStyle = '#c9c2b2'; g.fillRect(x, y, w, 28); g.strokeStyle = '#7d7566'; g.lineWidth = 3; g.strokeRect(x, y, w, 28); g.beginPath(); for (let xx = x + 24; xx < x + w; xx += 24) { g.moveTo(xx, y); g.lineTo(xx, y + 28); } g.stroke(); for (let xx = x; xx < x + w - 10; xx += 28) { g.fillStyle = '#d6cfbf'; g.fillRect(xx + 2, y - 11, 16, 12); g.strokeRect(xx + 2, y - 11, 16, 12); } }
      for (let i = 0; i < ww * wh / 700000; i++) { const x = 140 + rn() * (ww - 300), y = 150 + rn() * (wh - 300); if (!far(x, y)) continue; g.fillStyle = 'rgba(0,0,0,.14)'; g.beginPath(); g.ellipse(x, y + 30, 58, 13, 0, 0, 7); g.fill(); g.fillStyle = '#f4ead2'; g.fillRect(x - 38, y - 8, 76, 36); g.strokeStyle = '#6a4a2a'; g.lineWidth = 2.5; g.strokeRect(x - 38, y - 8, 76, 36); g.fillStyle = '#4a4f58'; g.beginPath(); g.moveTo(x - 58, y - 4); g.quadraticCurveTo(x - 40, y - 8, x - 28, y - 34); g.lineTo(x + 28, y - 34); g.quadraticCurveTo(x + 40, y - 8, x + 58, y - 4); g.quadraticCurveTo(x, y + 6, x - 58, y - 4); g.fill(); g.stroke(); g.fillStyle = '#7a4a24'; g.fillRect(x - 8, y + 4, 16, 24); }
      for (let i = 0; i < 9; i++) { const x = 100 + rn() * (ww - 200), y = 140 + rn() * (wh - 240); if (!far(x, y)) continue; const col = rn() < 0.5 ? '#d9453a' : '#3f6fd6'; g.fillStyle = 'rgba(0,0,0,.14)'; g.beginPath(); g.ellipse(x, y + 4, 14, 5, 0, 0, 7); g.fill(); g.fillStyle = '#6a4222'; g.fillRect(x - 2, y - 62, 4, 66); g.fillStyle = col; g.beginPath(); g.moveTo(x + 2, y - 62); g.quadraticCurveTo(x + 30, y - 58, x + 40, y - 46); g.quadraticCurveTo(x + 22, y - 36, x + 2, y - 36); g.fill(); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.5; g.stroke(); }
      for (let i = 0; i < 8; i++) { const x = 120 + rn() * (ww - 240), y = 120 + rn() * (wh - 240); if (!far(x, y)) continue; g.fillStyle = 'rgba(50,38,30,.32)'; g.beginPath(); g.ellipse(x, y, 46 + rn() * 26, 22 + rn() * 12, 0, 0, 7); g.fill(); for (let k = 0; k < 7; k++) { g.fillStyle = k % 2 ? '#ff9a2e' : '#ffd84a'; g.fillRect(x + rn() * 60 - 30, y + rn() * 24 - 12, 3, 3); } g.strokeStyle = '#4a3320'; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 10, y + 6); g.lineTo(x + 10, y - 6); g.moveTo(x + 10, y + 6); g.lineTo(x - 10, y - 6); g.stroke(); }
      for (let i = 0; i < 10; i++) { const x = 100 + rn() * (ww - 200), y = 120 + rn() * (wh - 220); if (!far(x, y)) continue; g.strokeStyle = '#6a4a2a'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 12, y + 6); g.lineTo(x + 14, y - 14); g.stroke(); g.fillStyle = '#b4bfca'; g.beginPath(); g.moveTo(x + 14, y - 14); g.lineTo(x + 20, y - 24); g.lineTo(x + 8, y - 18); g.fill(); }
    }
    // 초가집
    for (let i = 0; i < ww * wh / 260000; i++) { const x = 140 + rn() * (ww - 280), y = 140 + rn() * (wh - 280); g.fillStyle = 'rgba(0,0,0,.14)'; g.beginPath(); g.ellipse(x, y + 24, 46, 12, 0, 0, 7); g.fill(); g.fillStyle = '#f1e3c4'; g.fillRect(x - 30, y - 8, 60, 30); g.fillStyle = '#d8b66e'; g.beginPath(); g.moveTo(x - 42, y - 6); g.lineTo(x, y - 40); g.lineTo(x + 42, y - 6); g.closePath(); g.fill(); g.strokeStyle = '#8c6a44'; g.lineWidth = 2; g.stroke(); g.fillStyle = '#8c6a44'; g.fillRect(x - 6, y + 4, 12, 18); }
    // 나무 (먼저 아래쪽부터)
    const trees = []; for (let i = 0; i < ww * wh / 17000; i++) { const tx = rn() * ww, ty = rn() * wh; if (Math.hypot(tx - ww / 2, ty - wh / 2) < 230 && obj !== 'e' && obj !== 'r') continue; if (obj === 'e' && tx < 420) continue; trees.push([tx, ty, 22 + rn() * 18]); } trees.sort((A, B) => A[1] - B[1]);
    for (const [x, y, r] of trees) { g.fillStyle = 'rgba(0,0,0,.14)'; g.beginPath(); g.ellipse(x, y + r * 0.9, r * 0.9, r * 0.28, 0, 0, 7); g.fill(); g.fillStyle = '#8c6a44'; g.fillRect(x - 3, y, 6, r * 0.9); const cl = th === 'mount' ? ['#4f9a5c', '#68b36f'] : ['#69b36a', '#86cc7f']; g.fillStyle = cl[0]; g.beginPath(); g.arc(x, y - r * 0.2, r, 0, 7); g.fill(); g.fillStyle = cl[1]; g.beginPath(); g.arc(x - r * 0.25, y - r * 0.45, r * 0.65, 0, 7); g.fill(); }
  }
  g.strokeStyle = 'rgba(70,50,30,.35)'; g.lineWidth = 10; g.strokeRect(0, 0, ww, wh);
  return c;
}
function drawCamp(x, y, hp, tm) {
  cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.ellipse(x, y + 4, 44, 13, 0, 0, 7); cx.fill();
  cx.fillStyle = '#c8b58a'; cx.fillRect(x - 32, y - 38, 64, 40); cx.fillStyle = '#9c3f34'; cx.beginPath(); cx.moveTo(x - 44, y - 36); cx.lineTo(x, y - 74); cx.lineTo(x + 44, y - 36); cx.closePath(); cx.fill(); cx.strokeStyle = '#5e2118'; cx.lineWidth = 2.5; cx.stroke();
  cx.fillStyle = '#6e4a2a'; cx.fillRect(x - 8, y - 22, 16, 24); cx.fillStyle = '#d9453a'; cx.fillRect(x + 36, y - 82, 3, 60); cx.beginPath(); cx.moveTo(x + 39, y - 82); cx.lineTo(x + 62, y - 74 + Math.sin(tm * 4) * 2); cx.lineTo(x + 39, y - 64); cx.fill();
  const bw = 70; cx.fillStyle = 'rgba(0,0,0,.55)'; rr(x - bw / 2, y - 94, bw, 7, 3.5); cx.fill(); cx.fillStyle = '#ff9a3c'; rr(x - bw / 2, y - 94, bw * Math.max(0.04, hp), 7, 3.5); cx.fill();
}
function lobbyArt() {
  const cv = document.getElementById('lobCv'); if (cv) { const g = cv.getContext('2d'); g.drawImage(makeBg('mount'), 0, 0);
    const sx = 700, sy = 150; let rg = g.createRadialGradient(sx, sy, 20, sx, sy, 190); rg.addColorStop(0, 'rgba(210,90,60,.55)'); rg.addColorStop(1, 'rgba(210,90,60,0)'); g.fillStyle = rg; g.fillRect(sx - 200, sy - 200, 400, 400);
    g.fillStyle = 'rgba(176,44,34,.92)'; g.beginPath(); g.arc(sx, sy, 64, 0, 7); g.fill();
    const peak = (x, h, a, w) => { g.beginPath(); g.moveTo(x - w, 360); g.quadraticCurveTo(x - w * 0.4, 360 - h * 0.45, x - w * 0.08, 360 - h * 0.92); g.quadraticCurveTo(x, 360 - h * 1.02, x + w * 0.1, 360 - h * 0.9); g.quadraticCurveTo(x + w * 0.45, 360 - h * 0.45, x + w, 360); g.closePath(); const f = g.createLinearGradient(0, 360 - h, 0, 370); f.addColorStop(0, 'rgba(40,46,44,' + a + ')'); f.addColorStop(1, 'rgba(40,46,44,.08)'); g.fillStyle = f; g.fill(); };
    g.save(); if ('filter' in g) g.filter = 'blur(1.6px)'; peak(430, 120, 0.34, 150); peak(560, 190, 0.5, 170); peak(700, 150, 0.42, 150); peak(830, 210, 0.55, 170); peak(930, 120, 0.4, 120); g.restore();
    g.fillStyle = 'rgba(240,230,205,.65)'; const mg = g.createLinearGradient(0, 300, 0, 380); mg.addColorStop(0, 'rgba(240,230,205,0)'); mg.addColorStop(0.6, 'rgba(240,230,205,.7)'); mg.addColorStop(1, 'rgba(240,230,205,0)'); g.fillStyle = mg; g.fillRect(0, 300, 960, 80);
    const gd = g.createLinearGradient(0, 400, 0, 540); gd.addColorStop(0, 'rgba(110,86,52,0)'); gd.addColorStop(1, 'rgba(80,58,30,.55)'); g.fillStyle = gd; g.fillRect(0, 400, 960, 140);
    g.strokeStyle = 'rgba(30,24,16,.8)'; g.lineCap = 'round'; for (let i = 0; i < 6; i++) { const bx = 560 + i * 26 + (i % 2) * 8, by = 70 + (i % 3) * 16 + i * 4; g.lineWidth = 2; g.beginPath(); g.moveTo(bx - 8, by); g.quadraticCurveTo(bx - 3, by - 6, bx, by); g.quadraticCurveTo(bx + 3, by - 6, bx + 8, by); g.stroke(); }
    const lg = g.createLinearGradient(0, 0, 560, 0); lg.addColorStop(0, 'rgba(238,228,202,.82)'); lg.addColorStop(0.6, 'rgba(238,228,202,.45)'); lg.addColorStop(1, 'rgba(238,228,202,0)'); g.fillStyle = lg; g.fillRect(0, 0, 560, 540);
    // 소나무 가지 (오른쪽 위)
    g.strokeStyle = '#2a2016'; g.lineWidth = 7; g.beginPath(); g.moveTo(980, 20); g.quadraticCurveTo(900, 40, 840, 18); g.stroke(); g.lineWidth = 4; g.beginPath(); g.moveTo(900, 36); g.quadraticCurveTo(880, 70, 850, 84); g.stroke();
    for (const [px, py, r] of [[850, 22, 34], [815, 26, 24], [858, 88, 28], [925, 40, 30], [880, 50, 22]]) for (let k = 0; k < 26; k++) { const an = k * 0.35 + px, rr2 = r * (0.5 + (k % 5) * 0.12); g.strokeStyle = 'rgba(38,58,36,.75)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(an) * rr2, py + Math.sin(an) * rr2 * 0.7 + 6); g.stroke(); }
  }
  const el = document.getElementById('lobArt'); if (!el || !window.SPR) return;
  const L = [['gate', 360, 110, 0.55], ['jp_boss', 20, 150, 1], ['h_militia', 80, 215, 1], ['h_archer', 175, 262, 1], ['h_monk', 285, 228, 1], ['h_cannon', 372, 205, 1]];
  L.forEach(([n, x, h, o], i) => { const S = SPR[n]; if (!S) return; const im = document.createElement(S.p || !S.n ? 'img' : 'div'); if (im.tagName === 'IMG') { im.src = S.p || S.d; im.style.height = h + 'px'; } else { const k = h / S.h; im.style.width = Math.round(S.fw * k) + 'px'; im.style.height = h + 'px'; im.style.background = `url(${S.d}) 0 0 / ${Math.round(S.fw * S.n * k)}px ${h}px no-repeat`; im.style.position = 'absolute'; } im.style.left = x + 'px'; im.style.opacity = o; im.style.animationDelay = (i * 0.5) + 's'; if (n === 'gate') { im.style.bottom = '140px'; im.style.left = '395px'; im.style.animation = 'none'; } el.appendChild(im); });
}
function unitFig(kind, x, y, lv, c, tm) {
  const r = 12 + lv * 1.5, bob = Math.sin(tm * 4 + x) * 1.2; y += bob;
  if (kind === 'cav') drawHorse(x, y, r);
  weapon(kind, x, y, r); blob(x, y, r, '#ffffff', c, '#fff', c); face(x, y + 1, r * 0.9, 'happy'); gear(kind, x, y, r);
}
function draw() {
  if (V.ph !== 'battle' && V.ph !== 'result') return; const th = THEME[R[V.rd].th], tm = performance.now() / 1000;
  if (lastBh >= 0 && V.bh < lastBh - 0.5) shake = Math.max(shake, 0.18); lastBh = V.bh;
  { const rs = cv.width / W; cx.setTransform(rs, 0, 0, rs, 0, 0); } const LOW = isLow(), DT = LOW ? 1 / 30 : 1 / 60;
  cx.save(); if (shake > 0) { cx.translate((Math.random() - 0.5) * shake * 26, (Math.random() - 0.5) * shake * 26); shake = Math.max(0, shake - 1 / 60); }
  if (!V.ww) { cx.restore(); return; }
  cx.fillStyle = th[1]; cx.fillRect(-20, -20, W + 40, H + 40);
  { if (lastRdSf !== V.rd) { lastRdSf = V.rd; lastSf = V.sf || 0; } if ((V.sf || 0) > lastSf) { const d = ((V.sf || 0) - lastSf) * ESHIFT; lastSf = V.sf; cam.x -= d; for (const r of RP.values()) { r[0] -= d; r[2] -= d; } }
    const me = RP.get(Net.id) || [V.ax, V.ay]; const VW = W / Z, VH = H / Z, tx = Math.max(0, Math.min(V.ww - VW, me[0] - VW * (V.obj === 'e' ? 0.32 : 0.5))), ty = Math.max(0, Math.min(V.wh - VH, me[1] - VH / 2)); if (cam.rd !== V.rd || cam.t0 !== V.ww) { cam.x = tx; cam.y = ty; cam.rd = V.rd; cam.t0 = V.ww; } else { const ca = 1 - Math.exp(-DT * 9); cam.x += (tx - cam.x) * ca; cam.y += (ty - cam.y) * ca; } }
  cx.save(); cx.scale(Z, Z); cx.translate(-cam.x, -cam.y);
  const rth = R[V.rd].th; cx.drawImage(WLD[V.rd] || (WLD[V.rd] = makeWorld(rth, V.ww, V.wh, V.obj, V.rd + 1)), 0, 0);
  const SP = []; for (let i = 0; i < SLOTN; i++) SP.push(slotPos(i, V.ax, V.ay));
  // 성 / 목표물
  if (V.castle && rth === 'sea') { cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.ellipse(V.ax, V.ay + 30, 150, 100, 0, 0, 7); cx.fill(); cx.fillStyle = '#6e4a2a'; cx.fillRect(V.ax - 6, V.ay - 110, 12, 150); cx.fillStyle = '#f3ead2'; cx.strokeStyle = '#8c6a44'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(V.ax + 6, V.ay - 104); cx.quadraticCurveTo(V.ax + 80 + Math.sin(tm * 2) * 5, V.ay - 70, V.ax + 6, V.ay - 20); cx.closePath(); cx.fill(); cx.stroke(); cx.fillStyle = '#d9453a'; cx.beginPath(); cx.moveTo(V.ax - 6, V.ay - 110); cx.lineTo(V.ax - 52, V.ay - 98 + Math.sin(tm * 4) * 3); cx.lineTo(V.ax - 6, V.ay - 84); cx.fill();
    cx.fillStyle = 'rgba(0,0,0,.55)'; rr(V.ax - 56, V.ay - 128, 112, 10, 5); cx.fill(); cx.fillStyle = V.bh / V.bm > 0.3 ? '#7ddf8b' : '#ff6b6b'; rr(V.ax - 56, V.ay - 128, 112 * Math.max(0.03, V.bh / V.bm), 10, 5); cx.fill(); }
  else if (V.castle) { const wob = Math.sin(tm * 2) * 0.01; cx.fillStyle = 'rgba(0,0,0,.16)'; cx.beginPath(); cx.ellipse(V.ax, V.ay + 20, 170, 120, 0, 0, 7); cx.fill(); cx.strokeStyle = '#a7a094'; cx.lineWidth = 14; cx.beginPath(); cx.ellipse(V.ax, V.ay + 8, 160, 112, 0, 0, 7); cx.stroke(); cx.strokeStyle = '#d6d0c2'; cx.lineWidth = 8; cx.stroke(); cx.fillStyle = 'rgba(214,186,130,.45)'; cx.fill();
    shade(V.ax, V.ay + 46, 50, 0.3); spr('gate', V.ax, V.ay + 44, 100, { lean: wob });
    cx.fillStyle = 'rgba(0,0,0,.55)'; rr(V.ax - 56, V.ay - 76, 112, 10, 5); cx.fill(); cx.fillStyle = V.bh / V.bm > 0.3 ? '#7ddf8b' : '#ff6b6b'; rr(V.ax - 56, V.ay - 76, 112 * Math.max(0.03, V.bh / V.bm), 10, 5); cx.fill(); }
  if (V.cpl && !V.cgd) V.cpl.forEach((q) => { cx.save(); cx.strokeStyle = q[2] ? '#ffd34d' : '#fff'; cx.fillStyle = q[2] ? 'rgba(255,211,77,.38)' : 'rgba(255,255,255,.2)'; cx.lineWidth = 5; cx.beginPath(); cx.ellipse(q[0], q[1], 90, 46, 0, 0, 7); cx.fill(); cx.stroke(); cx.fillStyle = '#fff'; cx.font = '800 26px sans-serif'; cx.textAlign = 'center'; cx.fillText('🔥', q[0], q[1] + 9); cx.restore(); });
  if (V.obj === 'e') (V.goals || []).forEach((q, i) => { const done = i < V.gi, cur = i === V.gi; cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.ellipse(q[0], q[1] + 6, 40, 12, 0, 0, 7); cx.fill(); cx.fillStyle = '#7a4a24'; cx.fillRect(q[0] - 3, q[1] - 90, 6, 96); cx.fillStyle = done ? '#9aa39a' : (i === V.goals.length - 1 ? '#f0c040' : '#e04a3c'); cx.beginPath(); cx.moveTo(q[0] + 3, q[1] - 90); cx.lineTo(q[0] + 52, q[1] - 76 + Math.sin(tm * 4 + i) * 3); cx.lineTo(q[0] + 3, q[1] - 56); cx.fill(); if (cur) { cx.strokeStyle = '#ffd34d'; cx.lineWidth = 4; cx.setLineDash([8, 8]); cx.lineDashOffset = -tm * 20; cx.beginPath(); cx.ellipse(q[0], q[1] + 6, 85, 38, 0, 0, 7); cx.stroke(); cx.setLineDash([]); } });
  // 슬롯 바닥
  if (V.obj !== 'e') SP.forEach((s, i) => { if (i >= (V.slots || 8)) return; cx.fillStyle = 'rgba(70,46,22,.14)'; cx.beginPath(); cx.ellipse(s[0], s[1] + 16, 22, 9, 0, 0, 7); cx.fill(); cx.setLineDash([4, 5]); cx.strokeStyle = sel === i ? '#a8322a' : 'rgba(70,46,22,.4)'; cx.lineWidth = sel === i ? 3 : 1.5; cx.stroke(); cx.setLineDash([]); });
  if (V.du) { const D = V.du, VW2 = W / Z, VH2 = H / Z, pr = (a) => Math.min(1, Math.max(0, a)); cx.save(); cx.fillStyle = 'rgba(10,6,20,.5)'; cx.beginPath(); cx.rect(cam.x - 40, cam.y - 40, VW2 + 80, VH2 + 80); cx.arc(D.cx, D.cy, D.R, 0, 7); cx.fill('evenodd'); cx.fillStyle = 'rgba(255,240,200,.10)'; cx.beginPath(); cx.arc(D.cx, D.cy, D.R, 0, 7); cx.fill(); cx.strokeStyle = 'rgba(255,214,110,.95)'; cx.lineWidth = 6; cx.setLineDash([22, 12]); cx.stroke(); cx.setLineDash([]);
    for (const t of D.tl) { const k = 1 - t[6], al = 0.16 + 0.34 * k; cx.fillStyle = `rgba(255,50,40,${al})`; cx.strokeStyle = 'rgba(255,90,70,.9)'; cx.lineWidth = 3;
      if (t[0] === 'ring' || t[0] === 'slam') { cx.beginPath(); cx.arc(t[1], t[2], t[3], 0, 7); cx.fill(); cx.stroke(); cx.beginPath(); cx.arc(t[1], t[2], t[3] * k, 0, 7); cx.stroke(); }
      else if (t[0] === 'dash') { const a = Math.atan2(t[5] - t[2], t[4] - t[1]), L = Math.hypot(t[4] - t[1], t[5] - t[2]); cx.save(); cx.translate(t[1], t[2]); cx.rotate(a); cx.fillRect(0, -22, L, 44); cx.strokeRect(0, -22, L, 44); cx.restore(); }
      else if (t[0] === 'fan') { cx.beginPath(); cx.moveTo(t[1], t[2]); cx.arc(t[1], t[2], 430, t[7] - 0.62, t[7] + 0.62); cx.closePath(); cx.fill(); cx.stroke(); } }
    for (const q of D.pj) { cx.fillStyle = 'rgba(255,90,60,.35)'; cx.beginPath(); cx.arc(q[0], q[1] - 8, 13, 0, 7); cx.fill(); cx.fillStyle = '#7a1010'; cx.beginPath(); cx.arc(q[0], q[1] - 8, 7, 0, 7); cx.fill(); cx.strokeStyle = '#ffd0c0'; cx.lineWidth = 2; cx.stroke(); }
    cx.restore(); }
  if (V.bc) { const [bx, by, bst, bp] = V.bc, pu2 = Math.sin(tm * 5) * 0.5 + 0.5; cx.save(); cx.fillStyle = 'rgba(255,140,40,' + (bst ? 0.16 : 0.1) + ')'; cx.beginPath(); cx.arc(bx, by, bst ? 230 : 85, 0, 7); cx.fill(); cx.strokeStyle = '#ff8a2a'; cx.lineWidth = 4; cx.setLineDash([10, 8]); cx.beginPath(); cx.arc(bx, by, bst ? 230 : 85, 0, 7); cx.stroke(); cx.setLineDash([]); cx.fillStyle = '#5a3a1a'; cx.fillRect(bx - 10, by - 6, 20, 14); cx.fillStyle = 'rgba(255,' + (150 + pu2 * 80 | 0) + ',40,.95)'; cx.beginPath(); cx.arc(bx, by - 18 - pu2 * 4, 11 + pu2 * 3, 0, 7); cx.fill(); if (bst) { cx.strokeStyle = '#ffd34d'; cx.lineWidth = 7; cx.beginPath(); cx.arc(bx, by, 230, -1.57, -1.57 + 6.283 * bp / 100); cx.stroke(); } cx.restore(); }
  for (const a of V.al || []) { const [ax, ay, gg, dn] = a, pu = Math.sin(tm * 3) * 0.5 + 0.5; cx.save(); cx.globalAlpha = dn ? 0.35 : 1; cx.fillStyle = dn ? 'rgba(120,120,120,.3)' : 'rgba(160,90,255,.22)'; cx.beginPath(); cx.arc(ax, ay, 75, 0, 7); cx.fill(); cx.strokeStyle = dn ? '#999' : '#a05cff'; cx.lineWidth = 3; cx.setLineDash([8, 6]); cx.beginPath(); cx.arc(ax, ay, 75, 0, 7); cx.stroke(); cx.setLineDash([]);
    cx.fillStyle = dn ? '#8a8a8a' : '#6f4bb8'; cx.fillRect(ax - 16, ay - 8, 32, 14); cx.fillStyle = dn ? '#aaa' : '#a98bff'; cx.fillRect(ax - 10, ay - 26, 20, 20); if (!dn) { cx.fillStyle = 'rgba(255,230,120,' + (0.5 + pu * 0.5) + ')'; cx.beginPath(); cx.arc(ax, ay - 30, 7, 0, 7); cx.fill(); }
    if (!dn && gg > 0) { cx.strokeStyle = '#ffd34d'; cx.lineWidth = 6; cx.beginPath(); cx.arc(ax, ay, 75, -1.57, -1.57 + 6.283 * gg / 100); cx.stroke(); } cx.restore(); }
  for (const c of V.cr || []) { if (c[2] === 'gmc') continue; if (c[2] === 'jmk') { const bb = Math.sin(tm * 3 + c[0]) * 3; cx.fillStyle = 'rgba(90,200,255,.28)'; cx.beginPath(); cx.arc(c[0], c[1] - 12 + bb, 28, 0, 7); cx.fill(); cx.font = '30px sans-serif'; cx.textAlign = 'center'; cx.fillStyle = '#fff'; cx.fillText('🎵', c[0], c[1] - 2 + bb); cx.textAlign = 'start'; continue; } const bob = Math.sin(tm * 3 + c.length) * 2, chest = c[2] === 'chest'; cx.fillStyle = 'rgba(0,0,0,.2)'; cx.beginPath(); cx.ellipse(c[0], c[1] + 10, 22, 7, 0, 0, 7); cx.fill();
    cx.fillStyle = chest ? '#e6b53c' : '#c8985a'; cx.strokeStyle = chest ? '#7a4a00' : '#6e4a2a'; cx.lineWidth = 2.5; rr(c[0] - 17, c[1] - 24 + bob, 34, 30, 5); cx.fill(); cx.stroke(); cx.strokeStyle = chest ? '#fff3b0' : '#9c7040'; cx.beginPath(); cx.moveTo(c[0] - 17, c[1] - 12 + bob); cx.lineTo(c[0] + 17, c[1] - 12 + bob); cx.stroke();
    cx.font = '16px sans-serif'; cx.textAlign = 'center'; cx.fillText(chest ? '🎁' : '🌾', c[0], c[1] - 3 + bob); if (chest) { cx.globalAlpha = 0.4 + 0.3 * Math.sin(tm * 6); cx.strokeStyle = '#fff3b0'; cx.lineWidth = 3; cx.beginPath(); cx.arc(c[0], c[1] - 8, 26, 0, 7); cx.stroke(); cx.globalAlpha = 1; } }
  for (const c of V.cr || []) if (c[2] === 'gmc') { const bob = Math.sin(tm * 3 + c[0]) * 3; cx.fillStyle = 'rgba(255,80,60,.25)'; cx.beginPath(); cx.arc(c[0], c[1] - 12 + bob, 26, 0, 7); cx.fill(); cx.fillStyle = '#fff6e0'; cx.strokeStyle = '#7a2a1a'; cx.lineWidth = 2.5; cx.beginPath(); cx.arc(c[0], c[1] - 12 + bob, 17, 0, 7); cx.fill(); cx.stroke(); cx.imageSmoothingEnabled = false; cx.drawImage(ICOC('scroll'), c[0] - 11, c[1] - 24 + bob, 22, 22); cx.imageSmoothingEnabled = true; }
  for (const q of V.so || []) { const bb = Math.sin(tm * 4 + q[0] * 0.05) * 2.5, sz = q[2] > 2 ? 1.4 : 1; cx.fillStyle = 'rgba(120,215,255,.28)'; cx.beginPath(); cx.arc(q[0], q[1] - 7 + bb, 13 * sz, 0, 7); cx.fill(); cx.fillStyle = '#bff3ff'; cx.beginPath(); cx.moveTo(q[0], q[1] - 22 * sz + bb); cx.quadraticCurveTo(q[0] + 8 * sz, q[1] - 8 + bb, q[0], q[1] + bb); cx.quadraticCurveTo(q[0] - 8 * sz, q[1] - 8 + bb, q[0], q[1] - 22 * sz + bb); cx.fill(); cx.fillStyle = '#fff'; cx.beginPath(); cx.ellipse(q[0], q[1] - 7 + bb, 2.6 * sz, 5 * sz, 0, 0, 7); cx.fill(); }
  const FC = { 왜군: ['#ff9a8f', '#d9453a'], 후금군: ['#d9a4ff', '#8e3fd0'], 청군: ['#8fc2ff', '#2f6fd6'] }[CH[R[V.rd].ch].foe], FP = FOEP[CH[R[V.rd].ch].foe];
  if (V !== lastGV) { lastGV = V; gvT = tm; } const gT = V.t + (V.paused ? 0 : Math.min(0.2, tm - gvT));
  const DL = []; // 깊이(y) 순서로 그리기
  SP.forEach((s0, i) => { const u = V.un && V.un[i]; if (!u) return; const s = u.x !== undefined ? [u.x, u.y] : s0; DL.push([s[1] + 16, () => { cx.globalAlpha = u.dn > 0 ? 0.35 : 1; const T = UT[u.t], key = 'u' + i, kk = kickOf(key, tm), h = 46 + u.lv * 4, fl = FACE.has(key) ? FACE.get(key) : false;
      shade(s[0], s[1] + 16, 15 + u.lv * 2); spr(USP[u.t], s[0], s[1] + 16, h, { fr: fr10(tm, i * 7), flip: fl, bob: Math.abs(Math.sin(tm * 2.2 + i)) * 1.2, dx: kk.dx, dy: kk.dy, sx: kk.sx, sy: kk.sy * (1 + Math.sin(tm * 2 + i) * 0.012) });
      if (u.lv > 1) { cx.strokeStyle = T.c; cx.globalAlpha = 0.6; cx.lineWidth = 2; cx.beginPath(); cx.ellipse(s[0], s[1] + 16, 18 + u.lv * 2, 8 + u.lv, 0, 0, 7); cx.stroke(); cx.globalAlpha = 1; }
      for (let k = 0; k < u.lv; k++) { cx.fillStyle = '#ffd34d'; cx.strokeStyle = '#8a5a00'; cx.lineWidth = 1; cx.beginPath(); cx.arc(s[0] - (u.lv - 1) * 4.5 + k * 9, s[1] + 28, 3.4, 0, 7); cx.fill(); cx.stroke(); }
      cx.globalAlpha = 1; if (u.mh && u.hp < u.mh && !(u.dn > 0)) { cx.fillStyle = 'rgba(0,0,0,.45)'; cx.fillRect(s[0] - 14, s[1] + 34, 28, 4); cx.fillStyle = u.hp / u.mh > 0.4 ? '#7be07b' : '#ff7a6a'; cx.fillRect(s[0] - 14, s[1] + 34, 28 * Math.max(0, u.hp / u.mh), 4); } if (u.dn > 0) pill('💤 회복 중', s[0], s[1] + 16 - h - 8, '#ffffff', '#2b2440');
      if (sel === i) pill(T.n + ' Lv.' + u.lv, s[0], s[1] + 16 - h - 8, '#ffffff', '#2b2440'); }]); });
  if (V.sm && V.sm.pts) { const pl = 1 + 0.12 * Math.sin(performance.now() / 180); for (const q of V.sm.pts) { cx.fillStyle = 'rgba(255,230,120,.28)'; cx.strokeStyle = 'rgba(255,200,40,.9)'; cx.lineWidth = 3; cx.beginPath(); cx.arc(q[0], q[1], 34 * pl, 0, 7); cx.fill(); cx.stroke(); cx.font = '30px sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillStyle = '#000'; cx.fillText(q[2], q[0], q[1] - 44 - 4 * pl); cx.textBaseline = 'alphabetic'; } cx.textAlign = 'left'; }
  for (const e of V.en || []) { const T = ET[e[1]], q = lerpTo('e' + e[0], e[2], e[3], 0.5), ek = 'e' + e[0], el = e[6], h = EH[e[1]] * (e[6] ? 1.25 : 1), ph = tm * (e[1] === 'cav' ? 12 : 8) + e[0] * 1.7, sn = Math.sin(ph);
    if (Math.abs(q[4] || 0) > 12) FACE.set(ek, q[4] < 0); const fl = FACE.get(ek) || false, fy = q[1] + 12;
    DL.push([fy, () => { if (e[1] === 'camp') { if (FP === 'jp') drawCamp(q[0], fy, e[4], tm); else { shade(q[0], fy, 44, 0.25); spr('camp', q[0], fy + 6, 72, { flash: e[5] }); const bw = 70; cx.fillStyle = 'rgba(0,0,0,.55)'; rr(q[0] - bw / 2, fy - 100, bw, 7, 3.5); cx.fill(); cx.fillStyle = '#ff9a3c'; rr(q[0] - bw / 2, fy - 100, bw * Math.max(0.04, e[4]), 7, 3.5); cx.fill(); } return; } const w = h * 0.32;
      if (e[1] === 'boss') { cx.strokeStyle = 'rgba(255,60,60,.6)'; cx.lineWidth = 4; cx.beginPath(); cx.ellipse(q[0], fy, 34 + Math.sin(tm * 5) * 3, 13, 0, 0, 7); cx.stroke(); }
      if (el) { cx.strokeStyle = '#ffcf33'; cx.lineWidth = 4; cx.globalAlpha = 0.6 + 0.3 * Math.sin(tm * 6); cx.beginPath(); cx.ellipse(q[0], fy, w * 1.15, w * 0.42, 0, 0, 7); cx.stroke(); cx.globalAlpha = 1; }
      shade(q[0], fy, w); if (!LOW) { cx.strokeStyle = FC[1]; cx.globalAlpha = 0.85; cx.lineWidth = 3; cx.beginPath(); cx.ellipse(q[0], fy, w * 0.95, w * 0.34, 0, 0, 7); cx.stroke(); cx.globalAlpha = 1; }
      spr(FP + '_' + ETK[e[1]], q[0], fy, h, { fr: fr10(tm, e[0] * 3), flip: fl, bob: Math.abs(sn) * (e[1] === 'cav' ? 4.5 : 3.2), lean: sn * 0.055, sx: 1 + Math.sin(ph * 2) * 0.025, sy: 1 - Math.sin(ph * 2) * 0.02, flash: e[5] });
      if (e[7]) { cx.fillStyle = '#e98a3c'; cx.strokeStyle = '#5b3a1c'; cx.lineWidth = 2; cx.beginPath(); cx.arc(q[0], fy - h - 4, 9, 0, 7); cx.fill(); cx.stroke(); cx.fillStyle = '#fff'; cx.font = 'bold 11px sans-serif'; cx.textAlign = 'center'; cx.fillText('포', q[0], fy - h); cx.textAlign = 'left'; }
      if (e[4] < 1 || el) { const bw = Math.max(26, h * 0.5), by = fy - h - 6; if (el) { cx.fillStyle = '#ffcf33'; cx.font = 'bold 13px sans-serif'; cx.textAlign = 'center'; cx.fillText('★정예', q[0], by - 4); } cx.fillStyle = 'rgba(0,0,0,.55)'; rr(q[0] - bw / 2, by, bw, 5, 2.5); cx.fill(); cx.fillStyle = '#ff6b6b'; rr(q[0] - bw / 2, by, bw * Math.max(0.05, e[4]), 5, 2.5); cx.fill(); } }]); }
  for (const p of V.pl) { const q = lerpTo(p.id, p.x, p.y, 0.45), mine = p.id === Net.id, key = 'h' + p.id, mv = Math.hypot(q[4] || 0, q[5] || 0) / 20, kk = kickOf(key, tm), fy = q[1] + 18, H = (p.role === 'admiral' || LEG[p.role]) ? 76 : 62;
    if (Math.abs(q[4] || 0) > 25 && !(KICK.has(key) && tm - KICK.get(key).t < 0.5)) FACE.set(key, q[4] < 0);
    DL.push([mine ? fy + 70 : fy, () => { const walk = Math.min(1, mv / 4), sn = Math.sin(tm * 10 + p.id.length), dn = p.down > 0; cx.globalAlpha = dn ? 0.45 : (p.fz > 0 && Math.floor(performance.now() / 120) % 2 ? 0.65 : 1);
      if (p.cards && p.cards.buddha && !dn) { const cb = p.cards, lv = cb.buddha, evo = !!cb.evo_buddha, mx = lv >= 5 || evo, R = 105 + 16 * lv + (evo ? 40 : 0), cy = q[1] - 8;
        const gr = cx.createRadialGradient(q[0], cy, R * 0.2, q[0], cy, R); gr.addColorStop(0, 'rgba(255,236,150,0)'); gr.addColorStop(1, 'rgba(255,214,90,' + (mx ? 0.3 : 0.17) + ')'); cx.fillStyle = gr; cx.beginPath(); cx.arc(q[0], cy, R, 0, 7); cx.fill();
        cx.strokeStyle = 'rgba(255,214,90,.65)'; cx.lineWidth = mx ? 3 : 2; cx.setLineDash([12, 10]); cx.lineDashOffset = -tm * 16; cx.beginPath(); cx.arc(q[0], cy, R, 0, 7); cx.stroke(); cx.setLineDash([]);
        const ng = evo ? 10 : lv >= 5 ? 8 : lv >= 3 ? 6 : 4; cx.font = 'bold 22px sans-serif'; cx.textAlign = 'center'; cx.lineWidth = 3; cx.strokeStyle = 'rgba(120,60,0,.85)'; cx.fillStyle = mx ? '#fff3a0' : '#ffd86a';
        for (let k = 0; k < ng; k++) { const a = tm * 0.9 + k * 6.283 / ng, gx = q[0] + Math.cos(a) * R * 0.86, gy = cy + Math.sin(a) * R * 0.86 * 0.9; cx.globalAlpha = 0.85; cx.strokeText('卍', gx, gy + 8); cx.fillText('卍', gx, gy + 8); } cx.globalAlpha = 1;
        if (mx && !LOW) { cx.strokeStyle = 'rgba(255,240,170,.28)'; cx.lineWidth = 6; for (let k = 0; k < 8; k++) { const a = -tm * 0.5 + k * 0.785; cx.beginPath(); cx.moveTo(q[0] + Math.cos(a) * R * 0.3, cy + Math.sin(a) * R * 0.3 * 0.9); cx.lineTo(q[0] + Math.cos(a) * R, cy + Math.sin(a) * R * 0.9); cx.stroke(); } cx.fillStyle = '#fff6c0'; for (let k = 0; k < 6; k++) { const a = tm * 1.4 + k * 1.05, rr0 = R * (0.4 + 0.5 * ((tm * 0.5 + k * 0.17) % 1)); cx.globalAlpha = 0.7; cx.beginPath(); cx.arc(q[0] + Math.cos(a) * rr0, cy + Math.sin(a) * rr0 * 0.9, 2.4, 0, 7); cx.fill(); } cx.globalAlpha = 1; } }
      if (p.cards && p.cards.flail && !dn) { const g = flailGeo(p.cards, gT), mx = p.cards.flail >= 5 || g.evo, hx = q[0], hy = q[1] - 14;
        for (let k = 0; k < g.n; k++) { if (mx && !LOW) for (let tr = 3; tr >= 1; tr--) { const gp = flailPos(q[0], q[1], Object.assign({}, g, { t: gT - 0.035 * tr }), k); cx.fillStyle = 'rgba(255,150,40,' + (0.2 - tr * 0.045) + ')'; cx.beginPath(); cx.arc(gp[0], gp[1] - 8, 13 - tr * 2, 0, 7); cx.fill(); }
          const bp = flailPos(q[0], q[1], g, k), bx = bp[0], by = bp[1] - 8, br = g.evo ? 14 : 10 + g.lv * 0.5;
          cx.strokeStyle = '#4a4f5a'; cx.lineWidth = 3; cx.setLineDash([5, 3]); cx.beginPath(); cx.moveTo(hx, hy); cx.lineTo(bx, by); cx.stroke(); cx.setLineDash([]);
          if (mx) { cx.fillStyle = 'rgba(255,140,40,.28)'; cx.beginPath(); cx.arc(bx, by, br + 8, 0, 7); cx.fill(); }
          cx.fillStyle = '#2f343e'; cx.strokeStyle = mx ? '#ffb347' : '#8a93a2'; cx.lineWidth = 2; cx.beginPath(); cx.arc(bx, by, br, 0, 7); cx.fill(); cx.stroke();
          cx.fillStyle = mx ? '#ffd9a0' : '#c3cad6'; for (let sp = 0; sp < 8; sp++) { const a = bp[2] * 2 + sp * 0.785; cx.beginPath(); cx.moveTo(bx + Math.cos(a) * (br + 5), by + Math.sin(a) * (br + 5)); cx.lineTo(bx + Math.cos(a - 0.2) * (br - 1), by + Math.sin(a - 0.2) * (br - 1)); cx.lineTo(bx + Math.cos(a + 0.2) * (br - 1), by + Math.sin(a + 0.2) * (br - 1)); cx.fill(); } } }
      shade(q[0], fy, 20);
      { if (p.sd && !dn) { cx.save(); cx.globalAlpha = 0.26 + 0.08 * Math.sin(tm * 6); cx.fillStyle = '#6ec6ff'; cx.beginPath(); cx.ellipse(q[0], fy - 22, 34, 46, 0, 0, 7); cx.fill(); cx.globalAlpha = 0.9; cx.strokeStyle = '#dff3ff'; cx.lineWidth = 2.5; cx.stroke(); cx.restore(); } }
      { const sm = !mine && ST.fxs !== 'big', TA = AUR[p.tr] || null, key = p.id; trailTick(key, q[0], fy, dn ? null : TA, tm, LOW || sm); if (TA) trailDraw(cx, key, TA, tm, sm ? 0.9 : 1.6); const A = AUR[p.au] || HAUR[p.role] || null; if (A && !dn) drawAura(cx, A, q[0], fy, tm, LOW || sm, true, sm ? 0.85 : 1.5); }
      if (!dn && p.cards) { const nmx = Object.keys(p.cards).filter((k) => (p.cards[k] >= 5 || k.startsWith('evo_')) && !k.startsWith('evo_') ? true : k.startsWith('evo_')).length; if (nmx) { cx.fillStyle = 'rgba(255,225,120,' + Math.min(0.35, 0.12 + 0.07 * nmx) + ')'; cx.beginPath(); cx.ellipse(q[0], fy, 30 + nmx * 4, 12 + nmx * 1.5, 0, 0, 7); cx.fill(); if (!LOW) { cx.fillStyle = '#fff3a0'; for (let k = 0; k < Math.min(5, nmx + 1); k++) { const a = tm * 1.6 + k * 1.3, hh = ((tm * 0.7 + k * 0.23) % 1); cx.globalAlpha = 1 - hh; cx.beginPath(); cx.arc(q[0] + Math.cos(a) * (18 + nmx * 3), fy - hh * 46, 2.2, 0, 7); cx.fill(); } cx.globalAlpha = 1; } }
        if (p.cards.gong) { const gl = p.cards.gong, fx0 = q[0] - 16, fy0 = fy - 6; cx.strokeStyle = '#6e4a2a'; cx.lineWidth = 2.5; cx.beginPath(); cx.moveTo(fx0, fy0); cx.lineTo(fx0, fy0 - 34 - gl * 3); cx.stroke(); cx.fillStyle = gl >= 5 ? '#ffd34d' : '#e8402f'; const wv = Math.sin(tm * 6) * 3, hh0 = 34 + gl * 3; cx.beginPath(); cx.moveTo(fx0, fy0 - hh0); cx.lineTo(fx0 + 16 + gl * 2 + wv, fy0 - hh0 + 6); cx.lineTo(fx0, fy0 - hh0 + 14); cx.closePath(); cx.fill(); } }
      if (!dn && p.cards) { if (p.cards.powder) { cx.fillStyle = 'rgba(255,150,50,' + (0.14 + 0.05 * p.cards.powder) + ')'; cx.beginPath(); cx.ellipse(q[0], fy, 22 + p.cards.powder * 3, 9 + p.cards.powder, 0, 0, 7); cx.fill(); }
        if (p.cards.armor) { cx.strokeStyle = 'rgba(130,190,255,.6)'; cx.lineWidth = 1.5 + p.cards.armor * 0.5; cx.beginPath(); cx.ellipse(q[0], fy - 14, 18 + p.cards.armor * 2, 26 + p.cards.armor * 2, 0, 0, 7); cx.stroke(); } }
      if (mine) { if (p.rg && !dn) { cx.strokeStyle = 'rgba(255,255,255,.85)'; cx.fillStyle = 'rgba(255,255,255,.09)'; cx.lineWidth = 3; cx.setLineDash([12, 9]); cx.beginPath(); cx.arc(q[0], fy - 18, p.rg, 0, 7); cx.fill(); cx.stroke(); cx.setLineDash([]); } cx.fillStyle = 'rgba(255,230,120,.35)'; cx.beginPath(); cx.ellipse(q[0], fy, 34, 13, 0, 0, 7); cx.fill(); cx.strokeStyle = '#e8402f'; cx.lineWidth = 4; cx.beginPath(); cx.ellipse(q[0], fy, 28 + Math.sin(tm * 4) * 1.5, 11, 0, 0, 7); cx.stroke(); }
      spr(RSP[p.role], q[0], fy, H, { fr: fr10(tm, p.id.length * 5), flip: !!FACE.get(key), bob: Math.abs(sn) * 3.5 * walk + Math.sin(tm * 2) * 0.8, lean: dn ? -1.35 : sn * 0.05 * walk, dx: kk.dx, dy: kk.dy, sx: kk.sx, sy: kk.sy });
      cx.globalAlpha = 1;
      if (mine) { const by = fy - H * SPS - 44 + Math.sin(tm * 5) * 4; cx.fillStyle = '#e8402f'; cx.strokeStyle = '#fff'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(q[0], by + 10); cx.lineTo(q[0] - 11, by - 8); cx.lineTo(q[0] + 11, by - 8); cx.closePath(); cx.stroke(); cx.fill(); }
      if (mine && p.cards) { const ks = ORD.filter((k) => p.cards[k]); cx.imageSmoothingEnabled = false; ks.forEach((k, i) => { const ix = q[0] - ks.length * 8 + i * 16; cx.fillStyle = 'rgba(30,22,10,.65)'; rr(ix - 1, fy - H * SPS - 43, 16, 16, 3); cx.fill(); cx.drawImage(ICOC(k), ix, fy - H * SPS - 42, 14, 14); }); cx.imageSmoothingEnabled = true; }
      pillB(cx, mine ? '★ ' + p.name : p.name, q[0], fy - H * SPS - 20, mine ? '#ffd34d' : 'rgba(20,18,40,.75)', mine ? '#2b2440' : '#fff', p.bd, tm, mine || ST.fxs === 'big');
      cx.fillStyle = 'rgba(0,0,0,.55)'; rr(q[0] - 20, fy - H * SPS - 11, 40, 5, 2.5); cx.fill(); cx.fillStyle = '#7dffa0'; rr(q[0] - 20, fy - H * SPS - 11, 40 * Math.max(0.05, p.hp / p.mx), 5, 2.5); cx.fill();
      if (dn) pill(Math.ceil(p.down) + '초 뒤 복귀', q[0], fy + 14, 'rgba(20,18,40,.8)', '#fff'); }]); }
  DL.sort((A, B) => A[0] - B[0]); for (const d of DL) d[1]();
  if (V !== lastPjV) { lastPjV = V; pjT = tm; } const pdt = Math.min(0.2, tm - pjT);
  for (const b of V.pj || []) { if (b[4] === 'cannon') { const x = b[0] + b[2] * pdt, y = b[1] + b[3] * pdt; cx.strokeStyle = 'rgba(255,60,40,' + (0.55 + 0.3 * Math.sin(tm * 10)) + ')'; cx.lineWidth = 3; cx.setLineDash([8, 6]); cx.beginPath(); cx.arc(b[5], b[6], b[7] || 80, 0, 7); cx.stroke(); cx.setLineDash([]); cx.fillStyle = 'rgba(255,60,40,.12)'; cx.fill(); if ((b[7] || 80) <= 100) { cx.fillStyle = '#2b2b2b'; cx.beginPath(); cx.arc(x, y - 6, 7, 0, 7); cx.fill(); cx.strokeStyle = '#ff9a3a'; cx.lineWidth = 2; cx.stroke(); } continue; }
    const x = b[0] + b[2] * pdt, y = b[1] + b[3] * pdt, L = Math.hypot(b[2], b[3]) || 1, ux = b[2] / L, uy = b[3] / L, gun = b[4] === 'gun'; cx.strokeStyle = gun ? 'rgba(255,190,80,.8)' : 'rgba(255,255,255,.75)'; cx.lineWidth = gun ? 3 : 2; cx.beginPath(); cx.moveTo(x - ux * (gun ? 18 : 14), y - uy * (gun ? 18 : 14)); cx.lineTo(x, y); cx.stroke(); cx.fillStyle = gun ? '#ff6a2a' : '#ffe9a0'; cx.beginPath(); cx.arc(x, y, gun ? 4 : 3, 0, 7); cx.fill(); cx.strokeStyle = 'rgba(255,50,40,.9)'; cx.lineWidth = 1.3; cx.beginPath(); cx.arc(x, y, gun ? 8 : 6, 0, 7); cx.stroke(); }
  // 새 연출 수집
  for (const s of V.sh || []) { effects.push({ k: 'sh', a: s, life: 0.2, mx: 0.2 }); noteShot(s, tm); const kd = s[5] || ''; SFX.p(kd === 'cannon' ? 'cannon' : (kd === 'gun' || kd === 'gunner') ? 'gun' : (kd === 'bow' || kd === 'archer' || kd === 'hwa' || kd === 'ebow') ? 'bow' : 'slash'); }
  if (V.rd !== lastRdX) { lastRdX = V.rd; lastXp = V.xp; } else { if (V.xp > lastXp) SFX.p('pick'); lastXp = V.xp; }
  for (const f of V.fx || []) {
    if (f[3] === 'dmg') { if (!LOW && effects.length < 260) effects.push({ k: 'spark', x: f[0], y: f[1] + 10, a: Math.random() * 6.28, life: 0.16, mx: 0.16 }); SFX.p('hit'); if ((f[2] >= 30 || Math.random() < 0.25) && effects.length < (LOW ? 30 : 120)) effects.push({ k: 'dmg', x: f[0], y: f[1], v: f[2], life: 0.7, mx: 0.7 }); continue; }
    effects.push({ k: f[3], x: f[0], y: f[1], r: f[2], o: f[4], life: FXL[f[3]] || 0.38, mx: FXL[f[3]] || 0.38 });
    if (f[3] === 'die' && f[4] && f[4] !== 'camp' && !LOW && effects.length < 300) effects.push({ k: 'corpse', x: f[0], y: f[1], ty: f[4], life: 0.55, mx: 0.55 });
    if (f[3] === 'die') SFX.p('pop'); else if (f[3] === 'boom' || f[3] === 'gw' || f[3] === 'hk') SFX.p('boom'); else if (f[3] === 'ks' || f[3] === 'hj' || f[3] === 'yj') SFX.p('lvl'); else if (f[3] === 'hg') SFX.p('puff'); else if (f[3] === 'jr') SFX.p('boom'); else if (f[3] === 'gong') SFX.p('gong'); else if (f[3] === 'lvl') SFX.p('lvl'); else if (f[3] === 'boss') SFX.p('boss'); else if (f[3] === 'puff') SFX.p('gun'); else if (f[3] === 'night') { nightBan = 4.6; SFX.p('night'); }
    if (f[3] === 'gong' || f[3] === 'boom') shake = Math.max(shake, f[3] === 'gong' ? 0.2 : 0.1); if (f[3] === 'boss') { bossBan = 3.6; bossName = ET.boss.n; bannerBn = V.bn || BOSSN[V.rd] || ['적장', '']; } if (f[3] === 'roar' || f[3] === 'boss') shake = Math.max(shake, 0.35); if (f[3] === 'gw' || f[3] === 'hk' || f[3] === 'jr') shake = Math.max(shake, 0.3); }
  V.sh = []; V.fx = [];
  const dt = DT;
  for (let i = effects.length - 1; i >= 0; i--) { const f = effects[i]; f.life -= dt; if (f.life <= 0) { effects.splice(i, 1); continue; } const t = 1 - f.life / f.mx;
    if (f.k === 'sh') { const a = f.a, kd = a[5] || ''; const dx = a[2] - a[0], dy = a[3] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
      if (a[9] === 1) { const tt = Math.min(1, t * 1.6); cx.save(); cx.globalAlpha = 0.55 * (1 - tt); cx.strokeStyle = '#ffe27a'; cx.lineWidth = 7 * (1 - tt * 0.6); cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(a[2], a[3]); cx.stroke(); cx.globalAlpha = 0.9 * (1 - tt); cx.lineWidth = 3; cx.beginPath(); cx.arc(a[2], a[3], 8 + tt * 30, 0, 7); cx.stroke(); if (!LOW) { cx.fillStyle = '#fff6c0'; for (let k = 0; k < 5; k++) { const an = k * 1.26 + tt * 2; cx.beginPath(); cx.arc(a[2] + Math.cos(an) * (10 + tt * 26), a[3] + Math.sin(an) * (10 + tt * 26), 2.4 * (1 - tt), 0, 7); cx.fill(); } } cx.restore(); }
      if (kd === 'bow' || kd === 'archer' || kd === 'hwa' || kd === 'ebow') { const p = Math.min(1, t * 1.25), x = a[0] + dx * p, y = a[1] + dy * p; cx.strokeStyle = 'rgba(255,255,255,.35)'; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(x - ux * 22, y - uy * 22); cx.lineTo(x, y); cx.stroke(); cx.strokeStyle = kd === 'ebow' ? '#ff9a8a' : '#f3e1b0'; cx.lineWidth = 2.5; cx.beginPath(); cx.moveTo(x - ux * 12, y - uy * 12); cx.lineTo(x, y); cx.stroke(); cx.fillStyle = '#fff'; cx.beginPath(); cx.moveTo(x + ux * 5, y + uy * 5); cx.lineTo(x - uy * 3, y + ux * 3); cx.lineTo(x + uy * 3, y - ux * 3); cx.fill(); }
      else if (kd === 'gun' || kd === 'gunner') { const p = Math.min(1, t * 2.2), x = a[0] + dx * p, y = a[1] + dy * p; if (t < 0.3) { cx.fillStyle = 'rgba(255,230,120,' + (1 - t * 3) + ')'; cx.beginPath(); cx.arc(a[0] + ux * 12, a[1] + uy * 12, 8 * (1 - t * 2), 0, 7); cx.fill(); } cx.strokeStyle = 'rgba(255,240,170,.5)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(x - ux * 26, y - uy * 26); cx.lineTo(x, y); cx.stroke(); cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(x, y, 3.2, 0, 7); cx.fill(); }
      else if (kd === 'stone') { const p = Math.min(1, t * 1.5), x = a[0] + dx * p, y = a[1] + dy * p - Math.sin(Math.PI * p) * 22; cx.fillStyle = '#9aa0a8'; cx.strokeStyle = '#3b3f46'; cx.lineWidth = 1.5; cx.beginPath(); cx.arc(x, y, 3.8, 0, 7); cx.fill(); cx.stroke(); }
      else if (kd === 'cannon') { const p = Math.min(1, t * 1.1), x = a[0] + dx * p, y = a[1] + dy * p - Math.sin(Math.PI * p) * 34; cx.fillStyle = 'rgba(0,0,0,.25)'; cx.beginPath(); cx.ellipse(a[0] + dx * p, a[1] + dy * p + 6, 6, 3, 0, 0, 7); cx.fill(); cx.fillStyle = '#2b2f3e'; cx.strokeStyle = '#ffb347'; cx.lineWidth = 2; cx.beginPath(); cx.arc(x, y, 5.5, 0, 7); cx.fill(); cx.stroke(); }
      else if (kd === 'thrust') { const tier = a[4] || 0, ext = Math.min(1, t / 0.32), hx = a[0] + dx * ext, hy = a[1] + dy * ext, fade = 1 - Math.max(0, (t - 0.45) / 0.55), col = tier >= 2 ? '255,214,80' : tier === 1 ? '190,225,255' : '255,255,255'; cx.globalAlpha = fade;
        cx.strokeStyle = 'rgba(' + col + ',.5)'; cx.lineWidth = (tier >= 2 ? 15 : tier === 1 ? 11 : 8) * (1 - t * 0.6); cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(a[0] + ux * 16, a[1] + uy * 16); cx.lineTo(hx, hy); cx.stroke();
        cx.strokeStyle = '#8a5a2b'; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(a[0] + ux * 10, a[1] + uy * 10); cx.lineTo(hx - ux * 12, hy - uy * 12); cx.stroke(); cx.fillStyle = tier >= 2 ? '#fff0a0' : '#eef3f8'; cx.strokeStyle = '#4a5560'; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(hx + ux * 14, hy + uy * 14); cx.lineTo(hx - ux * 6 - uy * 6, hy - uy * 6 + ux * 6); cx.lineTo(hx - ux * 6 + uy * 6, hy - uy * 6 - ux * 6); cx.closePath(); cx.fill(); cx.stroke();
        if (tier >= 1 && t > 0.25 && !LOW) { cx.fillStyle = '#fff'; for (let k = 0; k < (tier >= 2 ? 6 : 3); k++) { const an = k * 1.05 + t * 3; cx.beginPath(); cx.arc(a[2] + Math.cos(an) * 14 * t * 2, a[3] + Math.sin(an) * 14 * t * 2, 2.3 * (1 - t), 0, 7); cx.fill(); } }
        if (tier >= 2) { cx.strokeStyle = 'rgba(255,230,120,' + (0.7 * (1 - t)) + ')'; cx.lineWidth = 3; cx.beginPath(); cx.arc(a[2], a[3], 10 + t * 26, 0, 7); cx.stroke(); } cx.globalAlpha = 1; cx.lineCap = 'butt'; }
      else if (kd === 'slash') { const tier = a[4] || 0, half = a[6] || 1.2, R = a[7] || 110, ang = Math.atan2(dy, dx), sweep = Math.min(1, t * 2.4), a0 = ang - half, a1 = a0 + 2 * half * sweep, fade = 1 - t, col1 = tier >= 2 ? '#fff0a0' : tier === 1 ? '#d6ecff' : '#ffffff', col2 = tier >= 2 ? 'rgba(255,196,60,.6)' : tier === 1 ? 'rgba(120,190,255,.5)' : 'rgba(255,233,160,.4)'; cx.globalAlpha = fade; cx.lineCap = 'round';
        cx.strokeStyle = col2; cx.lineWidth = (tier >= 2 ? 26 : 18) * (1 - t * 0.5); cx.beginPath(); cx.arc(a[0], a[1], R * 0.78, a0, a1); cx.stroke(); cx.strokeStyle = col1; cx.lineWidth = (tier >= 2 ? 9 : 6) * (1 - t * 0.6) + 1; cx.beginPath(); cx.arc(a[0], a[1], R * 0.9, a0, a1); cx.stroke();
        if (tier >= 1 && !LOW) { cx.strokeStyle = col1; cx.lineWidth = 2; cx.beginPath(); cx.arc(a[0], a[1], R * 0.62, a0 + 0.2, a1); cx.stroke(); } if (tier >= 2 && !LOW) { cx.fillStyle = '#fff'; for (let k = 0; k < 7; k++) { const an = a0 + (a1 - a0) * (k / 6); cx.beginPath(); cx.arc(a[0] + Math.cos(an) * R * 0.92, a[1] + Math.sin(an) * R * 0.92, 2.8 * (1 - t), 0, 7); cx.fill(); } } cx.globalAlpha = 1; cx.lineCap = 'butt'; }
      else { const ang = Math.atan2(dy, dx); cx.globalAlpha = 1 - t; cx.strokeStyle = '#fff'; cx.lineWidth = 5 * (1 - t) + 1; cx.beginPath(); cx.arc(a[2] - ux * 8, a[3] - uy * 8, 15, ang - 1.1 + t * 0.6, ang + 1.1 + t * 0.6); cx.stroke(); cx.globalAlpha = 0.25 * (1 - t); cx.strokeStyle = '#ffe9a0'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(a[2], a[3]); cx.stroke(); cx.globalAlpha = 1; } }
    else if (f.k === 'spark') { cx.strokeStyle = '#fff3b0'; cx.lineWidth = 2; cx.globalAlpha = 1 - t; for (let k = 0; k < 3; k++) { const an = f.a + k * 2.1, r1 = 4 + t * 10, r2 = r1 + 6; cx.beginPath(); cx.moveTo(f.x + Math.cos(an) * r1, f.y + Math.sin(an) * r1); cx.lineTo(f.x + Math.cos(an) * r2, f.y + Math.sin(an) * r2); cx.stroke(); } cx.globalAlpha = 1; }
    else if (f.k === 'puff') { cx.fillStyle = 'rgba(235,235,235,' + (0.6 * (1 - t)) + ')'; cx.beginPath(); cx.arc(f.x, f.y - t * 8, f.r * (0.4 + t), 0, 7); cx.fill(); }
    else if (f.k === 'gw') { const R = f.r, n = LOW ? 8 : 16; cx.save(); cx.globalAlpha = (1 - t) * 0.5; cx.strokeStyle = '#ff9a3c'; cx.lineWidth = 4; cx.beginPath(); cx.arc(f.x, f.y, R * (0.3 + 0.7 * t), 0, 7); cx.stroke();
      for (let k = 0; k < n; k++) { const sd = k * 2.399, rr = R * 0.9 * Math.sqrt((k + 0.5) / n), tx = f.x + Math.cos(sd) * rr, ty = f.y + Math.sin(sd) * rr * 0.8, u = (t - (k % 4) * 0.1) / 0.5; if (u < 0 || u > 1.6) continue;
        if (u < 1) { const yy = ty - (1 - u) * 170; cx.globalAlpha = 0.4; cx.fillStyle = '#ff9a3c'; cx.beginPath(); cx.arc(tx, yy, 18, 0, 7); cx.fill(); cx.globalAlpha = 1; cx.fillStyle = '#9a7650'; cx.beginPath(); cx.arc(tx, yy, 11, 0, 7); cx.fill(); cx.strokeStyle = '#3d2a1a'; cx.lineWidth = 3; cx.stroke(); cx.fillStyle = 'rgba(255,255,255,.4)'; cx.beginPath(); cx.arc(tx - 3, yy - 3, 3.5, 0, 7); cx.fill(); cx.globalAlpha = 0.45; cx.strokeStyle = '#ffb25a'; cx.lineWidth = 5; cx.beginPath(); cx.moveTo(tx, yy - 10); cx.lineTo(tx, yy - 44); cx.stroke(); }
        else { const v = (u - 1) / 0.6; cx.globalAlpha = (1 - v) * 0.8; cx.strokeStyle = '#ffd7a0'; cx.lineWidth = 3 * (1 - v) + 1; cx.beginPath(); cx.ellipse(tx, ty, 12 + v * 26, 6 + v * 13, 0, 0, 7); cx.stroke(); } }
      cx.restore(); }
    else if (f.k === 'hk') { const R = f.r, w = Math.min(1, t * 2.2), fa = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4; cx.save(); cx.fillStyle = '#4fa3ff';
      for (const s of [-1, 1]) { cx.globalAlpha = 0.5 * fa; cx.beginPath(); cx.moveTo(f.x, f.y); cx.quadraticCurveTo(f.x + s * R * 0.55 * w, f.y - R * 0.7 * w, f.x + s * R * w, f.y - R * 0.12 * w); cx.quadraticCurveTo(f.x + s * R * 0.62 * w, f.y + R * 0.12 * w, f.x, f.y + 6); cx.fill(); cx.globalAlpha = 0.95 * fa; cx.strokeStyle = '#eaf6ff'; cx.lineWidth = 3; cx.stroke(); }
      cx.globalAlpha = 0.7 * fa; cx.strokeStyle = '#bfe6ff'; cx.lineWidth = 3; for (let k = 0; k < 3; k++) { const rr = R * (0.35 + 0.3 * k) * w; cx.beginPath(); cx.arc(f.x, f.y, rr, 0.15 * Math.PI, 0.85 * Math.PI); cx.stroke(); cx.beginPath(); cx.arc(f.x, f.y, rr, 1.15 * Math.PI, 1.85 * Math.PI); cx.stroke(); }
      cx.restore(); }
    else if (f.k === 'ks') { const R = f.r, w = Math.min(1, t * 3), fa = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3; cx.save(); const gr = cx.createRadialGradient(f.x, f.y, R * 0.2 * w, f.x, f.y, R * w); gr.addColorStop(0, 'rgba(120,200,255,0)'); gr.addColorStop(1, 'rgba(120,200,255,' + 0.45 * fa + ')'); cx.fillStyle = gr; cx.beginPath(); cx.arc(f.x, f.y, R * w, 0, 7); cx.fill(); cx.globalAlpha = fa; cx.strokeStyle = '#e4f5ff'; cx.lineWidth = 4; cx.stroke();
      cx.lineWidth = 2; for (let k = 0; k < 6; k++) { const a = k * 1.047 + t * 1.5; cx.beginPath(); cx.moveTo(f.x + Math.cos(a) * R * w * 0.55, f.y + Math.sin(a) * R * w * 0.55); cx.lineTo(f.x + Math.cos(a + 0.5) * R * w * 0.9, f.y + Math.sin(a + 0.5) * R * w * 0.9); cx.stroke(); }
      cx.restore(); }
    else if (f.k === 'hg') { const R = f.r, w = Math.min(1, t * 3.5), fa = 1 - t; cx.save(); cx.globalAlpha = 0.35 * fa; cx.fillStyle = '#ff3a2a'; cx.beginPath(); cx.arc(f.x, f.y, R * w, 0, 7); cx.fill(); cx.globalAlpha = fa; cx.strokeStyle = '#ffd0c0'; cx.lineWidth = 4; cx.stroke();
      for (let k = 0; k < 6; k++) { const a = k * 1.047 + t * 3, rr = R * 0.7 * w, px = f.x + Math.cos(a) * rr, py = f.y + Math.sin(a) * rr * 0.6; cx.globalAlpha = 0.8 * fa; cx.fillStyle = '#e8362a'; cx.beginPath(); cx.ellipse(px, py - 12, 9, 15, 0, 0, 7); cx.fill(); cx.fillStyle = '#ffe3b0'; cx.beginPath(); cx.arc(px, py - 30, 7, 0, 7); cx.fill(); cx.strokeStyle = '#7a1a10'; cx.lineWidth = 2; cx.stroke(); }
      cx.restore(); }
    else if (f.k === 'hj') { const R = f.r, fa = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4; cx.save(); for (let k = 0; k < 2; k++) { const w = Math.min(1, Math.max(0, t * 2.2 - k * 0.25)); cx.globalAlpha = 0.8 * fa * (1 - w * 0.4); cx.strokeStyle = k ? '#fff3b0' : '#ffd34d'; cx.lineWidth = 5 - k * 2; cx.beginPath(); cx.arc(f.x, f.y, R * w, 0, 7); cx.stroke(); }
      cx.globalAlpha = 0.85 * fa; cx.fillStyle = '#fff3a0'; for (let k = 0; k < 14; k++) { const a = k * 0.449, rr = R * (0.25 + 0.7 * ((k * 0.37) % 1)) * Math.min(1, t * 2.2), yy = f.y + Math.sin(a) * rr * 0.6 - t * 40 * (1 + (k % 3) * 0.3); cx.fillRect(f.x + Math.cos(a) * rr - 2, yy - 6, 4, 12); }
      cx.restore(); }
    else if (f.k === 'yj') { const R = f.r, w = Math.min(1, t * 8), fa = t < 0.9 ? 1 : 1 - (t - 0.9) / 0.1, pu = 1 + 0.03 * Math.sin(t * 40); cx.save(); const gr = cx.createRadialGradient(f.x, f.y, R * 0.1, f.x, f.y, R * w * pu); gr.addColorStop(0, 'rgba(194,138,255,.05)'); gr.addColorStop(1, 'rgba(194,138,255,' + 0.38 * fa + ')'); cx.fillStyle = gr; cx.beginPath(); cx.arc(f.x, f.y, R * w * pu, 0, 7); cx.fill(); cx.globalAlpha = fa; cx.strokeStyle = '#f0dcff'; cx.lineWidth = 4; cx.stroke(); cx.strokeStyle = '#ffd34d'; cx.lineWidth = 2;
      for (let k = 0; k < 8; k++) { const a = k * 0.785 + t * 6, rr = R * w * 0.6; cx.beginPath(); cx.ellipse(f.x + Math.cos(a) * rr * 0.55, f.y + Math.sin(a) * rr * 0.55, rr * 0.45, rr * 0.16, a, 0, 7); cx.stroke(); }
      cx.restore(); }
    else if (f.k === 'jr') { const R = f.r, fa = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4; cx.save(); cx.globalAlpha = 0.5 * fa; cx.strokeStyle = '#ffb347'; cx.lineWidth = 3; cx.setLineDash([14, 10]); cx.beginPath(); cx.arc(f.x, f.y, R * Math.min(1, t * 3), 0, 7); cx.stroke(); cx.setLineDash([]);
      for (let k = 0; k < 8; k++) { const u = (t * 1.6 - k * 0.07) % 1.2; if (u < 0 || u > 1) continue; const a = k * 2.4, rr = R * (0.3 + 0.6 * ((k * 0.31) % 1)), tx = f.x + Math.cos(a) * rr, ty = f.y + Math.sin(a) * rr * 0.7; cx.globalAlpha = 0.9 * fa; cx.fillStyle = '#2a2018'; cx.beginPath(); cx.arc(tx, ty - (1 - u) * 260, 7, 0, 7); cx.fill(); cx.strokeStyle = '#ff9a3a'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(tx, ty - (1 - u) * 260 - 7); cx.lineTo(tx, ty - (1 - u) * 260 - 30); cx.stroke(); }
      cx.restore(); }
    else if (f.k.startsWith('lf_')) { const own = f.o === Net.id; drawLvFx(cx, f.k.slice(3), f.x, f.y, t, own ? 1.3 : (ST.fxs === 'big' ? 1 : 0.7), own || (ST.fxs === 'big' && !LOW)); }
    else if (f.k === 'night') { }
    else if (f.k === 'corpse') { cx.globalAlpha = Math.max(0, 1 - t * 1.1); spr(FP + '_' + ETK[f.ty], f.x, f.y + 12, EH[f.ty], { lean: t * 1.1, sy: 1 - t * 0.2, dy: t * 6, flash: t < 0.3 }); cx.globalAlpha = 1; }
    else if (f.k === 'dmg') { const big = f.v >= 40; cx.globalAlpha = Math.min(1, f.life * 3); cx.font = 'bold ' + (big ? 17 : 13) + 'px sans-serif'; cx.textAlign = 'center'; cx.lineWidth = 3; cx.strokeStyle = 'rgba(20,10,40,.85)'; cx.fillStyle = big ? '#ffe36b' : '#ffffff'; const yy = f.y - t * 22; cx.strokeText(f.v, f.x, yy); cx.fillText(f.v, f.x, yy); cx.globalAlpha = 1; }
    else { const col = f.k === 'lvl' ? '#fff08a' : f.k === 'gong' ? '#ffd34d' : f.k === 'amb' ? '#ff4a3a' : f.k === 'morale' ? '#ff9a3c' : f.k === 'dok' ? '#ffe9a0' : f.k === 'roar' ? '#ffe082' : f.k === 'merge' ? '#fff176' : f.k === 'sum' ? '#80e0ff' : f.k === 'boom' ? '#ffa94d' : f.k === 'die' ? '#6a4524' : '#ff8080'; cx.strokeStyle = col; cx.fillStyle = col; cx.globalAlpha = (1 - t) * 0.9; cx.lineWidth = 5 * (1 - t) + 1; cx.beginPath(); cx.arc(f.x, f.y, f.r * (0.35 + 0.65 * t), 0, 7); if (f.k === 'gong' || f.k === 'boom' || f.k === 'morale' || f.k === 'dok') { cx.globalAlpha = (1 - t) * (f.k === 'dok' ? 0.14 : 0.28); cx.fill(); cx.globalAlpha = (1 - t) * 0.95; cx.lineWidth = 8 * (1 - t) + 1; } cx.stroke(); if (f.k === 'amb') { cx.font = 'bold 24px sans-serif'; cx.textAlign = 'center'; cx.lineWidth = 4; cx.strokeStyle = '#4a0a05'; cx.fillStyle = '#ffd0c8'; cx.strokeText('⚠ 매복!', f.x, f.y - 50 - t * 20); cx.fillText('⚠ 매복!', f.x, f.y - 50 - t * 20); } if (f.k === 'lvl') { cx.font = 'bold 22px sans-serif'; cx.textAlign = 'center'; cx.lineWidth = 4; cx.strokeStyle = '#7a4a00'; cx.fillStyle = '#fff7a0'; cx.strokeText('LEVEL UP!', f.x, f.y - 60 - t * 34); cx.fillText('LEVEL UP!', f.x, f.y - 60 - t * 34); } if (f.k === 'die' || f.k === 'merge' || f.k === 'sum') { for (let k = 0; k < 6; k++) { const an = k * 1.047 + f.r; cx.beginPath(); cx.arc(f.x + Math.cos(an) * f.r * t * 1.3, f.y + Math.sin(an) * f.r * t * 1.3, 3 * (1 - t) + 0.5, 0, 7); cx.fill(); } } cx.globalAlpha = 1; } }
  // 경험치 구슬: 흩어졌다가 내 영웅에게 빨려 들어감
  const me2 = RP.get(Net.id);
  for (let i = gems.length - 1; i >= 0; i--) { const m = gems[i]; m.t += dt;
    if (m.t < 0.3) { m.x += m.vx * dt; m.y += m.vy * dt; m.vy += 260 * dt; } else if (me2) { const dx = me2[0] - m.x, dy = me2[1] - m.y, d = Math.hypot(dx, dy) || 1, sp = 160 + (m.t - 0.3) * 520; m.x += dx / d * sp * dt; m.y += dy / d * sp * dt; if (d < 14) { gems.splice(i, 1); continue; } } else if (m.t > 1.2) { gems.splice(i, 1); continue; }
    if (m.t > 4) { gems.splice(i, 1); continue; }
    { const oi = okImg('orb'); if (oi) cx.drawImage(oi, m.x - 8, m.y - 8, 16, 16); else { cx.fillStyle = '#9ff2ff'; cx.fillRect(m.x - 3, m.y - 3, 6, 6); } } }
  cx.restore();
  // 화면 밖 표시: 적(빨강) / 목표(노랑)
  if ((V.nl || 0) > 0.01) { if (!nightC) { nightC = document.createElement('canvas'); nightC.width = W; nightC.height = H; } const ng = nightC.getContext('2d'); ng.globalCompositeOperation = 'source-over'; ng.clearRect(0, 0, W, H); ng.fillStyle = 'rgba(6,10,36,' + (V.nd * V.nl) + ')'; ng.fillRect(0, 0, W, H); ng.globalCompositeOperation = 'destination-out';
    const hole = (wx, wy, rad, al) => { const x = (wx - cam.x) * Z, y = (wy - cam.y) * Z, r2 = rad * Z; if (x < -r2 || y < -r2 || x > W + r2 || y > H + r2) return; const gr = ng.createRadialGradient(x, y, r2 * 0.25, x, y, r2); gr.addColorStop(0, 'rgba(0,0,0,' + al + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); ng.fillStyle = gr; ng.beginPath(); ng.arc(x, y, r2, 0, 7); ng.fill(); };
    for (const pp of V.pl) { const q = RP.get(pp.id); if (q) hole(q[0], q[1], 165, 1); } if (V.castle) hole(V.ax, V.ay, 230, 0.9); for (const e of V.en || []) if (e[1] === 'boss' || e[1] === 'camp') { const q = RP.get('e' + e[0]); if (q) hole(q[0], q[1], 130, 0.75); } let ns = 0; for (const q of V.so || []) { if (ns++ > 70) break; hole(q[0], q[1], 48, 0.85); } for (const c of V.cr || []) hole(c[0], c[1], 64, 0.7); for (const b of V.pj || []) hole(b[0], b[1], 40, 0.9);
    cx.drawImage(nightC, 0, 0); }
  if (nightBan > 0) { nightBan -= DT; const a = Math.min(1, nightBan * 2, (4.6 - nightBan) * 4); cx.globalAlpha = a; cx.fillStyle = 'rgba(14,18,60,.88)'; rr(W / 2 - 310, 190, 620, 104, 22); cx.fill(); cx.strokeStyle = '#9fb4ff'; cx.lineWidth = 3; cx.stroke(); cx.textAlign = 'center'; cx.fillStyle = '#e8eeff'; cx.font = 'bold 32px sans-serif'; cx.fillText('🌙 야간 전투!', W / 2, 232); cx.font = '16px sans-serif'; cx.fillStyle = '#c9d4ff'; cx.fillText('말도 사람도 피곤합니다… 우리의 속도는 느려지고,', W / 2, 262); cx.fillText('적은 계속 우리를 노리고 있습니다. 파란 혼의 불빛을 따라가세요!', W / 2, 284); cx.globalAlpha = 1; }
  { const edge = (wx, wy, col, sz, isGoal) => { const sx = (wx - cam.x) * Z, sy = (wy - cam.y) * Z; if (sx > 14 && sx < W - 14 && sy > 14 && sy < H - 14) return false; const cxn = W / 2, cyn = H / 2, dx = sx - cxn, dy = sy - cyn, k = Math.min((W / 2 - 26) / Math.abs(dx || 1e-3), (H / 2 - 26) / Math.abs(dy || 1e-3)), ex = cxn + dx * k, ey = cyn + dy * k, an = Math.atan2(dy, dx);
      cx.save(); cx.translate(ex, ey); cx.rotate(an); cx.fillStyle = col; cx.strokeStyle = 'rgba(40,10,10,.7)'; cx.lineWidth = 2; cx.globalAlpha = isGoal ? 0.95 : 0.8; cx.beginPath(); cx.moveTo(sz, 0); cx.lineTo(-sz * 0.6, -sz * 0.75); cx.lineTo(-sz * 0.6, sz * 0.75); cx.closePath(); cx.fill(); cx.stroke(); cx.restore(); return true; };
    let cnt = 0; for (const e of V.en || []) { const q = RP.get('e' + e[0]); if (!q) continue; if (e[1] === 'camp') { edge(q[0], q[1], '#ffb347', 13, true); continue; } if (cnt < 40 && edge(q[0], q[1], e[1] === 'boss' ? '#ff2a2a' : '#ff6b5e', e[1] === 'boss' ? 14 : 8, false)) cnt++; }
    if (V.obj === 'e' && V.goals[V.gi]) edge(V.goals[V.gi][0], V.goals[V.gi][1], '#ffd34d', 15, true);
    if (!V.castle) { /* 병사 무리 위치 */ } }

  // 미니맵
  { const mw = 132, mh = Math.round(mw * V.wh / V.ww), mx = W - mw - 12, my = 150, k = mw / V.ww;
    cx.fillStyle = 'rgba(40,34,22,.45)'; rr(mx - 4, my - 4, mw + 8, mh + 8, 8); cx.fill(); cx.fillStyle = 'rgba(190,225,170,.75)'; cx.fillRect(mx, my, mw, mh);
    if (V.castle) { cx.fillStyle = '#fff'; cx.fillRect(mx + V.ax * k - 4, my + V.ay * k - 4, 8, 8); }
    if (V.obj === 'e') (V.goals || []).forEach((q, i) => { cx.fillStyle = i < V.gi ? '#8a948a' : '#ffd34d'; cx.fillRect(mx + q[0] * k - 3, my + q[1] * k - 5, 6, 10); });
    for (const e of V.en || []) { const q = RP.get('e' + e[0]); if (!q) continue; if (e[1] === 'camp') { cx.fillStyle = '#ff8c1a'; cx.fillRect(mx + q[0] * k - 3, my + q[1] * k - 3, 7, 7); } else { cx.fillStyle = e[1] === 'boss' ? '#ff1f1f' : '#e0453a'; const sz = e[1] === 'boss' ? 5 : 2; cx.fillRect(mx + q[0] * k - sz / 2, my + q[1] * k - sz / 2, sz, sz); } }
    if (V.bc) { cx.fillStyle = '#ff8a2a'; cx.fillRect(mx + V.bc[0] * k - 4, my + V.bc[1] * k - 4, 8, 8); }
    for (const a of V.al || []) { cx.fillStyle = a[3] ? '#888' : '#a05cff'; cx.fillRect(mx + a[0] * k - 3, my + a[1] * k - 3, 6, 6); }
    for (const c of V.cr || []) { cx.fillStyle = c[2] === 'chest' ? '#ffd34d' : c[2] === 'jmk' ? '#5ac8ff' : '#e0402f'; cx.fillRect(mx + c[0] * k - 2, my + c[1] * k - 2, 5, 5); }
    for (const pp of V.pl) { const q = RP.get(pp.id); if (!q) continue; cx.fillStyle = pp.id === Net.id ? '#ffe14a' : '#3fa0ff'; cx.beginPath(); cx.arc(mx + q[0] * k, my + q[1] * k, pp.id === Net.id ? 4 : 3, 0, 7); cx.fill(); }
    cx.strokeStyle = '#fff'; cx.lineWidth = 1.5; cx.strokeRect(mx + cam.x * k, my + cam.y * k, W / Z * k, H / Z * k); }
  // 적장 체력바 + 등장 배너
  { const bs = V.du ? null : (V.en || []).find((e) => e[1] === 'boss'); if (bs) { const bw = 300, bx = W / 2 - bw / 2, by = 112; cx.fillStyle = 'rgba(40,20,20,.7)'; rr(bx - 4, by - 4, bw + 8, 24, 12); cx.fill(); cx.fillStyle = '#ff5a4a'; rr(bx, by, bw * Math.max(0.03, bs[4]), 16, 8); cx.fill(); cx.fillStyle = '#fff'; cx.font = 'bold 13px sans-serif'; cx.textAlign = 'center'; cx.fillText('적장 ' + (((bs[8] || V.bn || BOSSN[V.rd] || [''])[0]) || ''), W / 2, by + 13); }
    if (V.du) { const D = V.du, bw = Math.min(W * 0.5, 460), bx = (W - bw) / 2, by = Math.round(H * 0.3); cx.save(); cx.textAlign = 'center'; cx.fillStyle = 'rgba(30,10,10,.78)'; rr(bx - 10, by - 30, bw + 20, 58, 14); cx.fill(); cx.fillStyle = '#ffe9b0'; cx.font = 'bold 17px sans-serif'; cx.fillText('⚔ 일기토 · ' + D.bn + (D.sn ? ' · ' + D.sn : '') + (D.ph === 'warn' ? ' · 준비!' : ' · ' + D.tm + '초'), W / 2, by - 8); cx.fillStyle = 'rgba(0,0,0,.6)'; rr(bx, by + 2, bw, 14, 7); cx.fill(); cx.fillStyle = D.hp > 0.35 ? '#ff6a4d' : '#ffb02e'; rr(bx, by + 2, Math.max(8, bw * Math.max(0, D.hp)), 14, 7); cx.fill(); cx.restore(); }
    if (bossBan > 0) { bossBan -= DT; const tot = 3.6, el = tot - bossBan, a = Math.min(1, bossBan * 2, el * 4), bn = bannerBn, off = Math.max(0, 1 - el * 2.5) * 380; cx.save(); cx.globalAlpha = a; cx.fillStyle = 'rgba(0,0,0,.6)'; cx.fillRect(0, 0, W, 58); cx.fillRect(0, H - 58, W, 58); cx.fillStyle = 'rgba(110,16,16,.9)'; cx.fillRect(0, 188, W, 124);
      cx.textAlign = 'center'; cx.fillStyle = Math.floor(el * 6) % 2 ? '#ffd34d' : '#fff'; cx.font = 'bold 16px sans-serif'; cx.fillText('⚠ WARNING — 적장 등장 ⚠', W / 2 + 70, 214); cx.fillStyle = '#fff'; cx.font = 'bold 48px sans-serif'; cx.fillText(bn[0], W / 2 + 70 + off, 268); cx.fillStyle = '#ffe9a0'; cx.font = 'bold 18px sans-serif'; cx.fillText(bn[1] + ' · 쓰러뜨리면 전투의 흐름이 바뀌어요', W / 2 + 70 - off, 296); cx.restore(); cx.globalAlpha = a; spr(FP + '_boss', 150 - off, 312, 215, {}); cx.globalAlpha = 1; } }
  // 라운드 시작 안내
  if (V.sm && V.sm.pts && V.sm.pts.length && V.ph === 'battle') { const me0 = RP.get(Net.id) || [V.ax, V.ay]; let bq = null, bd = 1e12; for (const q of V.sm.pts) { const d = (q[0] - me0[0]) ** 2 + (q[1] - me0[1]) ** 2; if (d < bd) { bd = d; bq = q; } } if (bq) { const sx = (bq[0] - cam.x) * Z, sy = (bq[1] - cam.y) * Z; if (sx < 30 || sx > W - 30 || sy < 70 || sy > H - 30) { const ang = Math.atan2(sy - H / 2, sx - W / 2), px = Math.max(44, Math.min(W - 44, W / 2 + Math.cos(ang) * 2000)), py = Math.max(90, Math.min(H - 60, H / 2 + Math.sin(ang) * 2000)); cx.save(); cx.translate(px, py); cx.fillStyle = 'rgba(255,200,40,.95)'; cx.strokeStyle = '#5b4636'; cx.lineWidth = 3; cx.beginPath(); cx.arc(0, 0, 22, 0, 7); cx.fill(); cx.stroke(); cx.rotate(ang); cx.fillStyle = '#d9534a'; cx.beginPath(); cx.moveTo(34, 0); cx.lineTo(18, -10); cx.lineTo(18, 10); cx.closePath(); cx.fill(); cx.rotate(-ang); cx.font = '24px sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillStyle = '#000'; cx.fillText(bq[2], 0, 1); cx.restore(); } } }
  if (V.ph === 'battle' && V.t < 5 && !V.paused && !V.cm) { const OI = OBJINFO[V.obj], r = R[V.rd], a = Math.min(1, (5 - V.t) * 1.2, V.t * 3 + 0.2); cx.globalAlpha = a; cx.fillStyle = 'rgba(40,30,20,.82)'; rr(W / 2 - 300, 190, 600, 112, 24); cx.fill(); cx.strokeStyle = '#ffe9a0'; cx.lineWidth = 3; cx.stroke(); cx.textAlign = 'center'; cx.fillStyle = '#ffe9a0'; cx.font = 'bold 15px sans-serif'; cx.fillText(r.yr + '년 · ' + r.pl + ' — ' + r.nm, W / 2, 218); cx.fillStyle = '#fff'; cx.font = 'bold 30px sans-serif'; cx.fillText(OI.ic + ' ' + OI.n, W / 2, 256); cx.font = '15px sans-serif'; cx.fillStyle = '#f3e7cc'; cx.fillText(objText(V.rd, V.obj), W / 2, 284); cx.globalAlpha = 1; }
  // 역사 자막
  { const rd = R[V.rd]; if (!CAPS[V.rd]) CAPS[V.rd] = (rd.b + ' ' + rd.r).split(/(?<=[.!?])\s+/).filter((x) => x.length > 6); const cs = CAPS[V.rd], prog = V.t / V.dur, win = Math.min(0.14, 8 / V.dur);
    const slots = [0.06, 0.38, 0.7]; let ci = -1; slots.forEach((a, i) => { if (prog >= a && prog < a + win) ci = i; });
    if (ci >= 0 && cs[ci] && V.ph === 'battle' && !V.paused && !V.vp && !((V.pl.find((x) => x.id === Net.id) || {}).offer)) { const txt = cs[ci]; cx.font = 'bold 16px sans-serif'; const lines = []; let cur = ''; for (const ch of txt) { cur += ch; if (cx.measureText(cur).width > 540) { lines.push(cur); cur = ''; } } if (cur) lines.push(cur);
      const hh = lines.length * 22 + 16, bx = W / 2 - 290, by = H - hh - 18; cx.fillStyle = 'rgba(252,244,224,.92)'; cx.strokeStyle = '#5b4636'; cx.lineWidth = 2.5; rr(bx, by, 580, hh, 14); cx.fill(); cx.stroke(); cx.fillStyle = '#4a2f1d'; cx.textAlign = 'left'; lines.slice(0, 3).forEach((l, i) => cx.fillText((i === 0 ? '📜 ' : '') + l, bx + 14, by + 26 + i * 22)); } }
  if (V.buff) { cx.fillStyle = 'rgba(255,200,0,.08)'; cx.fillRect(0, 0, W, H); }
  if (V.evR) { cx.fillStyle = 'rgba(20,16,40,.85)'; rr(250, 214, 460, 66, 33); cx.fill(); cx.fillStyle = '#fff'; cx.font = 'bold 22px sans-serif'; cx.textAlign = 'center'; cx.fillText('결정: ' + V.evR, 480, 255); }
  cx.restore();
}
function boot() { initLobby(); setupInput(); applySt(); show('sLobby'); window.__dbg = { addAug, evoElig, evoFinish, startEvoQuiz, pasLoad, pasSave, pasActive, pasSettle, heroStats, heroStats0, MUS, BGM, beginDuel, endDuel, spawnBoss, get G() { return G; }, get V() { return V; }, Net, R, hostCtl, hostMsg, stepBattle, botAI, makeSnap, ER, pickQuiz: nextQuiz, startQuiz, QALL, endRound, gainXp, spawn, UT, ET, pickType, DIFF }; }
boot();
lobbyArt();
if (window.BWJ) BWJ.init({ game: '조선의 위기 디펜스', ver: VER, parent: '#stage' });
