// below is an unofficial ClassNamePlugin for GSAP 3. You can copy/paste it into your project. Then, just add className: to your tweens. Relative values should work fine too (add and remove classes). Typically we recommend just explicitly animating specific properties to get better performance, but some people really appreciate having a plugin like this, especially for legacy projects. Enjoy! 

// ClassNamePlugin START (requires GSAP 3.2.2 or later)
gsap.registerPlugin({
	name: 'className',
	init: true,
	register(gsap, Plugin) {
		var CSSPlugin = gsap.plugins.css,
			cssCore = CSSPlugin.core || console.warn('Requires GSAP 3.2.1 or later') || {},
			_removeLinkedListItem = gsap.core._removeLinkedListItem,
			_removeProperty = cssCore._removeProperty,
			PropTween = gsap.core.PropTween,
			_getAllStyles = function(target, uncache) {
				var styles = {},
					computed = getComputedStyle(target),
					cache = target._gsap,
					p;
				for (p in computed) {
					if (isNaN(p) && p !== 'cssText' && p !== 'length') {
						styles[p] = computed[p];
					}
				}
				uncache && cache && (cache.uncache = true);
				gsap.getProperty(target, 'x'); 
				cache = target._gsap;
				for (p in cache) {
					styles[p] = cache[p];
				}
				return styles;
			};
		Plugin.prototype.init = function(target, endValue, tween) {
			let startClassList = target.getAttribute('class'),
				style = target.style,
				cssText = style.cssText,
				cache = target._gsap,
				classPT = cache.classPT,
				inlineToRemoveAtEnd = {},
				end = (endValue.charAt(1) !== '=') ? endValue : startClassList.replace(new RegExp('(?:\\s|^)' + endValue.substr(2) + '(?![\\w-])'), '') + ((endValue.charAt(0) === '+') ? ' ' + endValue.substr(2) : ''),
				plugin = this,
				changingVars = {},
				startVars = _getAllStyles(target),
				transformRelated = /(transform|perspective)/i,
				css = new CSSPlugin(),
				_renderClassName = function(ratio) {
					css.render(ratio, css);
					if (!ratio || ratio === 1) {
						target.setAttribute('class', ratio ? end : startClassList);
						for (var p in inlineToRemoveAtEnd) {
							_removeProperty(target, p);
						}
					}
				},
				endVars, p;
			if (classPT) {
				classPT.r(1, classPT.d);
				_removeLinkedListItem(classPT.d, classPT, '_pt');
			}
			target.setAttribute('class', end);
			endVars = _getAllStyles(target, true);
			target.setAttribute('class', startClassList);
			for (p in endVars) {
				if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
					changingVars[p] = endVars[p];
					if (!style[p] && style[p] !== '0') {
						inlineToRemoveAtEnd[p] = 1;
					}
				}
			}
			cache.classPT = plugin._pt = new PropTween(null, target, 'className', 0, 0, _renderClassName, plugin, 0, -11);
			if (style.cssText !== cssText) {
				style.cssText = cssText; 
			}
			cache.uncache = true;
			gsap.getProperty(target, 'x'); 
			css.init(target, changingVars, tween);
			plugin._props.push.apply(plugin._props, css._props);
			return 1;
		};
	}
});
