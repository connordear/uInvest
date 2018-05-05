import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { UserProvider } from '../providers/user/user';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { OrderPageModule } from '../pages/order/order.module';
import { AssetProvider } from '../providers/asset/asset';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    UserProfilePage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OrderPageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    UserProfilePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    AssetProvider,
  ]
})
export class AppModule {}
