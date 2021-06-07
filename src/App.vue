<template>
  <h1>
    Just kidding, still under constructɩon :)
  </h1>

  <p>
    To make up for it a bit, here's a quick run-through of a
    paragraph from that Romeo &amp; Juliet translation Akl did:
  </p>
  <h2>English (original)</h2>
  <p>
    [O, speak again, bright angel, for thou art]<br/>
    [As glorious to this night, being o'er my head,]<br/>
    As is a winged messenger of heaven<br/>
    Unto the white upturned wondering eyes<br/>
    Of mortals that fall back to gaze on him<br/>
    When he bestrides the lazy puffing clouds<br/>
    And sails upon the bosom of the air.
  </p>
  <h2>English (back-translated)</h2>
  <p>
    [...]<br/>
    [...]<br/>
    As much as a winged messenger descending from Heaven could give him
    And the mortal folk, their eyes whitened of shock, begin
    To turn each other about for to see him,
    As he bestrides the lazy clouds,
    As he glides along the bosom of the air.
  </p>
  <h2>Serious orthographies</h2>
    <h3>Akl's Latin-script design
    (approximated bc he had typewriters that could make symbols not found in Unicode)</h3>
      <p>
        [...]<br/>
        [...]<br/>
        ₵aqtar ma bye¢dir y<span class="a-emph">a</span>ɏtii mersaal mjannax naazil mne s sama<br/>
        Bi<span class="s-emph">s</span>iiru n naas el faanyiin,
        we ɏyuunun
          mebya<span class="d-emph">d</span><span class="d-emph">d</span>iin mne d dahci,<br/>
        Yca¢lbu baɏ<span class="d-emph">d</span>un ta ycufuu,<br/>
        W hu ɏam yetkatt<span class="a-emph">a</span> l gyuum el qeslaani,<br/>
        W hu ɏam yetzaxla¢ ɏa <span class="s-emph">s</span>edr el hawa.<br/>
      </p>
    <h3>Arabic script</h3>
      <p>
        [...]<br/>
        [...]<br/>
        أكتر ما بيقدر يعطيه مرسال مجنح نازل من السما،<br/>
        بيصيروا الناس الفانيين، وعيونن مبيضين من الدهشة،<br/>
        يشقلبوا بعضن تيشوفوه،<br/>
        وهو عم يتخطى الغيوم الكسلانة،<br/>
        وهو عم يتزحلق ع صدر الهوا.<br/>
      </p>
  <h2>The informal Latin-script orthography we use online</h2>
    <h3>Akl's dialect</h3>
      <p>
        [...]<br/>
        [...]<br/>
        2aktar ma bye2dir ya3ti mersel mjanna7 nezil mnel sama,<br/>
        bisirou l nes l fenyin, w 3younoun mebyaddin mnel dahshi,<br/>
        ysha2lbou ba3doun ta yshoufou<br/>
        w hu 3am yet5atta l ghyoum l kesleni,<br/>
        w hu 3am yetza7la2 3a sedr l hawa.<br/>
      </p>
    <h3>My dialect</h3>
        [...]<br/>
        [...]<br/>
        2aktar ma bye2der ya3ti mersel mjanna7 nezel mnel sama,<br/>
        bisiro l nes l fenyin, w 3younon mebyaddin mnel dahshe,<br/>
        ysha2elbo ba3don ta yshoufou<br/>
        w huwwe 3am yet5atta l ghyoum l kaslene,<br/>
        w huwwe 3am yetza7la2 3a sod(o)r l hawa.<br/>
  <h2>IPA</h2>
    <h3>Akl's dialect</h3>
      <p>
        [...]<br/>
        [...]<br/>
        /ˈʔaktar ma ˈbjiʔdir jaʕˈtʶiː mirˈseːl ˈmʒannaħ ˈneːzil mn s-ˈsama/ [ˈbjɪʔdir, neːzil]<br/>
        /biˈsʶiːru n-neːs l-feːnˈjiːn w ʕjuːˈnun mibjadʶˈdʶiːn mn d-ˈdahʃi/<br/>
        /j-ˈʃaʔlbu ˈbaʕdʶun ta j-ʃuˈfuː/<br/>
        /w hu ʕam jitχatʶtʶa l-ʁjuːm l-kisleːni/<br/>
        /w hu ʕam jitzaħlaʔ ʕa sʶidr l-hawa/<br/>
      </p>
    <h3>My dialect</h3>
      <p>
        [...]<br/>
        [...]<br/>
        /ˈʔaktar ma ˈbjiʔdir jaʕˈtʶiː mirˈseːl ˈmʒannaħ ˈneːzil mn s-ˈsama/ [ˈbjɪʔdɪr, neːzɪl]<br/>
        /bɪˈsʶiːro n-neːs l-feːnˈjiːn w ʕjuːˈnun mibjadʶˈdʶiːn mn d-ˈdahʃe/<br/>
        /j-ˈʃaʔəlbo ˈbaʕdʶun ta j-ʃuːˈfuː/<br/>
        /w huwwe ʕam jitχatʶtʶa l-ʁjuːm l-kasleːne/<br/>
        /w huwwe ʕam jitzaħlaʔ ʕa sʶud(ə)r l-hawa/ [sʶʊd(ʊ)r]<br/>
      </p>
</template>

<script>
export default {
  name: `App`,
};
</script>

<style scoped lang="scss">
// Dunno if putting this here makes the page flicker-prone or anything
@font-face {
  font-family: 'Inter';
  src: url('./assets/fonts/Inter.var.woff2') format('woff2'),
       url('./assets/fonts/Inter.var.ttf') format('truetype');
}

h1 {
  text-align: center;
  color: #2c3e50;
  font-size: 4vw;
  font-weight: 100;
  font-variation-settings: 'wght' 250;
  // text-transform: uppercase;
}
</style>

<style> /* 360 no scope */
#app {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}

.d-emph:before {
  content: "";
  position: absolute;
  margin-top: .4em;
  margin-left: .3em;
  background-color: white;
  height: .3em;
  width: .16em;
}

.s-emph:before {
  content: "";
  position: absolute;
  margin-top: .3em;
  margin-left: .2em;
  background-color: white;
  height: .3em;
  width: .3em;
}

.a-emph:before {
  content: "";
  position: absolute;
  margin-top: .5em;
  margin-left: .19em;
  background-color: white;
  height: .3em;
  width: .22em;
}
</style>
