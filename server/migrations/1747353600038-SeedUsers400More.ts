import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 400명 추가 시드 (user101 ~ user500)
 * MBTI 16종 × 25명, TETO/EGEN T/F 성향 반영, 성별 50/50
 */

const PW = '$2b$10$riw.rTO4wN0I8NFibVPiJ.U4kqRptkMYRIpbXK1lgJJTdNPRfBY2e';

const MBTI_LIST = [
  'INTJ','INTP','ENTJ','ENTP',
  'INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ',
  'ISTP','ISFP','ESTP','ESFP',
];
const T_SET = new Set(['INTJ','INTP','ENTJ','ENTP','ISTJ','ESTJ','ISTP','ESTP']);

const SURNAMES = ['김','이','박','최','정','강','조','윤','장','임','한','오','서','신','권','황','안','송','류','전','홍','고','문','양','손','배','백','허','남','심'];
const M_NAMES  = ['민준','서준','도윤','예준','시우','주원','하준','지호','준서','준우','현우','지훈','건우','우진','민재','재원','지원','유준','정우','승현','시윤','태양','현준','도현','재민'];
const F_NAMES  = ['서연','서윤','지우','채원','수아','지민','하은','예은','지유','유나','윤서','예진','다은','소율','지현','하린','나연','보미','수빈','채린','아린','예원','소현','민지','하영'];

const YEARS  = [1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003];
const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12'];
const DAYS   = ['03','07','10','14','17','19','21','24','27','28'];

type PrefRow = [number,number,number,number,number,number,number,number,
                number,number,number,number,number,number,
                number,number,number,number];

const PREF_A: PrefRow = [3,1,3,3,2,1,2,1, 2,3,2,1,2,1, 1,2,1,3]; // TETO + T
const PREF_B: PrefRow = [1,3,1,1,2,3,3,2, 3,3,2,2,3,3, 3,3,3,1]; // EGEN + F
const PREF_C: PrefRow = [2,2,2,2,2,2,2,2, 2,2,2,2,2,2, 2,2,2,2]; // 균형
const PREF_D: PrefRow = [2,3,2,2,1,3,3,3, 3,2,3,2,3,2, 2,3,2,2]; // TETO + F
const PREF_E: PrefRow = [3,1,3,2,1,1,2,1, 1,2,1,1,2,1, 1,1,1,3]; // EGEN + T

// 개인 편차: 완전히 동일한 선호값 방지
const PREF_A2: PrefRow = [3,1,2,3,2,2,2,1, 2,2,2,1,2,1, 1,2,2,3];
const PREF_A3: PrefRow = [2,1,3,3,3,1,1,1, 1,3,2,1,1,1, 1,1,1,3];
const PREF_B2: PrefRow = [1,3,1,2,2,3,2,2, 3,2,2,2,3,2, 3,2,3,1];
const PREF_B3: PrefRow = [2,3,2,1,1,3,3,3, 2,3,3,2,2,3, 2,3,2,2];
const PREF_D2: PrefRow = [2,2,2,1,1,3,3,2, 3,2,2,2,3,2, 2,2,2,2];
const PREF_E2: PrefRow = [3,2,3,2,2,1,1,1, 1,1,1,1,2,1, 1,1,2,3];

function getPref(mbti: string, hormone: string, variant: number): PrefRow {
  const isT = T_SET.has(mbti);
  if (hormone === 'TETO' && isT)  return variant === 0 ? PREF_A : variant === 1 ? PREF_A2 : PREF_A3;
  if (hormone === 'EGEN' && !isT) return variant === 0 ? PREF_B : variant === 1 ? PREF_B2 : PREF_B3;
  if (hormone === 'TETO' && !isT) return variant === 0 ? PREF_D : PREF_D2;
  if (hormone === 'EGEN' && isT)  return variant === 0 ? PREF_E : PREF_E2;
  return PREF_C;
}

export class SeedUsers400More1747353600038 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const PER_MBTI = 25; // 16 × 25 = 400명
    let mIdx = 0, fIdx = 0;

    for (let i = 0; i < MBTI_LIST.length * PER_MBTI; i++) {
      const mbtiIdx  = Math.floor(i / PER_MBTI);
      const posInGrp = i % PER_MBTI;
      const mbti     = MBTI_LIST[mbtiIdx];
      const isT      = T_SET.has(mbti);
      const gender   = i % 2 === 0 ? 'MALE' : 'FEMALE';

      // T계열: 처음 18명 TETO, 나머지 7명 EGEN / F계열 반대
      const hormone = posInGrp < 18
        ? (isT ? 'TETO' : 'EGEN')
        : (isT ? 'EGEN' : 'TETO');

      const loginId   = `user${String(101 + i).padStart(3, '0')}`;
      const birthDate = `${YEARS[i % YEARS.length]}-${MONTHS[i % MONTHS.length]}-${DAYS[i % DAYS.length]}`;

      let fullName: string;
      if (gender === 'MALE') {
        fullName = SURNAMES[mIdx % SURNAMES.length] + M_NAMES[mIdx % M_NAMES.length];
        mIdx++;
      } else {
        fullName = SURNAMES[fIdx % SURNAMES.length] + F_NAMES[fIdx % F_NAMES.length];
        fIdx++;
      }

      const result = await queryRunner.query(
        `INSERT INTO "users" (login_id, hashed_pw, name, birth_date, gender, mbti, hormone, role)
         VALUES ($1,$2,$3,$4,$5::gender_enum,$6::mbti_enum,$7::hormone_enum,'USER')
         ON CONFLICT (login_id) DO NOTHING
         RETURNING id`,
        [loginId, PW, fullName, birthDate, gender, mbti, hormone],
      );
      if (!result[0]) continue;

      const userId  = result[0].id;
      const variant = posInGrp % 3;
      const prefs   = getPref(mbti, hormone, variant);

      await queryRunner.query(
        `INSERT INTO "user_preferences" (
           user_id,
           res_oily, res_mild, res_clean, res_stim, res_spicy, res_noise, res_interior, res_service,
           stay_view, stay_interior, stay_space, stay_noise, stay_clean, stay_service,
           act_culture, act_view, act_healing, act_active
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
        [userId, ...prefs],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const loginIds = Array.from({ length: 400 }, (_, i) =>
      `'user${String(101 + i).padStart(3, '0')}'`
    ).join(',');
    await queryRunner.query(`DELETE FROM "users" WHERE login_id IN (${loginIds})`);
  }
}
