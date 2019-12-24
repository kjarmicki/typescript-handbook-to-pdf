import rimraf from 'rimraf';

export interface PromisedRimraf {
  (path: string, options?: rimraf.Options | undefined): Promise<void>;
}
