<script setup lang="ts">
import { computed, ref } from 'vue';
import ProbsetCard from './components/ProbsetCard.vue';
import ProblemCard from './components/ProblemCard.vue';
import SubmissionCard from './components/SubmissionCard.vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { type Course } from './data';
import GithubMark from './assets/github-mark.svg';

const loggedIn = ref(false);
const loading = ref(false);
const index = ref(0);
const courses = ref<Course[]>([]);
const course = computed(() => courses.value[index.value]);
const account = ref('');
const password = ref('');

async function query() {
  if (!account.value || !password.value) {
    return;
  }
  loading.value = true;
  try {
    const response = await fetch("/gen/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account: account.value, password: password.value }),
    })
    const responseText = await response.text()
    courses.value = JSON.parse(responseText);
    loggedIn.value = true;
    loading.value = false;
  } catch (e) {
    alert(e)
    console.error(e);
  }
  loading.value = false;
}
</script>

<template>
  <div id="login-stuff" v-if="!loggedIn">
    <div section flex-justify-center>
      <span v-if="loading"
        class="absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-xl">你先别急，先让我看...</span>
      <h1 self-center m-0>编程网格 2024 年度总结</h1>
      <input m-t-4 v-model="account" placeholder="账号" w-full p-y-2 p-x-2 max-w-80 mx-auto rounded-lg
        ring="2 offset-2 transparent focus:gray hover:gray" outline-none border="1 solid gray" transition-all
        duration-150 @keypress.enter="query()" />
      <input v-model="password" placeholder="密码" type="password" m-t-1 w-full p-y-2 p-x-2 max-w-80 mx-auto rounded-lg
        ring="2 offset-2 transparent focus:gray hover:gray" outline-none border="1 solid gray" transition-all
        duration-150 @keypress.enter="query()" />
      <button m-t-2 w-full p-y-2 p-x-2 max-w-80 mx-auto rounded-lg ring="2 offset-2 transparent focus:gray"
        transition-all duration-150 border-none @click="query()" :disabled="!account && !password">看看我的！</button>
      <a href="https://github.com/djdjz7/pg-wrapped" target="_blank" m-t-4 self-center decoration-none><img
          :src="GithubMark" alt="Github Repo" w-6></a>
    </div>
  </div>
  <div v-else :key="course.title">
    <div>
      <div section>
        <span>祝贺你！你在</span>
        <span text-3xl font-bold>
          <select v-model="index" font-bold text-3xl>
            <option v-for="(course, i) in courses" :key="course.title" :value="i">{{
              course.title }}</option>
          </select></span>
        <span>成功存活了一个学期！</span>
        <span m-t-6>向下滑动，看看你这一学期的表现吧！</span>
        <ChevronDownIcon class="w-8 h-8 m-t-8 animate-bounce color-gray" />
      </div>
      <div section>
        <span>你知道吗？</span>
        <span>在本课程中，你一共遇到了<span emphasis>{{ course.probsets.statistics.total }} 次</span>或大或小的作业与考试</span>
        <span m-t-6>其中</span>
        <span>你 AK 了<span emphasis>{{ course.probsets.statistics.allClear }} 次</span>，占比<span emphasis>{{
          course.probsets.statistics.allClearRate * 100 }}%</span></span>
        <span>要是这么算的话，你简直就是 AK 超人！</span>
        <ChevronDownIcon class="w-8 h-8 m-t-8 animate-bounce color-gray" />
      </div>
      <div section v-if="course.probsets.wowMoment.acRate != 1">
        <span>说点你可能不爱听的</span>
        <ProbsetCard m-t-2 :probset="course.probsets.wowMoment" />
        <span m-t-4>这是你本课程中 AC 率最低的题集</span>
        <span>之后有好好思考过错题吗？</span>
        <ChevronDownIcon class="w-8 h-8 m-t-8 animate-bounce color-gray" />
      </div>
      <div section>
        <span>让我们来看看你做过的所有问题</span>
        <span m-t-12>本次课程中，你一共遇到了 <span emphasis>{{ course.problems.statistics.total }} 题</span></span>
        <span>其中，你成功解决 <span emphasis>{{ course.problems.statistics.ac }} 题</span></span>
        <span v-if="course.problems.statistics.wa">留下 <span emphasis>{{ course.problems.statistics.wa }} 题</span>仍然
          <span emphasis text-red-500>Wrong Answer</span></span>
        <span v-if="course.problems.statistics.untagged">甚至还有 <span emphasis>{{ course.problems.statistics.untagged }}
            题</span>你从未尝试，也许是他们难入你的法眼。</span>
        <ChevronDownIcon class="w-8 h-8 m-t-8 animate-bounce color-gray" />
      </div>
      <div section>
        <span>有两道题你一定记忆犹新</span>
        <div grid md:grid-cols-2 gap-2>
          <div flex="~ col">
            <ProblemCard :problem="course.problems.wowMoment.mostSubmittedProblem" m-t-2 />
            <span m-t-6>这是你提交次数最多的一道题，想必是遇到了难以发现的 corner case，又或者是被 <span text-blue-500 font-bold text-xl>Time
                Out</span>
              狠狠折磨了。</span>
          </div>
          <div flex="~ col">
            <ProblemCard :problem="course.problems.wowMoment.mostAcceptedProblem" m-t-2 />
            <span m-t-6>这是你 <span text-green-500 font-bold text-xl>AC</span> 次数最多的一道题，反复折磨测评姬让它给你吐出 <span text-green-500
                font-bold text-xl>Accepted</span> 一定让你获得了莫大的快感。 </span>
          </div>
        </div>
        <ChevronDownIcon class="w-8 h-8 m-t-8 animate-bounce color-gray" />
      </div>
      <div section>
        <span>既然说到提交次数，让我们来看看统计数据</span>
        <span>本学期你一共提交了 <span emphasis>{{ course.submissions.statistics.total }} 次</span>代码</span>
        <span>其中</span>
        <ul>
          <li text-2xl font-bold><span text-green-500>Accepted</span><span m-l-4> {{ course.submissions.statistics.ac
              }}
              次</span></li>
          <li text-2xl font-bold><span text-red-500>Wrong Answer</span><span m-l-4> {{
            course.submissions.statistics.wa
              }}
              次</span></li>
          <li text-2xl font-bold><span text-blue-500>Time Out</span><span m-l-4> {{ course.submissions.statistics.tle
              }}
              次</span></li>
          <li text-2xl font-bold><span text-lime-500>Compile Error</span><span m-l-4> {{
            course.submissions.statistics.ce
              }} 次</span></li>
          <li text-2xl font-bold><span text-amber-500>Empty Output</span><span m-l-4> {{
            course.submissions.statistics.eo
              }} 次</span></li>
        </ul>
        <span>AC 率<span line-through>高达</span><span emphasis>{{ (course.submissions.statistics.acRate *
          100).toFixed(2)
            }}%</span></span>
        <span m-t-2>值得注意的是，你还有</span>
        <span text-2xl font-bold><span> {{ course.submissions.statistics.testing }} 次</span> <span text-gray-500
            m-l-2>Testing</span></span>
        <span m-t-2>测试执行通过后因为 <span font-bold><span text-red-500>WA</span> <span text-blue-500>TLE</span> <span
              text-amber-500>EO</span></span> 而大吵大闹的你也很可爱。</span>
        <ChevronDownIcon class="w-8 h-8 m-t-8 animate-bounce color-gray" />
      </div>
      <div section>
        你或许还记得这两次提交
        <div grid md:grid-cols-2 gap-2>
          <div flex="~ col">
            <SubmissionCard :submission="course.submissions.wowMoment.firstSubmission" m-t-2 />
            <span m-t-6>这是你本课程在编程网格上的第一次提交。<br />有为一整个学期开个好头吗？</span>
          </div>
          <div flex="~ col">
            <SubmissionCard :submission="course.submissions.wowMoment.midnightSubmission" m-t-2 />
            <span m-t-6>这天，你奋战到深夜。有解决这个问题了吗？</span>
          </div>
        </div>
        <ChevronDownIcon class="w-8 h-8 m-t-8 animate-bounce color-gray" />
      </div>
      <div section v-if="Object.entries(course.language.statistics).length > 1">
        <span>你的年度语言当之无愧</span>
        <span m-t-2 text-6xl font-bold>{{ Object.entries(course.language.statistics)[0][0] }}</span>
        <span>你用这门语言提交了 <span emphasis>{{ Object.entries(course.language.statistics)[0][1] }} 次</span></span>
        <span>你还使用</span>
        <ul>
          <li v-for="language in Object.entries(course.language.statistics).slice(1)" :key="language[0]">
            <span emphasis m-l-0>{{ language[0] }}</span>提交了 {{ language[1] }} 次
          </li>
        </ul>
        <span m-t-4>等下，这不是课程要求吧？</span>
        <ChevronDownIcon class="w-8 h-8 m-t-8 animate-bounce color-gray" />
      </div>
      <div section flex-items-center flex-justify-center text-center>
        <span emphasis>本学期的代码就写到这里吧</span>
        <span>下个学期也要继续努力哦</span>
        <a href="https://github.com/djdjz7/pg-wrapped" target="_blank" m-t-8 text-sm color-unset
          flex="~ items-center"><img :src="GithubMark" alt="Github Repo" w-6 m-r-2>Star this on Github.</a>
      </div>
    </div>
  </div>
</template>
