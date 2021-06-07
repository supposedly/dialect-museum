<template>
  <h1>
    Just kidding, still under constructɩon :)
  </h1>
    <p>
      To make up for it a bit, here's a quick run-through of a
      paragraph from that Romeo &amp; Juliet translation that
      Kamal Sharabi did with Said Akl:
    </p>
    <h2>English</h2>
      <h3>Original</h3>
        <p>
          [O, speak again, bright angel, for thou art]<br/>
          [As glorious to this night, being o'er my head,]<br/>
          As is a winged messenger of heaven<br/>
          Unto the white upturned wondering eyes<br/>
          Of mortals that fall back to gaze on him<br/>
          When he bestrides the lazy puffing clouds<br/>
          And sails upon the bosom of the air.
        </p>
      <h3>Back-translation from Lebanese</h3>
        <p>
          [first two lines of the translation are unavailable]<br/>
          More than a winged messenger descending from Heaven could give [the night]<br/>
          And the mortal folk, their eyes whitened of shock, begin<br/>
          To jostle each other around to see him,<br/>
          As he bestrides the lazy clouds,<br/>
          As he glides along the wind's bosom.
        </p>
    <h2>Lebanese</h2>
      <h3>IPA</h3>
        <h4>Akl's speech</h4>
          <p>
            /ˈʔaktar ma ˈbjiʔdir jaʕˈtʶiː mirˈseːl ˈmʒannaħ ˈneːzil mn s-ˈsama/
              [ˈbjɪʔdir, neːzil]<br/>
            /biˈsʶiːru n-neːs l-feːnˈjiːn w ˈʕjuːnun mibjadʶˈdʶiːn mn d-ˈdahʃi/
              [ˈʕjuːnun]<br/>
            /j-ˈʃaʔlbu ˈbaʕdʶun ta j-ʃuˈfuː/<br/>
            /w hu ʕam jitˈχatʶtʶa l-ʁjuːm l-kisˈleːni/<br/>
            /w hu ʕam jitˈzaħlaʔ ʕa sʶidr l-ˈhawa/<br/>
          </p>
        <h4>My speech</h4>
          <p>
            /ˈʔaktar ma ˈbjiʔdir jaʕˈtʶiː mirˈseːl ˈmʒannaħ ˈneːzil mn s-ˈsama/
              [ˈbjɪʔdɪr, neːzɪl]<br/>
            /bɪˈsʶiːro n-neːs l-feːnˈjiːn w ˈʕjuːnun mibjadʶˈdʶiːn mn d-ˈdahʃe/
              [ˈʕjuːnʊn]<br/>
            /j-ˈʃaʔəlbo ˈbaʕdʶun ta j-ʃuːˈfuː/<br/>
            /w ˈhuwwe ʕam jitˈχatʶtʶa l-ʁjuːm l-kasˈleːne/<br/>
            /w ˈhuwwe ʕam jitˈzaħlaʔ ʕa sʶud(ə)r l-ˈhawa/ [sʶʊd(ʊ)r]<br/>
          </p>
      <h3>Serious orthographies</h3>
        <h4>Akl's Latin-script design
        (approximated bc he had typewriters that could make symbols not found in Unicode)</h4>
          <p>
            Ȼaqtar ma byeȼdir y<span class="a-emph">a</span>ɏtii
              mersaal mjannax naazil mne ssama<br/>
            Bi<span class="s-emph">s</span>iiru n naas el faanyiin, we ɏyuunun
              mebya<span class="d-emph">d</span><span class="d-emph">d</span>iin mne d dahci,<br/>
            Ycaȼlbu baɏ<span class="d-emph">d</span>un ta ycufuu,<br/>
            W hu ɏam yetkatt<span class="a-emph">a</span> l gyuum el qeslaani,<br/>
            W hu ɏam yetzaxlaȼ ɏa <span class="s-emph">s</span>edr el hawa.<br/>
          </p>
        <h4>Arabic script</h4>
          <p dir="rtl" style="text-align: left;">
            أكتر ما بيقدر يعطيه مرسال مجنح نازل من السما،<br/>
            بيصيروا الناس الفانيين، وعيونن مبيضين من الدهشة،<br/>
            يشقلبوا بعضن تيشوفوه،<br/>
            وهو عم يتخطى الغيوم الكسلانة،<br/>
            وهو عم يتزحلق ع صدر الهوا.<br/>
          </p>
      <h3>The informal Latin-script orthography we use online</h3>
        <h4>Akl's speech</h4>
          <p>
            2aktar ma bye2dir ya3ti mersel mjanna7 nezil mnel sama,<br/>
            bisirou l nes l fenyin, w 3younoun mebyaddin mnel dahshi,<br/>
            ysha2lbou ba3doun ta yshoufou<br/>
            w hu 3am yet5atta l ghyoum l kesleni,<br/>
            w hu 3am yetza7la2 3a sedr l hawa.<br/>
          </p>
        <h4>My speech</h4>
          <p>
            2aktar ma bye2der ya3ti mersel mjanna7 nezel mnel sama,<br/>
            bisiro l nes l fenyin, w 3younon mebyaddin mnel dahshe,<br/>
            ysha2elbo ba3don ta yshoufou<br/>
            w huwwe 3am yet5atta l ghyoum l kaslene,<br/>
            w huwwe 3am yetza7la2 3a sod(o)r l hawa.<br/>
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
