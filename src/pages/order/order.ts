import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../../classes/user';
import { Asset } from '../../../classes/asset';
import { OwnedAsset } from '../../../classes/ownedAsset';
/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  user: User;
  asset: Asset;
  buyOrSell: string;

  constructor(public userProvider: UserProvider, public http: HttpClient, public navCtrl: NavController, public navParams: NavParams) {
    this.user = navParams.get("user");
    this.asset = navParams.get("asset");


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  changeAsset(newSymbol: string) {
    var baseUrl = "https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES";
    var symbols = "&symbols=" + newSymbol;
    var apiKey = "&apikey=TRDOTVDYQ5Y7A9XX"

    this.http.get(baseUrl + symbols + apiKey).subscribe(data => {
        this.buildAsset(data["Stock Quotes"]);
    });
  }

  submitOrder(qty: string) {
    //
    if (this.buyOrSell == "buy") {
      // if they own, just update record
      var alreadyOwns = false;
      var index = 0;
      while (index < this.user.ownedAssets.length) {
        if (this.user.ownedAssets[index].symbol === this.asset.symbol) {
          alreadyOwns = true;
          break;
        }
        index++;
      }
      if (alreadyOwns) {
        this.user.ownedAssets[index].quantity += parseInt(qty);
        this.user.ownedAssets[index].bookValue += (parseInt(qty) * parseInt(this.asset.price));
      } else {
        var newOwnedAsset: OwnedAsset;
        newOwnedAsset.symbol = this.asset.symbol;
        newOwnedAsset.quantity = parseInt(qty);
        newOwnedAsset.bookValue = parseInt(this.asset.price) * parseInt(qty);
      }

    } else {
      // sell
    }
    this.userProvider.updateUser(this.user);
  }

  buildAsset(data: any) {
      var newAss : Asset = new Asset();
      newAss.symbol = data["1. symbol"];
      newAss.price = data["2. price"];
      newAss.volume = data["3. volume"];
      newAss.timestamp = data["4. timestamp"];
      this.asset = newAss;
  }

}
