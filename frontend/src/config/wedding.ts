// ─── Names ───
export let GROOM_ENG_NAME = 'Tao';
export let GROOM_KOR_NAME = '陶先生';
export let BRIDE_ENG_NAME = 'Li';
export let BRIDE_KOR_NAME = '李女士';
export let GROOM_FATHER_KOR_NAME = '陶父';
export let GROOM_MOTHER_KOR_NAME = '陶母';
export let BRIDE_FATHER_KOR_NAME = '李父';
export let BRIDE_MOTHER_KOR_NAME = '李母';

// ─── Bank Accounts ───
export let GROOM_BANK_ACCOUNT = '请填写';
export let BRIDE_BANK_ACCOUNT = '请填写';
export let GROOM_FATHER_BANK_ACCOUNT = '请填写';
export let GROOM_MOTHER_BANK_ACCOUNT = '请填写';
export let BRIDE_FATHER_BANK_ACCOUNT = '请填写';
export let BRIDE_MOTHER_BANK_ACCOUNT = '请填写';

// ─── Wedding Details ───
export let WEDDING_DATETIME = new Date('2027-01-01T11:00:00+08:00');
export let VENUE_NAME = '湖南省岳阳市';
export let VENUE_ADDRESS = '湖南省岳阳市';
export let VENUE_FLOOR = '';
export let VENUE_HALL = '';
export let VENUE_PHONE = '';

// ─── Map Providers ───
export interface MapLinks {
  google: string;
  kakao: string;
  naver: string;
  tmap: string;
}

export interface MapProviders {
  embed_provider: string;
  latitude: number;
  longitude: number;
  api_key: string;
  links: MapLinks;
}

export let MAP_PROVIDERS: MapProviders = {
  embed_provider: '',
  latitude: 0,
  longitude: 0,
  api_key: '',
  links: {
    google: '',
    kakao: '',
    naver: '',
    tmap: '',
  },
};

// ─── Transport Info ───
export let SUBWAY_INFO = [''];
export let BUS_INFO: { stop: string; routes: string }[] = [];
export let CAR_INFO = '';
export let CHARTER_BUS: {
  location: string;
  company: string;
  bus_number: string;
  departure: string;
}[] = [];
export let CHARTER_BUS_NOTICE = '';

// ─── Birth Order ───
export let GROOM_BIRTH_ORDER = '';
export let BRIDE_BIRTH_ORDER = '';

// ─── Game ───
export let CARD_GAME_TIMER = 30000;
export let GAME_NPC_MESSAGE =
  '안녕! 게임을 클리어하면 신랑 신부의 특별한 사진들을 볼 수 있어요... 도전해 보세요!';

// ─── Dynamic Assets ───
export let MAIN_PHOTO_URL = '';
export let GAME_PHOTO_COUNT = 0;

// ─── Avatar ───
export let AVATAR_COLORS = '8B6914,A0722A,C4943A,5C3A0E,F5E6C8';

// ─── Photo Upload ───
export let PHOTO_UPLOAD_ENABLED = false;
export let PHOTO_UPLOAD_HOURS_BEFORE = 1;

// ─── Greeting ───
export let SHORT_GREETING = '我们要结婚啦';
export let MAIN_GREET_TEXT =
  '诚挚邀请您参加我们的婚礼\n与我们共同见证这份幸福';

// ─── Demo Mode ───
export let DEMO_MODE = false;

// Static deployment: all values above are the single source of truth.
// There is no backend, so no runtime config loading.
