'use strict';
//fsモジュールを変数"fs"に読み込む
const fs = require('fs');
//readlineモジュールを変数"readline"に読み込む
const readline = require('readline');
//rs変数を作り, fsモジュールの"createReadStream"メソッドを使ってテキストファイルをストリーム形式で読み込む
const rs = fs.createReadStream('./popu-pref.csv');
// rl変数を作り、readlineモジュールの「createInterface」メソッドに先ほど作ったストリーム情報を渡す
const rl = readline.createInterface({'input': rs, 'output': {} });
//引数「都道府県」, 中身「集計データ」の連想配列
const prefectureDataMap = new Map();
// rl変数のonメソッドで1行ずつconsole.logを実行し行末まで繰り返す
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if(year === 2010 || year === 2015){
        //prefectureDataMapのデータ参照. 
        //prefectureの中身が初出だとvalueの値はundefinedになり, 
        //let下のif文が発動する.
        let value = prefectureDataMap.get(prefecture);
        if(!value){
            value = {
                popu10: 0, 
                popu15: 0, 
                change: null
            };
        }
        if(year === 2010){
            value.popu10 = popu;
        }
        if(year === 2015){
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for(let[key, value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率：' + value.change;
    });
    console.log(rankingStrings);
});