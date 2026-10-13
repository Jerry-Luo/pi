/* Pi 源码课 — 可选小测验组件（teach 工作区共享组件）
   用法（lesson 内）：
     <div class="quiz" data-quiz data-explain="…答题后的讲解…">
       <span class="quiz-tag">可选练习</span>
       <p class="quiz-q">问题文本</p>
       <div class="quiz-opts">
         <button class="quiz-opt" data-correct="true">选项甲</button>
         <button class="quiz-opt">选项乙</button>
         …
       </div>
       <p class="quiz-feedback"></p>
       <button class="quiz-reset">重做一遍</button>
     </div>
   行为：点击选项立即反馈（正确高亮、所选错误标红），显示讲解；可重置。
   约定：同一题的各选项长度保持一致，避免通过长度猜测答案。 */

(function () {
	"use strict";

	document.querySelectorAll("[data-quiz]").forEach(function (quiz) {
		var options = Array.prototype.slice.call(quiz.querySelectorAll(".quiz-opt"));
		var feedback = quiz.querySelector(".quiz-feedback");
		var explain = quiz.getAttribute("data-explain") || "";
		var reset = quiz.querySelector(".quiz-reset");
		if (!options.length || !feedback) return;

		function grade(button) {
			quiz.classList.add("answered");
			options.forEach(function (opt) {
				opt.disabled = true;
				if (opt.getAttribute("data-correct") === "true") opt.classList.add("correct");
			});
			var right = button.getAttribute("data-correct") === "true";
			if (!right) button.classList.add("wrong");
			feedback.textContent = (right ? "✓ 正确。" : "✗ 不对。") + explain;
		}

		options.forEach(function (opt) {
			opt.addEventListener("click", function () {
				if (!quiz.classList.contains("answered")) grade(opt);
			});
		});

		if (reset) {
			reset.addEventListener("click", function () {
				quiz.classList.remove("answered");
				feedback.textContent = "";
				options.forEach(function (opt) {
					opt.disabled = false;
					opt.classList.remove("correct", "wrong");
				});
			});
		}
	});
})();
