
export interface StoryRequest {
  topic: string;
  duration: string;
  imageStyle: string;
  sceneCount: number;
}

export interface Character {
  name: string;
  referencePrompt: string;
  description: string;
}

export interface Scene {
  id: number;
  imagePrompt: string;
  meaning: string;
  motionDescription: string;
}

export interface StoryResult {
  summary: string;
  script: string;
  characters: Character[];
  scenes: Scene[];
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
