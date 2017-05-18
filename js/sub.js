//全体の初期化
enchant();

var baseData = {
    WIDTH: 400,
    HEIGHT: 260
};

window.onload = function () {
    //    全体のサイズ
    var game = new Game(baseData.WIDTH, baseData.HEIGHT);
    // frames（フレーム）per（毎）second（秒）：ゲームの進行スピード
    game.fps = 15;
    game.preload('./img/start.png', './img/gameover.png', './img/retry.png', './img/chara1.png', './img/enemy.gif', './img/back.png');

    game.onload = function () {
        var startImage = new Sprite(236, 48);
        startImage.image = game.assets['./img/start.png'];
        startImage.x = 80;
        startImage.y = 100;

        //        地平線の高さ
        var GROUND_LINE = 250;

        var scoreLabel = new Label("");
        scoreLabel.color = '#004D74';
        scoreLabel.font = "bold 25px  'ＭＳ ゴシック'";

        var kuma = new Sprite(32, 32);
        kuma.image = game.assets['./img/chara1.png'];
        kuma.scale(2.5, 2.5);
        kuma.x = 40; // 画面やや左側に配置
        kuma.y = GROUND_LINE - kuma.height * 1.8;

        var kumaDash = new Sprite(32, 32);
        kumaDash.image = game.assets['./img/chara1.png'];
        kumaDash.scale(2.5, 2.5);
        kumaDash.x = 40; // 画面やや左側に配置
        kumaDash.y = GROUND_LINE - kuma.height * 1.8;

        var kumaAnime = [0, 1, 0, 2];
        var count = 0;
        kumaDash.addEventListener(Event.ENTER_FRAME, function () {
            if (isEnd) {
                return;
            }

            kumaDash.frame = kumaAnime[count];
            count++;
            if (count > 3) {
                count = 0;
            }
        });

        var isEnd = false;
        var kumaDead = function () {
            //            泣きくま
            kumaDash.frame = 3;
            mainScene.addChild(kumaDash);
            isEnd = true;
        }

        //        game.rootScene.backgroundColor = "#7ecef4";
        var back = new Sprite(400, 260);
        back.image = game.assets['./img/back.png'];
        back.x = 0;
        back.y = 0;

        game.rootScene.addChild(back);
        game.rootScene.addChild(kuma);
        game.rootScene.addChild(startImage);


        var createMainScene = function (scroll) {
            var mainScene = new Scene();
            mainScene.backgroundColor = '#fff';
            var scroll = 0;
            var SCROLL_SPEED = 3;

            var isEnd = false;
            var kumaDead = function () {
                //            泣きくま
                kumaDash.frame = 3;
                mainScene.addChild(kumaDash);
                isEnd = true;
            }

            createEnemy = function () {
                var rand = Math.floor(Math.random() * 80);

                var enemy = new Sprite(49, 69);
                enemy.image = game.assets['./img/enemy.gif'];
                enemy.scale(0.7, 0.7);
                // 横位置調整 画面外に隠しておく
                enemy.x = baseData.WIDTH;
                // 縦位置調整 ハードルの下端を地面の高さと合わせる
                enemy.y = GROUND_LINE - enemy.height;

                mainScene.addChild(enemy); // シーンに追加

                enemy.addEventListener(Event.ENTER_FRAME, function () {
                    if (isEnd) {
                        return;
                    }
                    if (scroll <= 999) {
                        if (enemy.intersect(kumaDash)) {
                            kumaDead();
                            game.pushScene(createGameoverScene());

                        }

                        enemy.x -= SCROLL_SPEED + 10;
                    } else if (scroll >= 1000) {
                        if (enemy.intersect(kumaDash)) {
                            kumaDead();
                            game.pushScene(createGameoverScene());
                        }
                        enemy.x -= SCROLL_SPEED + 15;
                    }

                    if (enemy.x <= -40) {
                        enemy.remove();
                    }
                });
            };

            createEnemy2 = function () {
                var rand = Math.floor(Math.random() * 80);

                var enemy = new Sprite(49, 69); // スプライトを作る
                enemy.image = game.assets['./img/enemy.gif']; // 画像を設定
                enemy.scale(0.7, 0.7);
                enemy.x = baseData.WIDTH; // 横位置調整 画面外に隠しておく
                enemy.y = GROUND_LINE - enemy.height - 80; // 縦位置調整 ハードルの下端を地面の高さと合わせる

                mainScene.addChild(enemy); // シーンに追加


                enemy.addEventListener(Event.ENTER_FRAME, function () {
                    if (isEnd) {
                        return;
                    }

                    if (scroll >= 1000) {
                        if (enemy.intersect(kumaDash)) {
                            kumaDead();
                            game.pushScene(createGameoverScene());

                        }
                        enemy.x -= SCROLL_SPEED + 15;
                    }

                    if (enemy.x <= -40) {
                        enemy.remove();
                    }
                });

            };


            mainScene.addChild(back);
            mainScene.addChild(kumaDash);
            mainScene.addChild(scoreLabel);

            mainScene.addEventListener(Event.ENTER_FRAME, function () {
                if (isEnd) {
                    return;
                }

                var rand = Math.floor(Math.random() * 170) + 7;
                scroll += SCROLL_SPEED;
                scoreLabel.text = scroll.toString() + '点';

                if (scroll % rand === 0) {
                    createEnemy();
                }

                if (scroll >= 1000) {
                    if (scroll % 189 === 0) {
                        createEnemy2();
                    }
                }

                if (kumaDash.y >= GROUND_LINE - kumaDash.height * 1.9) {
                    state = 0;
                }

            });

            var state = 0
            mainScene.addEventListener(Event.TOUCH_START, function (e) {

                if (isEnd) {
                    return;
                }
                if (state == 0) {
                    kumaDash.tl.moveBy(0, -93, 5, enchant.Easing.CUBIC_EASEOUT);
                    state = 1
                    kumaDash.tl.moveTo(40, GROUND_LINE - kumaDash.height * 1.8, 9, enchant.Easing.CUBIC_EASEIN);
                } else if (state == 1) {
                    kumaDash.tl.next();
                    kumaDash.tl.next();
                    kumaDash.tl.next();
                    kumaDash.tl.next();
                    kumaDash.tl.moveBy(0, -87, 5, enchant.Easing.CUBIC_EASEOUT);
                    kumaDash.tl.moveTo(40, GROUND_LINE - kumaDash.height * 1.8, 9, enchant.Easing.CUBIC_EASEIN);
                    state = 2
                } else {}
            });
            return (mainScene);
        };

        var createGameoverScene = function (scroll) {
            var scene = new Scene(); // 新しいシーンを作る

            var gameoverImage = new Sprite(189, 97); // スプライトを作る
            gameoverImage.image = game.assets['./img/gameover.png'];
            gameoverImage.x = 105.5;
            gameoverImage.y = 81.5;
            scene.addChild(gameoverImage);


            var retryImage = new Sprite(694, 224);
            retryImage.image = game.assets['./img/retry.png'];
            retryImage.scale(0.1, 0.1);
            retryImage.x = -148;
            retryImage.y = 85;
            scene.addChild(retryImage);



            retryImage.addEventListener(Event.TOUCH_START, function () {
                isEnd = false
                game.replaceScene(createMainScene());
            });
            return (scene);
        }



        // ルートシーンをタッチした時の処理
        game.rootScene.addEventListener(Event.TOUCH_START, function (e) {
            game.replaceScene(createMainScene());
        });
    };

    game.start();
}
