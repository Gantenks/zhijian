import { DiaryEntry } from '@/features/diary/types';
import { createId } from '@/lib/id';
import { toDateKey } from '@/lib/date';
import { subDays } from 'date-fns';

export function createSeedEntries(): DiaryEntry[] {
  const now = new Date();
  const mk = (
    daysAgo: number,
    title: string,
    body: string,
    mood: DiaryEntry['mood'],
    tags: string[],
  ): DiaryEntry => {
    const d = subDays(now, daysAgo);
    const iso = d.toISOString();
    return {
      id: createId(),
      title,
      body,
      mood,
      tags,
      date: toDateKey(d),
      createdAt: iso,
      updatedAt: iso,
    };
  };

  return [
    mk(
      0,
      '纸间的第一页',
      '今天把旧笔记本翻出来，纸页边角已经微微发黄。想把那些零散的句子重新写下来，放进一个安静的地方——就叫它「纸间」吧。\n\n不必写得多好，只要诚实。',
      'good',
      ['开始', '写作'],
    ),
    mk(
      1,
      '雨后的咖啡馆',
      '窗外的雨刚停，空气里有泥土和咖啡混在一起的味道。坐了两个小时，只写了半页，但心里很静。\n\n隔壁桌有人在读一本很旧的诗集，封面磨损得好看。',
      'great',
      ['咖啡', '雨天'],
    ),
    mk(
      3,
      '关于拖延',
      '明明有一整份清单，却只做完了最无关紧要的那一件。晚上躺下时有点懊恼，但也不想再苛责自己。\n\n明天只做三件：回复邮件、散步、写日记。',
      'low',
      ['反思', '日常'],
    ),
    mk(
      5,
      '周末市集',
      '买了一束干花和一小罐蜂蜜。摊主说花是自己晒的，闻起来有淡淡的草香。回家把花插在窗台，下午的光打过来，影子很漂亮。',
      'good',
      ['周末', '市集'],
    ),
    mk(
      8,
      '读到的一句',
      '「生活不是等待暴风雨过去，而是学会在雨中跳舞。」\n\n抄下来，贴在书桌边。今天工作很满，但这句话让节奏慢了一点。',
      'okay',
      ['阅读', '摘抄'],
    ),
    mk(
      12,
      '夜跑',
      '绕着河边跑了四公里。耳机里放着不熟悉的歌单，脚步声和水流声叠在一起。回来时腿有点酸，但脑子清空了。',
      'great',
      ['运动', '夜晚'],
    ),
  ];
}
