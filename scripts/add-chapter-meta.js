#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 챕터별 메타데이터 정의
const chapterMeta = {
  '01': { time: '20-25분', difficulty: '🟢 Beginner', prereq: '없음' },
  '02': { time: '30-40분', difficulty: '🟢 Beginner', prereq: 'Chapter 1 완료' },
  '03': { time: '25-30분', difficulty: '🟢 Beginner', prereq: 'Chapter 2 완료 (Claude Code 설치)' },
  '04': { time: '30-40분', difficulty: '🟢 Beginner', prereq: 'Chapter 3 완료' },
  '05': { time: '35-45분', difficulty: '🟢 Beginner', prereq: 'Chapter 4 완료' },
  '06': { time: '40-50분', difficulty: '🟡 Intermediate', prereq: 'Part 1 (Chapter 1-5) 완료' },
  '07': { time: '35-45분', difficulty: '🟡 Intermediate', prereq: 'Chapter 6 완료' },
  '08': { time: '45-60분', difficulty: '🟡 Intermediate', prereq: 'Chapter 7 완료' },
  '09': { time: '40-50분', difficulty: '🟡 Intermediate', prereq: 'Chapter 8 완료' },
  '10': { time: '45-55분', difficulty: '🟡 Intermediate', prereq: 'Chapter 9 완료' },
  '11': { time: '50-60분', difficulty: '🟡 Intermediate', prereq: 'Part 2 (Chapter 6-10) 완료' },
  '12': { time: '40-50분', difficulty: '🟡 Intermediate', prereq: 'Chapter 11 완료 (Git 기초 이해)' },
  '13': { time: '60-75분', difficulty: '🟡 Intermediate', prereq: 'Chapter 12 완료' },
  '14': { time: '45-60분', difficulty: '🟡 Intermediate', prereq: 'Chapter 13 완료 (웹사이트 개발)' },
  '15': { time: '50-60분', difficulty: '🟡 Intermediate', prereq: 'Chapter 14 완료' },
  '16': { time: '60-75분', difficulty: '🟡 Intermediate', prereq: 'Chapter 15 완료 (localStorage 이해)' },
  '17': { time: '50-60분', difficulty: '🟡 Intermediate', prereq: 'Part 3 (Chapter 11-16) 완료' },
  '18': { time: '60-75분', difficulty: '🟡 Intermediate', prereq: 'Chapter 17 완료' },
  '19': { time: '75-90분', difficulty: '🔴 Advanced', prereq: 'Chapter 18 완료, Node.js 기초' },
  '20': { time: '90-120분', difficulty: '🔴 Advanced', prereq: 'Chapter 19 완료 (백엔드 기초)' },
  '21': { time: '60-75분', difficulty: '🔴 Advanced', prereq: 'Part 4 (Chapter 17-20) 완료' },
  '22': { time: '50-60분', difficulty: '🔴 Advanced', prereq: 'Chapter 21 완료' },
  '23': { time: '60-75분', difficulty: '🔴 Advanced', prereq: 'Chapter 22 완료' },
  '24': { time: '75-90분', difficulty: '🔴 Advanced', prereq: 'Chapter 23 완료' },
  '25': { time: '60-75분', difficulty: '🔴 Advanced', prereq: 'Chapter 24 완료' },
  '26': { time: '60-75분', difficulty: '🔴 Advanced', prereq: 'Chapter 25 완료' },
  '27': { time: '45-60분', difficulty: '🔴 Advanced', prereq: 'Chapter 26 완료' },
  '28': { time: '90-120분', difficulty: '🔴 Advanced', prereq: 'Part 5 (Chapter 21-27) 완료, MetaMask' },
  '29': { time: '90-120분', difficulty: '🔴 Advanced', prereq: 'Chapter 28 완료 (Web3 기초)' },
  '30': { time: '120-150분', difficulty: '🔴 Advanced', prereq: 'Chapter 29 완료 (Farcaster Frames)' }
};

// 파트 매핑
const partMap = {
  '01': 1, '02': 1, '03': 1, '04': 1, '05': 1,
  '06': 2, '07': 2, '08': 2, '09': 2, '10': 2,
  '11': 3, '12': 3, '13': 3, '14': 3, '15': 3, '16': 3,
  '17': 4, '18': 4, '19': 4, '20': 4,
  '21': 5, '22': 5, '23': 5, '24': 5, '25': 5, '26': 5, '27': 5,
  '28': 6, '29': 6, '30': 6
};

const curriculumDir = path.join(__dirname, '../public/curriculum');

// 메타 정보 블록 생성
function createMetaBlock(chapterNum) {
  const meta = chapterMeta[chapterNum];
  const part = partMap[chapterNum];
  
  return `
---

## 📊 챕터 정보

| 항목 | 내용 |
|------|------|
| ⏱️ **예상 시간** | ${meta.time} |
| 🎯 **난이도** | ${meta.difficulty} |
| 📚 **파트** | Part ${part} |
| 📋 **사전 요구사항** | ${meta.prereq} |

---
`;
}

// 파일 처리
function processChapterFile(filePath, chapterNum) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 이미 메타 정보가 있는지 확인
    if (content.includes('## 📊 챕터 정보')) {
      console.log(`⏭️  Skip: ${filePath} (이미 메타 정보 있음)`);
      return;
    }
    
    // 첫 번째 헤더(#) 찾기
    const lines = content.split('\n');
    let insertIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      // 첫 번째 # 헤더 이후의 첫 번째 빈 줄이나 --- 찾기
      if (lines[i].startsWith('# Chapter') || lines[i].startsWith('# ')) {
        // 언어 선택 줄 찾기
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].includes('[English]') || lines[j].includes('[한국어]')) {
            insertIndex = j + 1;
            break;
          }
          if (lines[j].startsWith('---') || lines[j].startsWith('## ')) {
            insertIndex = j;
            break;
          }
        }
        break;
      }
    }
    
    if (insertIndex === -1) {
      console.log(`⚠️  Warning: ${filePath} - 삽입 위치를 찾을 수 없음`);
      return;
    }
    
    // 메타 블록 삽입
    const metaBlock = createMetaBlock(chapterNum);
    lines.splice(insertIndex, 0, metaBlock);
    
    const newContent = lines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// 메인 실행
function main() {
  console.log('🚀 챕터 메타 정보 추가 시작...\n');
  
  const chapters = fs.readdirSync(curriculumDir)
    .filter(name => name.startsWith('Chapter'))
    .sort();
  
  for (const chapter of chapters) {
    const chapterNum = chapter.match(/Chapter(\d+)/)?.[1];
    if (!chapterNum || !chapterMeta[chapterNum]) {
      console.log(`⏭️  Skip: ${chapter} (메타 데이터 없음)`);
      continue;
    }
    
    const koFilePath = path.join(curriculumDir, chapter, 'README.ko.md');
    
    if (fs.existsSync(koFilePath)) {
      processChapterFile(koFilePath, chapterNum);
    } else {
      console.log(`⚠️  Warning: ${koFilePath} 파일 없음`);
    }
  }
  
  console.log('\n✨ 완료!');
}

main();
