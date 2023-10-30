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

function flattenProfile(profile: object): ReadonlyArray<Record<`for` | `into` | `source` | `odds`, object>> {
  return _flattenProfile(profile).flat(Infinity) as never;
}

function processDefaults(defaults: object, array: Array<object> = []): ReadonlyArray<Record<`for` | `into` | `source` | `odds`, object>> {
  if (defaults instanceof Function) {
    array.push(defaults());
  } else {
    Object.values(defaults).forEach(sources => processDefaults(sources, array));
  }
  return array as never;
}

function mapToSource(profile: object, defaults: object) {
  const map = new Map<object, Array<{rule: object, after: object | null}>>();
  let lastRule: object | null = null;
  flattenProfile(profile).forEach(rule => {
    if (!map.has(rule.source)) {
      map.set(rule.source, [{rule, after: null}]);
    } else {
      map.get(rule.source)!.push({
        rule,
        after: lastRule,
      });
    }
    lastRule = rule;
  });
  lastRule = null;
  console.log(defaults, processDefaults(defaults));
  processDefaults(defaults).forEach(rule => {
    if (!map.has(rule.source)) {
      map.set(rule.source, [{rule, after: null}]);
    } else {
      map.get(rule.source)!.push({
        rule,
        after: lastRule,
      });
    }
    lastRule = rule;
  });
  return map;
}

function orderRules(
  sources: object,
  sourceMap: ReturnType<typeof mapToSource>,
  array: Array<object> = [],
  delayQueue: Map<object, Array<object>> = new Map()
) {
  if (sources instanceof Function && `source` in sources) {
    const rules = sourceMap.get(sources.source as object);
    if (rules === undefined) {
      array.push({UHOH: sources.source});
    } else {
      rules.forEach(rule => {
        if (rule.after === null) {
          array.push(rule.rule);
        } else {
          if (delayQueue.has(rule.after)) {
            delayQueue.get(rule.after)!.push(rule.rule);
          } else {
            delayQueue.set(rule.after, [rule.rule]);
          }
        }
        if (delayQueue.has(rule.rule)) {
          array.push(...delayQueue.get(rule.rule)!);
        }
      });
    }
  } else {
    Object.entries(sources).filter(([k]) => k !== `defaults`).forEach(([_, r]) => orderRules(r, sourceMap, array));
  }
  return array;
}

// Object.values(selfProfile).map(v => v.map(x => x));

// console.log(flattenProfile(selfProfile));

console.log(orderRules(rulePacks.templates.rulePacks.underlying, mapToSource(selfProfile, rulePacks.templates.rulePacks.underlying.defaults)));

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
