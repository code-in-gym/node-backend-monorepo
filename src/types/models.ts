export const MODEL_TYPES = {
  USER: 'USER',
  POST: 'POST',
  COMMENT: 'COMMENT',
} as const;

export type ModelType = keyof typeof MODEL_TYPES;

// 类型保护函数
export function isValidModelType(type: string): type is ModelType {
  return type in MODEL_TYPES;
}
