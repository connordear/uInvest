import { OwnedAsset } from './ownedAsset';

export class User {
  id: number;
  name: String;
  riskProfile: number;
  interests: String[];
  ownedAssets: OwnedAsset[];
}
