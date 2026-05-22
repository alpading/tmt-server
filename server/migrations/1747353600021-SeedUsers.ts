import { MigrationInterface, QueryRunner } from 'typeorm';

// 100명 가상 유저 시드
// 기본 비밀번호: test1234 (bcrypt hash, rounds=10)
// MBTI 16종 × 6~7명, HORMONE 50/50, GENDER 50/50
// 성향값(1~3)은 MBTI/hormone 성향에 맞게 분포

const PW = '$2b$10$riw.rTO4wN0I8NFibVPiJ.U4kqRptkMYRIpbXK1lgJJTdNPRfBY2e';

// (loginId, name, birthDate, gender, mbti, hormone)
const USERS: [string, string, string, string, string, string][] = [
  // INTJ × 6
  ['user001', '김민준', '1995-03-12', 'MALE',   'INTJ', 'TETO'],
  ['user002', '이서연', '1998-07-24', 'FEMALE', 'INTJ', 'TETO'],
  ['user003', '박지훈', '1990-11-05', 'MALE',   'INTJ', 'TETO'],
  ['user004', '최수아', '2000-02-18', 'FEMALE', 'INTJ', 'TETO'],
  ['user005', '정우진', '1993-09-30', 'MALE',   'INTJ', 'TETO'],
  ['user006', '한예린', '1997-05-14', 'FEMALE', 'INTJ', 'TETO'],
  // INTP × 6
  ['user007', '오승현', '1996-08-22', 'MALE',   'INTP', 'TETO'],
  ['user008', '윤지민', '1999-01-07', 'FEMALE', 'INTP', 'TETO'],
  ['user009', '장태양', '1992-12-19', 'MALE',   'INTP', 'TETO'],
  ['user010', '임나영', '2001-04-03', 'FEMALE', 'INTP', 'TETO'],
  ['user011', '신동현', '1994-06-27', 'MALE',   'INTP', 'TETO'],
  ['user012', '홍지수', '1998-10-11', 'FEMALE', 'INTP', 'TETO'],
  // ENTJ × 6
  ['user013', '강준호', '1991-03-08', 'MALE',   'ENTJ', 'TETO'],
  ['user014', '조아름', '1996-09-16', 'FEMALE', 'ENTJ', 'TETO'],
  ['user015', '윤성민', '1989-07-01', 'MALE',   'ENTJ', 'TETO'],
  ['user016', '백채원', '2000-11-23', 'FEMALE', 'ENTJ', 'TETO'],
  ['user017', '노준서', '1993-01-15', 'MALE',   'ENTJ', 'TETO'],
  ['user018', '문소희', '1997-08-09', 'FEMALE', 'ENTJ', 'TETO'],
  // ENTP × 6
  ['user019', '권태민', '1995-05-21', 'MALE',   'ENTP', 'TETO'],
  ['user020', '서하은', '1999-02-14', 'FEMALE', 'ENTP', 'TETO'],
  ['user021', '황재원', '1992-10-08', 'MALE',   'ENTP', 'TETO'],
  ['user022', '안지유', '2001-07-30', 'FEMALE', 'ENTP', 'TETO'],
  ['user023', '송민혁', '1994-03-25', 'MALE',   'ENTP', 'TETO'],
  ['user024', '류하린', '1998-12-04', 'FEMALE', 'ENTP', 'TETO'],
  // INFJ × 6
  ['user025', '전지호', '1996-06-18', 'MALE',   'INFJ', 'EGEN'],
  ['user026', '남다은', '2000-09-05', 'FEMALE', 'INFJ', 'EGEN'],
  ['user027', '배성준', '1990-04-12', 'MALE',   'INFJ', 'EGEN'],
  ['user028', '오하늘', '1997-11-28', 'FEMALE', 'INFJ', 'EGEN'],
  ['user029', '구민재', '1993-07-07', 'MALE',   'INFJ', 'EGEN'],
  ['user030', '이가은', '1999-03-22', 'FEMALE', 'INFJ', 'EGEN'],
  // INFP × 7
  ['user031', '차도윤', '1995-01-17', 'MALE',   'INFP', 'EGEN'],
  ['user032', '신예슬', '1998-08-03', 'FEMALE', 'INFP', 'EGEN'],
  ['user033', '김하준', '1991-05-29', 'MALE',   'INFP', 'EGEN'],
  ['user034', '정소율', '2000-12-14', 'FEMALE', 'INFP', 'EGEN'],
  ['user035', '임재현', '1994-09-20', 'MALE',   'INFP', 'EGEN'],
  ['user036', '한채은', '1997-02-06', 'FEMALE', 'INFP', 'EGEN'],
  ['user037', '오준영', '2001-10-31', 'MALE',   'INFP', 'EGEN'],
  // ENFJ × 6
  ['user038', '박서준', '1992-06-09', 'MALE',   'ENFJ', 'EGEN'],
  ['user039', '최민서', '1996-03-27', 'FEMALE', 'ENFJ', 'EGEN'],
  ['user040', '이도현', '1989-11-14', 'MALE',   'ENFJ', 'EGEN'],
  ['user041', '김나연', '1999-07-01', 'FEMALE', 'ENFJ', 'EGEN'],
  ['user042', '정민호', '1993-04-18', 'MALE',   'ENFJ', 'EGEN'],
  ['user043', '배수진', '2000-01-25', 'FEMALE', 'ENFJ', 'EGEN'],
  // ENFP × 7
  ['user044', '손재민', '1995-10-07', 'MALE',   'ENFP', 'EGEN'],
  ['user045', '유하영', '1998-05-19', 'FEMALE', 'ENFP', 'EGEN'],
  ['user046', '장승현', '1991-08-13', 'MALE',   'ENFP', 'EGEN'],
  ['user047', '권도희', '2001-02-28', 'FEMALE', 'ENFP', 'EGEN'],
  ['user048', '문준호', '1994-12-10', 'MALE',   'ENFP', 'EGEN'],
  ['user049', '강소연', '1997-06-23', 'FEMALE', 'ENFP', 'EGEN'],
  ['user050', '노태현', '1990-03-05', 'MALE',   'ENFP', 'EGEN'],
  // ISTJ × 6
  ['user051', '조현우', '1996-09-17', 'MALE',   'ISTJ', 'TETO'],
  ['user052', '임수연', '1999-04-02', 'FEMALE', 'ISTJ', 'TETO'],
  ['user053', '황도준', '1992-01-26', 'MALE',   'ISTJ', 'TETO'],
  ['user054', '안소미', '2000-08-14', 'FEMALE', 'ISTJ', 'TETO'],
  ['user055', '전민준', '1993-11-08', 'MALE',   'ISTJ', 'TETO'],
  ['user056', '서채린', '1997-07-19', 'FEMALE', 'ISTJ', 'TETO'],
  // ISFJ × 6
  ['user057', '백준서', '1995-02-11', 'MALE',   'ISFJ', 'EGEN'],
  ['user058', '류지아', '1998-09-27', 'FEMALE', 'ISFJ', 'EGEN'],
  ['user059', '김성민', '1991-06-15', 'MALE',   'ISFJ', 'EGEN'],
  ['user060', '이보라', '2001-03-09', 'FEMALE', 'ISFJ', 'EGEN'],
  ['user061', '박찬호', '1994-10-22', 'MALE',   'ISFJ', 'EGEN'],
  ['user062', '최아영', '1997-01-04', 'FEMALE', 'ISFJ', 'EGEN'],
  // ESTJ × 6
  ['user063', '정대현', '1990-07-30', 'MALE',   'ESTJ', 'TETO'],
  ['user064', '한민지', '1996-12-16', 'FEMALE', 'ESTJ', 'TETO'],
  ['user065', '오재훈', '1993-05-03', 'MALE',   'ESTJ', 'TETO'],
  ['user066', '남수빈', '1999-10-18', 'FEMALE', 'ESTJ', 'TETO'],
  ['user067', '구태호', '1992-03-24', 'MALE',   'ESTJ', 'TETO'],
  ['user068', '신다희', '2000-06-07', 'FEMALE', 'ESTJ', 'TETO'],
  // ESFJ × 6
  ['user069', '장현준', '1995-08-20', 'MALE',   'ESFJ', 'EGEN'],
  ['user070', '권예진', '1998-03-06', 'FEMALE', 'ESFJ', 'EGEN'],
  ['user071', '문지훈', '1991-11-12', 'MALE',   'ESFJ', 'EGEN'],
  ['user072', '배나영', '2001-06-25', 'FEMALE', 'ESFJ', 'EGEN'],
  ['user073', '강민서', '1994-02-17', 'MALE',   'ESFJ', 'EGEN'],
  ['user074', '노지현', '1997-09-01', 'FEMALE', 'ESFJ', 'EGEN'],
  // ISTP × 6
  ['user075', '손준혁', '1996-04-13', 'MALE',   'ISTP', 'TETO'],
  ['user076', '유소영', '1999-11-29', 'FEMALE', 'ISTP', 'TETO'],
  ['user077', '임태민', '1992-08-07', 'MALE',   'ISTP', 'TETO'],
  ['user078', '조하린', '2000-05-21', 'FEMALE', 'ISTP', 'TETO'],
  ['user079', '황재성', '1993-02-14', 'MALE',   'ISTP', 'TETO'],
  ['user080', '안채영', '1997-10-28', 'FEMALE', 'ISTP', 'TETO'],
  // ISFP × 6
  ['user081', '전도현', '1995-07-09', 'MALE',   'ISFP', 'EGEN'],
  ['user082', '서예나', '1998-01-23', 'FEMALE', 'ISFP', 'EGEN'],
  ['user083', '김준우', '1991-09-16', 'MALE',   'ISFP', 'EGEN'],
  ['user084', '이다솔', '2001-04-30', 'FEMALE', 'ISFP', 'EGEN'],
  ['user085', '박민성', '1994-08-12', 'MALE',   'ISFP', 'EGEN'],
  ['user086', '최예원', '1997-03-26', 'FEMALE', 'ISFP', 'EGEN'],
  // ESTP × 6
  ['user087', '조성훈', '1990-12-08', 'MALE',   'ESTP', 'TETO'],
  ['user088', '한나리', '1996-05-24', 'FEMALE', 'ESTP', 'TETO'],
  ['user089', '오민재', '1993-10-11', 'MALE',   'ESTP', 'TETO'],
  ['user090', '남지은', '1999-07-17', 'FEMALE', 'ESTP', 'TETO'],
  ['user091', '구성준', '1992-04-05', 'MALE',   'ESTP', 'TETO'],
  ['user092', '신하연', '2000-09-20', 'FEMALE', 'ESTP', 'TETO'],
  // ESFP × 8
  ['user093', '장우혁', '1995-06-14', 'MALE',   'ESFP', 'EGEN'],
  ['user094', '권민아', '1998-02-28', 'FEMALE', 'ESFP', 'EGEN'],
  ['user095', '문태준', '1991-10-22', 'MALE',   'ESFP', 'EGEN'],
  ['user096', '배지수', '2001-08-05', 'FEMALE', 'ESFP', 'EGEN'],
  ['user097', '강재원', '1994-01-19', 'MALE',   'ESFP', 'EGEN'],
  ['user098', '노하은', '1997-07-03', 'FEMALE', 'ESFP', 'EGEN'],
  ['user099', '손민준', '1990-05-17', 'MALE',   'ESFP', 'EGEN'],
  ['user100', '유채빈', '1999-12-31', 'FEMALE', 'ESFP', 'EGEN'],
];

// 성향 프리셋: MBTI/hormone 특성에 맞게 3가지 패턴
// A: 자극적/활동적 선호 (T계열, TETO)
// B: 힐링/감성 선호 (F계열, EGEN)
// C: 균형형
type PrefRow = [number,number,number,number,number,number,number,number, // res
                number,number,number,number,number,number,               // stay
                number,number,number,number];                             // act

const PREF_A: PrefRow = [3,1,3,3,2,1,2,1, 2,3,2,1,2,1, 1,2,1,3];
const PREF_B: PrefRow = [1,3,1,1,2,3,3,2, 3,3,2,2,3,3, 3,3,3,1];
const PREF_C: PrefRow = [2,2,2,2,2,2,2,2, 2,2,2,2,2,2, 2,2,2,2];
const PREF_D: PrefRow = [2,3,2,2,1,3,3,3, 3,2,3,2,3,2, 2,3,2,2]; // 감성+공간
const PREF_E: PrefRow = [3,1,3,2,1,1,2,1, 1,2,1,1,2,1, 1,1,1,3]; // 자극+액티브

function getPref(mbti: string, hormone: string): PrefRow {
  const isT = ['INTJ','INTP','ENTJ','ENTP','ISTJ','ESTJ','ISTP','ESTP'].includes(mbti);
  if (hormone === 'TETO' && isT) return PREF_A;
  if (hormone === 'EGEN' && !isT) return PREF_B;
  if (hormone === 'TETO' && !isT) return PREF_D;
  if (hormone === 'EGEN' && isT)  return PREF_E;
  return PREF_C;
}

export class SeedUsers1747353600021 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [loginId, name, birthDate, gender, mbti, hormone] of USERS) {
      const [p] = await queryRunner.query(
        `INSERT INTO "users" (login_id, hashed_pw, name, birth_date, gender, mbti, hormone, role)
         VALUES ($1, $2, $3, $4, $5::gender_enum, $6::mbti_enum, $7::hormone_enum, 'USER')
         RETURNING id`,
        [loginId, PW, name, birthDate, gender, mbti, hormone],
      );
      const userId = p.id;

      const [r0,r1,r2,r3,r4,r5,r6,r7,s0,s1,s2,s3,s4,s5,a0,a1,a2,a3] = getPref(mbti, hormone);

      await queryRunner.query(
        `INSERT INTO "user_preferences" (
           user_id,
           res_oily, res_mild, res_clean, res_stim, res_spicy, res_noise, res_interior, res_service,
           stay_view, stay_interior, stay_space, stay_noise, stay_clean, stay_service,
           act_culture, act_view, act_healing, act_active
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
        [userId, r0,r1,r2,r3,r4,r5,r6,r7,s0,s1,s2,s3,s4,s5,a0,a1,a2,a3],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const loginIds = USERS.map(u => `'${u[0]}'`).join(',');
    await queryRunner.query(`DELETE FROM "users" WHERE login_id IN (${loginIds})`);
  }
}
