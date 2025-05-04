import Sqids from 'sqids';
import { MODEL_TYPES, ModelType, isValidModelType } from '@/types/models';

class ModelIdManager {
  private static instance: ModelIdManager;
  private sqids: Sqids;
  private modelOffsets: Map<ModelType, number> = new Map();
  private offsetStep = 10000000;

  private constructor() {
    this.sqids = new Sqids({
      minLength: 10,
      alphabet:
        process.env.SQIDS_ALPHABET ||
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    });
  }

  public static getInstance(): ModelIdManager {
    if (!ModelIdManager.instance) {
      ModelIdManager.instance = new ModelIdManager();
    }
    return ModelIdManager.instance;
  }

  public registerModel(modelType: ModelType): void {
    if (this.modelOffsets.has(modelType)) {
      return;
    }
    const offset = (this.modelOffsets.size + 1) * this.offsetStep;
    this.modelOffsets.set(modelType, offset);
  }

  public encodeId(modelType: ModelType, id: number): string {
    if (!this.modelOffsets.has(modelType)) {
      this.registerModel(modelType);
    }
    const offset = this.modelOffsets.get(modelType)!;
    return this.sqids.encode([offset + id]);
  }

  public decodeId(modelType: ModelType, hash: string): number | null {
    if (!this.modelOffsets.has(modelType)) {
      this.registerModel(modelType);
    }
    const offset = this.modelOffsets.get(modelType)!;
    const numbers = this.sqids.decode(hash);

    if (numbers.length === 0) return null;

    const decodedWithOffset = numbers[0];
    if (
      decodedWithOffset < offset ||
      decodedWithOffset >= offset + this.offsetStep
    ) {
      return null;
    }

    return decodedWithOffset - offset;
  }

  public getRegisteredModels(): ModelType[] {
    return Array.from(this.modelOffsets.keys());
  }
}

// 创建实例并预注册所有模型
const idManager = ModelIdManager.getInstance();
Object.values(MODEL_TYPES).forEach((modelType) => {
  if (isValidModelType(modelType)) {
    idManager.registerModel(modelType);
  }
});

export const encodeId = (modelType: string, id: number): string => {
  if (!isValidModelType(modelType)) {
    throw new Error(`Invalid model type: ${modelType}`);
  }
  return idManager.encodeId(modelType, id);
};

export const decodeId = (modelType: string, hash: string): number | null => {
  if (!isValidModelType(modelType)) {
    return null;
  }
  return idManager.decodeId(modelType, hash);
};
