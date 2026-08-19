const localMedia = (fileName: string) => `${import.meta.env.BASE_URL}media/${fileName}`;

export const morningMistScene = {
  forestSrc: localMedia("t01-morning-path_dec54c86.png"),
  endFrameSrc: localMedia("t01-herb-sample_28e3946a.png"),
  motionVideoSrc: localMedia("t01-walk-to-herb_837a13bf.mp4"),
  researcherSrc: localMedia("herbal-researcher-character_f291db2d.png"),
  forestAlt: "晨雾山径中携带野外笔记的药草研究员",
  researcherAlt: "携带标本夹与药草挎包的轻幻想药草研究员",
  sceneLabel: "SCENE 01 / MORNING MIST",
  sceneName: "晨雾入山",
} as const;
