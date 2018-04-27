import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../../classes/user';
import { Asset } from '../../../classes/asset';
import { UserProvider } from '../../providers/user/user';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { OrderPage } from '../order/order';
/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  user: User;
  assets: Asset[];
  url: string;

  constructor(
    public userProvider: UserProvider,
    public http: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.user = navParams.get('user');
    this.assets = new Array<Asset>();
    var baseUrl = "https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES";
    var symbols = "&symbols=";
    var apiKey = "&apikey=TRDOTVDYQ5Y7A9XX"
    for (let asset of this.user.ownedAssets) {
      symbols += asset.symbol + ",";
    }
    this.url = baseUrl + symbols + apiKey;

    this.http.get(this.url).subscribe(data => {
        this.buildAssets(data["Stock Quotes"]);
        console.log(this.assets);
    });
  }

  ionViewDidLoad() {

  }

  buildAssets(data: any[]) {
    for (var i = 0; i < data.length; i++) {
      var newAss : Asset = new Asset();
      var currentItem = data[i];
      newAss.symbol = currentItem["1. symbol"];
      newAss.price = currentItem["2. price"];
      newAss.volume = currentItem["3. volume"];
      newAss.timestamp = currentItem["4. timestamp"];
      this.assets.push(newAss);
    }
  }

  navToOrder(user: User, asset: Asset) {
    this.navCtrl.push(OrderPage, {
      user: user,
      asset: asset
    });
  }

}
