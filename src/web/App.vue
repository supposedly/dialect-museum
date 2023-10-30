<script setup lang="ts">

import rulePacks from 'src/languages/levantine/rule-packs/north-levantine/';

import * as selfProfile from 'src/languages/levantine/profiles/self';
import * as rassiProfile from 'src/languages/levantine/profiles/salam-el-rassi';

Object.values(rulePacks).forEach(v => Object.values(v.rulePacks).forEach(v => console.log((v))));

function _flattenProfile(profile: object): ReadonlyArray<object> {
  if (Array.isArray(profile)) {
    return profile;
  }
  return Object.values(profile).map(_flattenProfile);
}

function flattenProfile(profile: object): ReadonlyArray<object> {
  return _flattenProfile(profile).flat(Infinity);
}

function mapToSource(profile: object) {
  const map = new Map<string, object>();

}

function orderRules(rulepack) {

}

// Object.values(selfProfile).map(v => v.map(x => x));

console.log(flattenProfile(selfProfile));

(window as any).abc = rulePacks;

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
