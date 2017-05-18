enchant(); // おまじない

var baseData = {
    WIDTH: 400,
    HEIGHT: 260
};

window.onload = function () {

    // 行の終わりには、;（セミコロン）を付けます。

    var game = new Game(baseData.WIDTH, baseData.HEIGHT); // ゲーム本体を準備すると同時に、表示される領域の大きさを設定しています。
    game.fps = 15; // frames（フレーム）per（毎）second（秒）：ゲームの進行スピードを設定しています。
    game.preload('./img/start.png', './img/gameover.png', './img/retry.png', './img/chara1.png', './img/enemy.gif'); // pre（前）-load（読み込み）：ゲームに使う素材をあらかじめ読み込んでおきます。

    game.onload = function () { // ゲームの準備が整ったらメインの処理を実行します。
        var scroll = 0; // スクロール量を記録する変数
        var SCROLL_SPEED = 3;

        // スコア表示用ラベルの設定
        var scoreLabel = new Label(""); // ラベルを作る
        scoreLabel.color = '#fff'; // 白色に設定

        game.rootScene.addChild(scoreLabel);
        //        game.rootScene.addEventListener(Event.ENTER_FRAME, function () {
        //            
        //        })

        var GROUND_LINE = 250; // 地平線の高さ（固定）



        var kuma = new Sprite(32, 32); // くまを作ります
        kuma.image = game.assets['./img/chara1.png']; // くまの画像を設定します
        kuma.scale(2.5, 2.5);
        kuma.x = 40; // 画面やや左側に配置
        kuma.y = GROUND_LINE - kuma.height * 1.8; // くまの下端を地平線の高さと合わせる(218)

        game.rootScene.addChild(kuma); // ゲームのシーンにくまを表示させます。
        game.rootScene.backgroundColor = '#7ecef4'; // ゲームの動作部分の背景色を設定しています。

        // 毎フレームイベントをシーンに追加
        var a = [0, 1, 0, 2];
        var count = 0;
        kuma.addEventListener(Event.ENTER_FRAME, function () {
            if (isEnd) {
                return;
            }
            // くまのフレームを0, 1, 2, 0, 1, 2…… と繰り返します
            // 正確には0, 1, 2, 1, 0, 1, 2, 1, 0, 1…… ですが、
            // 0, 1, 2, 0, 1, 2…… でも十分走っているように見えるため、良いものとします

            //kuma.frame ++;
            kuma.frame = a[count];
            count++;
            if (count > 3) {
                count = 0;
            }
        });

        var isEnd = false;
        var kumaDead = function () {
            //            alert("ヤラレチャッタ");              // ポップアップメッセージを出す
            kuma.frame = 3; // くまを涙目にする
            game.rootScene.addChild(kuma); // ゲームオーバーシーンをゲームシーンに重ねる(push)
            //            if (kuma.flame == 3)
            //                game.pause();
            isEnd = true;
        }


        var createGameoverScene = function (scroll) {
            var scene = new Scene(); // 新しいシーンを作る
            //            scene.backgroundColor = 'rgba(0, 0, 0, 0.5)';              // シーンの背景色を設定
            // ゲームオーバー画像を設定

            var gameoverImage = new Sprite(189, 97); // スプライトを作る
            gameoverImage.image = game.assets['./img/gameover.png']; // 画像を設定
            gameoverImage.x = 105.5; // 横位置調整
            gameoverImage.y = 81.5; // 縦位置調整
            scene.addChild(gameoverImage); // シーンに追加


            var retryImage = new Sprite(694, 224); // スプライトを作る
            retryImage.image = game.assets['./img/retry.png']; // 画像を設定
            retryImage.scale(0.1, 0.1);
            retryImage.x = -148; // 横位置調整
            retryImage.y = 85; // 縦位置調整
            scene.addChild(retryImage);



            retryImage.addEventListener(Event.TOUCH_START, function () {
                //                game.removeScene(game.createGameoverScene);
                //                gameoverImage.remove();
                //                retryImage.remove();
                //                array.length = 0;
                //                scoreLabel.remove();
                //                kuma.remove();
                //                logo.remove();
                //                game.start();
                //                game.replaceScene(createGameScene());// 現在表示しているシーンをタイトルシーンに置き換える

//                game.replaceScene(game.rootScene);
                //                game.pushScene(game.rootScene);

                isEnd = false
            });

            return (scene);
        }

        //        var array = [];


        createEnemy = function () {
            var rand = Math.floor(Math.random() * 80);

            var logo = new Sprite(49, 69); // スプライトを作る
            logo.image = game.assets['./img/enemy.gif']; // 画像を設定
            logo.scale(0.7, 0.7);
            logo.x = baseData.WIDTH; // 横位置調整 画面外に隠しておく
            logo.y = GROUND_LINE - logo.height; // 縦位置調整 ハードルの下端を地面の高さと合わせる

            game.rootScene.addChild(logo); // シーンに追加

            //            array.push(logo);

            //        console.log(array);
            logo.addEventListener(Event.ENTER_FRAME, function () {
                if (isEnd) {
                    return;
                }
                if (scroll <= 999) {
                    if (logo.intersect(kuma)) {
                        kumaDead();
                        game.pushScene(createGameoverScene());

                    }

                    logo.x -= SCROLL_SPEED + 10;
                } else if (scroll >= 1000) {
                    if (logo.intersect(kuma)) {
                        kumaDead();
                        game.pushScene(createGameoverScene());
                    }
                    logo.x -= SCROLL_SPEED + 15;
                }

                //                        console.log(logo.x);
                if (logo.x <= -40) {
                    logo.remove();
                }
            });
        };

        createEnemy2 = function () {
            var rand = Math.floor(Math.random() * 80);

            var logo = new Sprite(49, 69); // スプライトを作る
            logo.image = game.assets['./img/enemy.gif']; // 画像を設定
            logo.scale(0.7, 0.7);
            logo.x = baseData.WIDTH; // 横位置調整 画面外に隠しておく
            logo.y = GROUND_LINE - logo.height - 80; // 縦位置調整 ハードルの下端を地面の高さと合わせる

            game.rootScene.addChild(logo); // シーンに追加


            logo.addEventListener(Event.ENTER_FRAME, function () {
                //                        if (scroll % rand === 0) { // 640m走るごとに
                ////                            logo.x = 320; // ハードルを右端に移動(出現)
                //                        }
                if (isEnd) {
                    return;
                }

                
//                1000超えないと出現しないからいらない
//                if (scroll <= 999) {
//                    if (logo.intersect(kuma)) {
//                        kumaDead();
//                        game.pushScene(createGameoverScene());
//                    }
//                    logo.x -= SCROLL_SPEED + 10;
//                } else if (scroll >= 1000) {
                if (scroll >= 1000) {
                    if (logo.intersect(kuma)) {
                        kumaDead();
                        game.pushScene(createGameoverScene());

                    }
                    logo.x -= SCROLL_SPEED + 15;
                }
                //                        console.log(logo.x);
                if (logo.x <= -40) {
                    logo.remove();
                }
            });

        };


        //        // ハードルの設定
        //        var logo = new Sprite(20, 20); // スプライトを作る
        //        logo.image = game.assets['./img/logo.png']; // 画像を設定
        //        logo.x = baseData.WIDTH; // 横位置調整 画面外に隠しておく
        //        logo.y = GROUND_LINE - logo.height; // 縦位置調整 ハードルの下端を地面の高さと合わせる
        //        logo.scale = 0.3;
        //        game.rootScene.addChild(logo); // シーンに追加
        //        
        //        var logo2 = new Sprite(20,20); // スプライトを作る
        //        logo2.image = game.assets['./img/logo.png']; // 画像を設定
        //        logo2.x = baseData.WIDTH + 50; // 横位置調整 画面外に隠しておく
        //        logo2.y = GROUND_LINE - logo2.height - 50; // 縦位置調整 ハードルの下端を地面の高さと合わせる
        ////        logo2.scale = 0.5;
        //        game.rootScene.addChild(logo2); // シーンに追加
        //        createEnemy();
        // 毎フレームイベントをシーンに追加
        game.rootScene.addEventListener(Event.ENTER_FRAME, function () {
            if (isEnd) {
                return;
            }

            //            console.log(logo);
            //            console.log(SCROLL_SPEED);
            var rand = Math.floor(Math.random() * 170) + 7;
            scroll += SCROLL_SPEED; // 走った距離を記録
            scoreLabel.text = scroll.toString() + '点'; // スコア表示を更新

            if (scroll % rand === 0) {
                createEnemy();
            }


            if (scroll >= 1000) {
                if (scroll % 189 === 0) {
                    createEnemy2();
                }
            }



            //            logo.x -= SCROLL_SPEED;
            //            logo2.x -= SCROLL_SPEED;
            //            scoreLabel.text = scroll.toString() + '点'; // スコア表示を更新
            //            // 障害物の出現タイミングの設定
            //            // 数字1 % 数字2 と書くと、数字1を数字2で割った余り（余剰）を得ることができます。
            //            // すなわち、scrollを640で割った余りは、scrollが640, 1280, 1920, … …に達したときに0になります。
            //            if (scroll % 115 === 0) { // 640m走るごとに
            //                logo.x = 320; // ハードルを右端に移動(出現)
            //                logo2.x = 360; // ハードルを右端に移動(出現)
            //            }

            if (kuma.y >= GROUND_LINE - kuma.height * 1.9) {
                state = 0;
            }


            //            // ハードルのスクロールの設定
            //            if (logo.x > -logo.width) { // ハードルが出現している(画面内にある)とき
            //                logo.x += SCROLL_SPEED; // ハードルをスクロール
            //            }

        });


        // シーンにタッチイベントを追加
        var state = 0
        game.rootScene.addEventListener(Event.TOUCH_START, function (e) {
            // くまをジャンプさせる
            if (isEnd) {
                return;
            }
            if (state == 0) {
                kuma.tl.moveBy(0, -93, 5, enchant.Easing.CUBIC_EASEOUT); //A
                //              kuma.tl.next();
                //              kuma.tl.moveBy(0, 45, 8, enchant.Easing.CUBIC_EASEIN); //B
                state = 1
                kuma.tl.moveTo(40, GROUND_LINE - kuma.height * 1.8, 9, enchant.Easing.CUBIC_EASEIN); //B
                //                kuma.tl.exec(function(){a = 0;});
            } else if (state == 1) {
                kuma.tl.next();
                kuma.tl.next();
                kuma.tl.next();
                kuma.tl.next();
                kuma.tl.moveBy(0, -87, 5, enchant.Easing.CUBIC_EASEOUT);
                kuma.tl.moveTo(40, GROUND_LINE - kuma.height * 1.8, 9, enchant.Easing.CUBIC_EASEIN);
                //                kuma.tl.exec(function(){a = 0;});

                state = 2
            } else {}




        });


        //        //シーン作成
        //        var scene = new Scene();                    // 新しいシーンを作る
        //        scene.backgroundColor = '#8cc820';          // シーンの背景色を設定
        //        scene.addChild(kuma);                       // シーンにくまを追加
        //        
        //        //シーン切り替え
        //        game.pushScene(scene);
        //        
        //        //戻す
        //        game.pushScene(game.rootScene);
        //        game.rootScene.addChild(kuma);



    };


    game.start();
}
