import { OwnedAsset } from './ownedAsset';

export class User {
  _id: number;
  name: String;
  balance: number;
  riskProfile: number;
  interests: String[];
  ownedAssets: OwnedAsset[];
}
