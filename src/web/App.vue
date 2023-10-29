<script setup lang="ts">

import templatesUnderlying from 'src/languages/levantine/rule-packs/north-levantine/templates/underlying';
import underlyingUnderlying from 'src/languages/levantine/rule-packs/north-levantine/underlying/underlying';
import underlyingPhonic from 'src/languages/levantine/rule-packs/north-levantine/underlying/phonic';
import phonicPhonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

import * as selfProfile from 'src/languages/levantine/profiles/self';
import * as rassiProfile from 'src/languages/levantine/profiles/salam-el-rassi';


console.log(`hello`);

(window as any).abc = {
  templatesUnderlying,
  underlyingUnderlying,
  underlyingPhonic,
  phonicPhonic,
};

(window as any).profile = {
  self: selfProfile,
  rassi: rassiProfile,
};


</script>

<style scoped>
.err {
  color: red;
}
</style>
