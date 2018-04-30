import { OwnedAsset } from './ownedAsset';
import { Recommendation } from './recommendation';

export class User {
  _id: number;
  name: String;
  balance: number;
  riskProfile: number;
  interests: String[];
  ownedAssets: OwnedAsset[];
  recommendations: Recommendation[];
}
