
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\pages\PageContainer.svelte generated by Svelte v3.46.4 */

    const file$p = "src\\pages\\PageContainer.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:16) {#each topics as topic}
    function create_each_block_1$2(ctx) {
    	let button;
    	let t_value = /*topic*/ ctx[4].title + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*topic*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "svelte-xn9tez");
    			add_location(button, file$p, 13, 20, 304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*topics*/ 2 && t_value !== (t_value = /*topic*/ ctx[4].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(13:16) {#each topics as topic}",
    		ctx
    	});

    	return block;
    }

    // (19:16) {#if (showTopic === topic.title)}
    function create_if_block$4(ctx) {
    	let div;
    	let h3;
    	let t0;
    	let t1_value = /*topic*/ ctx[4].title + "";
    	let t1;
    	let t2;
    	let switch_instance;
    	let t3;
    	let a;
    	let t4;
    	let a_href_value;
    	let t5;
    	let current;
    	var switch_value = /*topic*/ ctx[4].component;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text("Topic: ");
    			t1 = text(t1_value);
    			t2 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t3 = space();
    			a = element("a");
    			t4 = text("source");
    			t5 = space();
    			add_location(h3, file$p, 20, 24, 577);
    			attr_dev(a, "class", "source svelte-xn9tez");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", a_href_value = /*topic*/ ctx[4].src);
    			add_location(a, file$p, 22, 24, 700);
    			attr_dev(div, "class", "topic svelte-xn9tez");
    			add_location(div, file$p, 19, 20, 532);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(div, t2);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			append_dev(div, t3);
    			append_dev(div, a);
    			append_dev(a, t4);
    			append_dev(div, t5);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*topics*/ 2) && t1_value !== (t1_value = /*topic*/ ctx[4].title + "")) set_data_dev(t1, t1_value);

    			if (switch_value !== (switch_value = /*topic*/ ctx[4].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, t3);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty & /*topics*/ 2 && a_href_value !== (a_href_value = /*topic*/ ctx[4].src)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(19:16) {#if (showTopic === topic.title)}",
    		ctx
    	});

    	return block;
    }

    // (18:12) {#each topics as topic}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*showTopic*/ ctx[2] === /*topic*/ ctx[4].title && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*showTopic*/ ctx[2] === /*topic*/ ctx[4].title) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showTopic, topics*/ 6) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(18:12) {#each topics as topic}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let div3;
    	let div2;
    	let h1;
    	let t0;
    	let t1;
    	let div1;
    	let div0;
    	let t2;
    	let current;
    	let each_value_1 = /*topics*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*topics*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$p, 9, 8, 166);
    			attr_dev(div0, "id", "buttons");
    			attr_dev(div0, "class", "svelte-xn9tez");
    			add_location(div0, file$p, 11, 12, 223);
    			attr_dev(div1, "id", "topics");
    			attr_dev(div1, "class", "svelte-xn9tez");
    			add_location(div1, file$p, 10, 8, 192);
    			attr_dev(div2, "id", "page");
    			attr_dev(div2, "class", "svelte-xn9tez");
    			add_location(div2, file$p, 8, 4, 141);
    			attr_dev(div3, "id", "container");
    			attr_dev(div3, "class", "svelte-xn9tez");
    			add_location(div3, file$p, 7, 0, 115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, h1);
    			append_dev(h1, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div1, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (dirty & /*showTopic, topics*/ 6) {
    				each_value_1 = /*topics*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*topics, showTopic*/ 6) {
    				each_value = /*topics*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PageContainer', slots, []);
    	let { title } = $$props;
    	let { topics = [] } = $$props;
    	let showTopic = topics[0].title;
    	const writable_props = ['title', 'topics'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PageContainer> was created with unknown prop '${key}'`);
    	});

    	const click_handler = topic => $$invalidate(2, showTopic = topic.title);

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('topics' in $$props) $$invalidate(1, topics = $$props.topics);
    	};

    	$$self.$capture_state = () => ({ title, topics, showTopic });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('topics' in $$props) $$invalidate(1, topics = $$props.topics);
    		if ('showTopic' in $$props) $$invalidate(2, showTopic = $$props.showTopic);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, topics, showTopic, click_handler];
    }

    class PageContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { title: 0, topics: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PageContainer",
    			options,
    			id: create_fragment$t.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<PageContainer> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<PageContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<PageContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get topics() {
    		throw new Error("<PageContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topics(value) {
    		throw new Error("<PageContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file$o = "src\\App.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (16:1) {#each categories as cat}
    function create_each_block_1$1(ctx) {
    	let button;
    	let t_value = /*cat*/ ctx[5] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*cat*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "svelte-pb77de");
    			add_location(button, file$o, 16, 2, 324);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(16:1) {#each categories as cat}",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#if showPage === cat}
    function create_if_block$3(ctx) {
    	let pagecontainer;
    	let current;

    	pagecontainer = new PageContainer({
    			props: {
    				title: /*pages*/ ctx[1][/*cat*/ ctx[5]].title,
    				topics: /*pages*/ ctx[1][/*cat*/ ctx[5]].topics
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pagecontainer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pagecontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pagecontainer_changes = {};
    			if (dirty & /*pages*/ 2) pagecontainer_changes.title = /*pages*/ ctx[1][/*cat*/ ctx[5]].title;
    			if (dirty & /*pages*/ 2) pagecontainer_changes.topics = /*pages*/ ctx[1][/*cat*/ ctx[5]].topics;
    			pagecontainer.$set(pagecontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagecontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagecontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pagecontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(22:2) {#if showPage === cat}",
    		ctx
    	});

    	return block;
    }

    // (21:1) {#each categories as cat}
    function create_each_block$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*showPage*/ ctx[2] === /*cat*/ ctx[5] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*showPage*/ ctx[2] === /*cat*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showPage*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(21:1) {#each categories as cat}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let main;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let current;
    	let each_value_1 = /*categories*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*categories*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text("Svelte self-study - Part ");
    			t1 = text(/*part*/ ctx[0]);
    			t2 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-pb77de");
    			add_location(h1, file$o, 12, 1, 235);
    			attr_dev(main, "class", "svelte-pb77de");
    			add_location(main, file$o, 11, 0, 227);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(main, t2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(main, null);
    			}

    			append_dev(main, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*part*/ 1) set_data_dev(t1, /*part*/ ctx[0]);

    			if (dirty & /*showPage, categories*/ 12) {
    				each_value_1 = /*categories*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(main, t3);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*pages, categories, showPage*/ 14) {
    				each_value = /*categories*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { part } = $$props;
    	let { pages } = $$props;
    	let categories = ['Introduction', 'Reactivity', 'Props', 'Logic', 'Events'];
    	let showPage = categories[4];
    	const writable_props = ['part', 'pages'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = cat => $$invalidate(2, showPage = cat);

    	$$self.$$set = $$props => {
    		if ('part' in $$props) $$invalidate(0, part = $$props.part);
    		if ('pages' in $$props) $$invalidate(1, pages = $$props.pages);
    	};

    	$$self.$capture_state = () => ({
    		PageContainer,
    		part,
    		pages,
    		categories,
    		showPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('part' in $$props) $$invalidate(0, part = $$props.part);
    		if ('pages' in $$props) $$invalidate(1, pages = $$props.pages);
    		if ('categories' in $$props) $$invalidate(3, categories = $$props.categories);
    		if ('showPage' in $$props) $$invalidate(2, showPage = $$props.showPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [part, pages, showPage, categories, click_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { part: 0, pages: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*part*/ ctx[0] === undefined && !('part' in props)) {
    			console.warn("<App> was created without expected prop 'part'");
    		}

    		if (/*pages*/ ctx[1] === undefined && !('pages' in props)) {
    			console.warn("<App> was created without expected prop 'pages'");
    		}
    	}

    	get part() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set part(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pages() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pages(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Introduction\HelloWorld\HelloWorld.svelte generated by Svelte v3.46.4 */

    const file$n = "src\\pages\\Introduction\\HelloWorld\\HelloWorld.svelte";

    function create_fragment$r(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = `Hello ${/*name*/ ctx[0]}!`;
    			add_location(p, file$n, 4, 0, 48);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HelloWorld', slots, []);
    	let name = 'World';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HelloWorld> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class HelloWorld extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HelloWorld",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src\pages\Introduction\DynamicAttributes\DynamicAttributes.svelte generated by Svelte v3.46.4 */

    const file$m = "src\\pages\\Introduction\\DynamicAttributes\\DynamicAttributes.svelte";

    function create_fragment$q(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[1]);
    			attr_dev(img, "class", "svelte-bvawte");
    			add_location(img, file$m, 5, 0, 86);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DynamicAttributes', slots, []);
    	let src = '/img/image.gif';
    	let alt = 'Rick rolled';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DynamicAttributes> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ src, alt });

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('alt' in $$props) $$invalidate(1, alt = $$props.alt);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, alt];
    }

    class DynamicAttributes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DynamicAttributes",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\pages\Introduction\Styling\Styling.svelte generated by Svelte v3.46.4 */

    const file$l = "src\\pages\\Introduction\\Styling\\Styling.svelte";

    function create_fragment$p(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Look at this awesome styling :o";
    			attr_dev(p, "class", "svelte-1goo29p");
    			add_location(p, file$l, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Styling', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Styling> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Styling extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Styling",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src\pages\Introduction\NestedComponents\OtherComponent.svelte generated by Svelte v3.46.4 */

    const file$k = "src\\pages\\Introduction\\NestedComponents\\OtherComponent.svelte";

    function create_fragment$o(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Doesn't affect this components' p-tag's styling";
    			add_location(p, file$k, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OtherComponent', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OtherComponent> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class OtherComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OtherComponent",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\pages\Introduction\NestedComponents\NestedComponents.svelte generated by Svelte v3.46.4 */
    const file$j = "src\\pages\\Introduction\\NestedComponents\\NestedComponents.svelte";

    function create_fragment$n(ctx) {
    	let p;
    	let t1;
    	let othercomponent;
    	let current;
    	othercomponent = new OtherComponent({ $$inline: true });

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "This component's p-tag's styling..";
    			t1 = space();
    			create_component(othercomponent.$$.fragment);
    			attr_dev(p, "class", "svelte-1c4jmvg");
    			add_location(p, file$j, 4, 0, 82);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(othercomponent, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(othercomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(othercomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			destroy_component(othercomponent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NestedComponents', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NestedComponents> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ OtherComponent });
    	return [];
    }

    class NestedComponents extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NestedComponents",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\pages\Introduction\HtmlTags\HtmlTags.svelte generated by Svelte v3.46.4 */

    const file$i = "src\\pages\\Introduction\\HtmlTags\\HtmlTags.svelte";

    function create_fragment$m(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			add_location(p, file$i, 4, 0, 87);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = /*string*/ ctx[0];
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HtmlTags', slots, []);
    	let string = `You need <strong>@html</strong> to do this`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HtmlTags> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ string });

    	$$self.$inject_state = $$props => {
    		if ('string' in $$props) $$invalidate(0, string = $$props.string);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [string];
    }

    class HtmlTags extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HtmlTags",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\pages\Reactivity\ReactiveAssignments\ReactiveAssignments.svelte generated by Svelte v3.46.4 */

    const file$h = "src\\pages\\Reactivity\\ReactiveAssignments\\ReactiveAssignments.svelte";

    function create_fragment$l(ctx) {
    	let div;
    	let button;
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = (/*count*/ ctx[0] === 1 ? 'time' : 'times') + "";
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text("Clicked ");
    			t1 = text(/*count*/ ctx[0]);
    			t2 = space();
    			t3 = text(t3_value);
    			add_location(button, file$h, 9, 4, 114);
    			attr_dev(div, "class", "svelte-1jabcyx");
    			add_location(div, file$h, 8, 0, 103);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			append_dev(button, t3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleClick*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*count*/ 1) set_data_dev(t1, /*count*/ ctx[0]);
    			if (dirty & /*count*/ 1 && t3_value !== (t3_value = (/*count*/ ctx[0] === 1 ? 'time' : 'times') + "")) set_data_dev(t3, t3_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReactiveAssignments', slots, []);
    	let count = 0;

    	function handleClick() {
    		$$invalidate(0, count += 1);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ReactiveAssignments> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ count, handleClick });

    	$$self.$inject_state = $$props => {
    		if ('count' in $$props) $$invalidate(0, count = $$props.count);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [count, handleClick];
    }

    class ReactiveAssignments extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReactiveAssignments",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\pages\Reactivity\ReactiveDeclarations\ReactiveDeclarations.svelte generated by Svelte v3.46.4 */

    const file$g = "src\\pages\\Reactivity\\ReactiveDeclarations\\ReactiveDeclarations.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t = text(/*clicked*/ ctx[0]);
    			add_location(button, file$g, 10, 4, 184);
    			attr_dev(div, "class", "svelte-1jabcyx");
    			add_location(div, file$g, 9, 0, 173);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleClick*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*clicked*/ 1) set_data_dev(t, /*clicked*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let clicked;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReactiveDeclarations', slots, []);
    	let isClicked = false;

    	function handleClick() {
    		$$invalidate(2, isClicked = !isClicked);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ReactiveDeclarations> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ isClicked, handleClick, clicked });

    	$$self.$inject_state = $$props => {
    		if ('isClicked' in $$props) $$invalidate(2, isClicked = $$props.isClicked);
    		if ('clicked' in $$props) $$invalidate(0, clicked = $$props.clicked);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isClicked*/ 4) {
    			$$invalidate(0, clicked = isClicked ? 'Unclick' : 'Click');
    		}
    	};

    	return [clicked, handleClick, isClicked];
    }

    class ReactiveDeclarations extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReactiveDeclarations",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\pages\Reactivity\ReactiveStatements\ReactiveStatements.svelte generated by Svelte v3.46.4 */

    const file$f = "src\\pages\\Reactivity\\ReactiveStatements\\ReactiveStatements.svelte";

    function create_fragment$j(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let p;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Click the Footman";
    			if (!src_url_equal(img.src, img_src_value = src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", alt);
    			attr_dev(img, "class", "svelte-1i2icdp");
    			add_location(img, file$f, 23, 0, 760);
    			attr_dev(p, "class", "svelte-1i2icdp");
    			add_location(p, file$f, 24, 0, 818);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const src = '/img/footman.gif';
    const alt = 'Warcraft 2 Footman';

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReactiveStatements', slots, []);

    	let sentences = [
    		new Audio('/sounds/awaiting-orders.wav'),
    		new Audio('/sounds/your-command.wav'),
    		new Audio('/sounds/yes-sire.wav'),
    		new Audio('/sounds/my-lord.wav'),
    		new Audio('/sounds/i-do-have-work.wav'),
    		new Audio('/sounds/are-you-still-touching-me.wav')
    	];

    	// Disregard the absolute redundancy of this
    	let i = -1;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ReactiveStatements> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, i = i >= 5 ? 0 : $$invalidate(0, ++i));
    	$$self.$capture_state = () => ({ src, alt, sentences, i });

    	$$self.$inject_state = $$props => {
    		if ('sentences' in $$props) $$invalidate(2, sentences = $$props.sentences);
    		if ('i' in $$props) $$invalidate(0, i = $$props.i);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*i*/ 1) {
    			if (i === 0) sentences[0].play(); else if (i === 1) sentences[1].play(); else if (i === 2) sentences[2].play(); else if (i === 3) sentences[3].play(); else if (i === 4) sentences[4].play(); else if (i === 5) sentences[5].play();
    		}
    	};

    	return [i, click_handler];
    }

    class ReactiveStatements extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReactiveStatements",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\pages\Props\DeclaringProps\Result.svelte generated by Svelte v3.46.4 */

    const file$e = "src\\pages\\Props\\DeclaringProps\\Result.svelte";

    function create_fragment$i(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*result*/ ctx[0]);
    			add_location(p, file$e, 12, 0, 265);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*result*/ 1) set_data_dev(t, /*result*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Result', slots, []);
    	let { answer = '' } = $$props;
    	let result = '';

    	function load() {
    		setTimeout(() => $$invalidate(0, result = answer === 'True' ? 'Correct!' : 'Incorrect'), 1000);
    		return '💭';
    	}

    	const writable_props = ['answer'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Result> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('answer' in $$props) $$invalidate(1, answer = $$props.answer);
    	};

    	$$self.$capture_state = () => ({ answer, result, load });

    	$$self.$inject_state = $$props => {
    		if ('answer' in $$props) $$invalidate(1, answer = $$props.answer);
    		if ('result' in $$props) $$invalidate(0, result = $$props.result);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*answer*/ 2) {
    			$$invalidate(0, result = answer === '' ? '' : load());
    		}
    	};

    	return [result, answer];
    }

    class Result extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { answer: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Result",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get answer() {
    		throw new Error("<Result>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set answer(value) {
    		throw new Error("<Result>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Props\DeclaringProps\DeclaringProps.svelte generated by Svelte v3.46.4 */
    const file$d = "src\\pages\\Props\\DeclaringProps\\DeclaringProps.svelte";

    function create_fragment$h(ctx) {
    	let p;
    	let t1;
    	let form;
    	let input;
    	let t2;
    	let result;
    	let current;
    	let mounted;
    	let dispose;

    	result = new Result({
    			props: { answer: /*answer*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Is Svelte cool?";
    			t1 = space();
    			form = element("form");
    			input = element("input");
    			t2 = space();
    			create_component(result.$$.fragment);
    			add_location(p, file$d, 13, 0, 196);
    			attr_dev(input, "placeholder", "True or False");
    			add_location(input, file$d, 15, 4, 257);
    			add_location(form, file$d, 14, 0, 220);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			set_input_value(input, /*text*/ ctx[0]);
    			insert_dev(target, t2, anchor);
    			mount_component(result, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(form, "submit", /*handleSubmit*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1 && input.value !== /*text*/ ctx[0]) {
    				set_input_value(input, /*text*/ ctx[0]);
    			}

    			const result_changes = {};
    			if (dirty & /*answer*/ 2) result_changes.answer = /*answer*/ ctx[1];
    			result.$set(result_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(result.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(result.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    			if (detaching) detach_dev(t2);
    			destroy_component(result, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DeclaringProps', slots, []);
    	let text;
    	let answer;

    	function handleSubmit(e) {
    		e.preventDefault();
    		$$invalidate(1, answer = text);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DeclaringProps> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	$$self.$capture_state = () => ({ Result, text, answer, handleSubmit });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('answer' in $$props) $$invalidate(1, answer = $$props.answer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, answer, handleSubmit, input_input_handler];
    }

    class DeclaringProps extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DeclaringProps",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\pages\Props\DefaultValues\Nested.svelte generated by Svelte v3.46.4 */

    const file$c = "src\\pages\\Props\\DefaultValues\\Nested.svelte";

    function create_fragment$g(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*phrase*/ ctx[0]);
    			add_location(p, file$c, 4, 0, 82);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*phrase*/ 1) set_data_dev(t, /*phrase*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nested', slots, []);
    	let { phrase = 'This is the default prop value' } = $$props;
    	const writable_props = ['phrase'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nested> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('phrase' in $$props) $$invalidate(0, phrase = $$props.phrase);
    	};

    	$$self.$capture_state = () => ({ phrase });

    	$$self.$inject_state = $$props => {
    		if ('phrase' in $$props) $$invalidate(0, phrase = $$props.phrase);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [phrase];
    }

    class Nested extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { phrase: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nested",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get phrase() {
    		throw new Error("<Nested>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set phrase(value) {
    		throw new Error("<Nested>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Props\DefaultValues\DefaultValues.svelte generated by Svelte v3.46.4 */

    function create_fragment$f(ctx) {
    	let nested0;
    	let t;
    	let nested1;
    	let current;

    	nested0 = new Nested({
    			props: { phrase: 'This is a custom prop value' },
    			$$inline: true
    		});

    	nested1 = new Nested({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(nested0.$$.fragment);
    			t = space();
    			create_component(nested1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(nested0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(nested1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nested0.$$.fragment, local);
    			transition_in(nested1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nested0.$$.fragment, local);
    			transition_out(nested1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nested0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(nested1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DefaultValues', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DefaultValues> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Nested });
    	return [];
    }

    class DefaultValues extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DefaultValues",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\pages\Props\SpreadProps\Phrase.svelte generated by Svelte v3.46.4 */

    const file$b = "src\\pages\\Props\\SpreadProps\\Phrase.svelte";

    function create_fragment$e(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*these*/ ctx[0]);
    			t1 = space();
    			t2 = text(/*words*/ ctx[1]);
    			t3 = space();
    			t4 = text(/*are*/ ctx[2]);
    			t5 = space();
    			t6 = text(/*spread*/ ctx[3]);
    			t7 = space();
    			t8 = text(/*props*/ ctx[4]);
    			add_location(p, file$b, 9, 0, 139);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(p, t5);
    			append_dev(p, t6);
    			append_dev(p, t7);
    			append_dev(p, t8);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*these*/ 1) set_data_dev(t0, /*these*/ ctx[0]);
    			if (dirty & /*words*/ 2) set_data_dev(t2, /*words*/ ctx[1]);
    			if (dirty & /*are*/ 4) set_data_dev(t4, /*are*/ ctx[2]);
    			if (dirty & /*spread*/ 8) set_data_dev(t6, /*spread*/ ctx[3]);
    			if (dirty & /*props*/ 16) set_data_dev(t8, /*props*/ ctx[4]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Phrase', slots, []);
    	let { these } = $$props;
    	let { words } = $$props;
    	let { are } = $$props;
    	let { spread } = $$props;
    	let { props } = $$props;
    	const writable_props = ['these', 'words', 'are', 'spread', 'props'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Phrase> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('these' in $$props) $$invalidate(0, these = $$props.these);
    		if ('words' in $$props) $$invalidate(1, words = $$props.words);
    		if ('are' in $$props) $$invalidate(2, are = $$props.are);
    		if ('spread' in $$props) $$invalidate(3, spread = $$props.spread);
    		if ('props' in $$props) $$invalidate(4, props = $$props.props);
    	};

    	$$self.$capture_state = () => ({ these, words, are, spread, props });

    	$$self.$inject_state = $$props => {
    		if ('these' in $$props) $$invalidate(0, these = $$props.these);
    		if ('words' in $$props) $$invalidate(1, words = $$props.words);
    		if ('are' in $$props) $$invalidate(2, are = $$props.are);
    		if ('spread' in $$props) $$invalidate(3, spread = $$props.spread);
    		if ('props' in $$props) $$invalidate(4, props = $$props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [these, words, are, spread, props];
    }

    class Phrase extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			these: 0,
    			words: 1,
    			are: 2,
    			spread: 3,
    			props: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Phrase",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*these*/ ctx[0] === undefined && !('these' in props)) {
    			console.warn("<Phrase> was created without expected prop 'these'");
    		}

    		if (/*words*/ ctx[1] === undefined && !('words' in props)) {
    			console.warn("<Phrase> was created without expected prop 'words'");
    		}

    		if (/*are*/ ctx[2] === undefined && !('are' in props)) {
    			console.warn("<Phrase> was created without expected prop 'are'");
    		}

    		if (/*spread*/ ctx[3] === undefined && !('spread' in props)) {
    			console.warn("<Phrase> was created without expected prop 'spread'");
    		}

    		if (/*props*/ ctx[4] === undefined && !('props' in props)) {
    			console.warn("<Phrase> was created without expected prop 'props'");
    		}
    	}

    	get these() {
    		throw new Error("<Phrase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set these(value) {
    		throw new Error("<Phrase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get words() {
    		throw new Error("<Phrase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set words(value) {
    		throw new Error("<Phrase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get are() {
    		throw new Error("<Phrase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set are(value) {
    		throw new Error("<Phrase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spread() {
    		throw new Error("<Phrase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spread(value) {
    		throw new Error("<Phrase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get props() {
    		throw new Error("<Phrase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<Phrase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Props\SpreadProps\SpreadProps.svelte generated by Svelte v3.46.4 */

    function create_fragment$d(ctx) {
    	let phrase;
    	let current;
    	const phrase_spread_levels = [/*words*/ ctx[0]];
    	let phrase_props = {};

    	for (let i = 0; i < phrase_spread_levels.length; i += 1) {
    		phrase_props = assign(phrase_props, phrase_spread_levels[i]);
    	}

    	phrase = new Phrase({ props: phrase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(phrase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(phrase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const phrase_changes = (dirty & /*words*/ 1)
    			? get_spread_update(phrase_spread_levels, [get_spread_object(/*words*/ ctx[0])])
    			: {};

    			phrase.$set(phrase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(phrase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(phrase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(phrase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SpreadProps', slots, []);

    	const words = {
    		these: 'These',
    		words: 'words',
    		are: 'are',
    		spread: 'spread',
    		props: 'props'
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SpreadProps> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Phrase, words });
    	return [words];
    }

    class SpreadProps extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpreadProps",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\pages\Logic\IfBlocks\If_Blocks.svelte generated by Svelte v3.46.4 */

    const file$a = "src\\pages\\Logic\\IfBlocks\\If_Blocks.svelte";

    // (10:4) {#if user.loggedIn}
    function create_if_block_1$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Log out";
    			add_location(button, file$a, 10, 8, 175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggle*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(10:4) {#if user.loggedIn}",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#if !user.loggedIn}
    function create_if_block$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Log in";
    			add_location(button, file$a, 16, 8, 290);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggle*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(16:4) {#if !user.loggedIn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let t;
    	let if_block0 = /*user*/ ctx[0].loggedIn && create_if_block_1$1(ctx);
    	let if_block1 = !/*user*/ ctx[0].loggedIn && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			add_location(div, file$a, 8, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*user*/ ctx[0].loggedIn) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*user*/ ctx[0].loggedIn) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('If_Blocks', slots, []);
    	let user = { loggedIn: false };

    	function toggle() {
    		$$invalidate(0, user.loggedIn = !user.loggedIn, user);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<If_Blocks> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ user, toggle });

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user, toggle];
    }

    class If_Blocks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "If_Blocks",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\pages\Logic\ElseBlocks\ElseBlocks.svelte generated by Svelte v3.46.4 */

    const file$9 = "src\\pages\\Logic\\ElseBlocks\\ElseBlocks.svelte";

    // (13:4) {:else}
    function create_else_block$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Log in";
    			add_location(button, file$9, 13, 8, 262);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggle*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(13:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:4) {#if user.loggedIn}
    function create_if_block$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Log out";
    			add_location(button, file$9, 9, 8, 173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggle*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(9:4) {#if user.loggedIn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*user*/ ctx[0].loggedIn) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			add_location(div, file$9, 7, 0, 133);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ElseBlocks', slots, []);
    	let user = { loggedIn: false };

    	function toggle() {
    		$$invalidate(0, user.loggedIn = !user.loggedIn, user);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ElseBlocks> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ user, toggle });

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user, toggle];
    }

    class ElseBlocks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ElseBlocks",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\pages\Logic\ElseIfBlocks\ElseIfBlocks.svelte generated by Svelte v3.46.4 */

    const file$8 = "src\\pages\\Logic\\ElseIfBlocks\\ElseIfBlocks.svelte";

    // (14:0) {:else}
    function create_else_block(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*x*/ ctx[0]);
    			t1 = text(" is between 5 and 10");
    			add_location(p, file$8, 14, 4, 242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*x*/ 1) set_data_dev(t0, /*x*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(14:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (12:16) 
    function create_if_block_1(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*x*/ ctx[0]);
    			t1 = text(" is less than 5");
    			add_location(p, file$8, 12, 4, 202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*x*/ 1) set_data_dev(t0, /*x*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(12:16) ",
    		ctx
    	});

    	return block;
    }

    // (10:0) {#if x > 10}
    function create_if_block(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*x*/ ctx[0]);
    			t1 = text(" is greater than 10");
    			add_location(p, file$8, 10, 4, 149);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*x*/ 1) set_data_dev(t0, /*x*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(10:0) {#if x > 10}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let form;
    	let input;
    	let t;
    	let if_block_anchor;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*x*/ ctx[0] > 10) return create_if_block;
    		if (5 > /*x*/ ctx[0]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			input = element("input");
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-zszs23");
    			add_location(input, file$8, 6, 4, 82);
    			add_location(form, file$8, 5, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			set_input_value(input, /*x*/ ctx[0]);
    			insert_dev(target, t, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*x*/ 1 && to_number(input.value) !== /*x*/ ctx[0]) {
    				set_input_value(input, /*x*/ ctx[0]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (detaching) detach_dev(t);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ElseIfBlocks', slots, []);
    	let x = 0;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ElseIfBlocks> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		x = to_number(this.value);
    		$$invalidate(0, x);
    	}

    	$$self.$capture_state = () => ({ x });

    	$$self.$inject_state = $$props => {
    		if ('x' in $$props) $$invalidate(0, x = $$props.x);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*x*/ 1) {
    			$$invalidate(0, x = x == null ? 0 : x);
    		}
    	};

    	return [x, input_input_handler];
    }

    class ElseIfBlocks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ElseIfBlocks",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\pages\Logic\EachBlocks\EachBlocks.svelte generated by Svelte v3.46.4 */

    const file$7 = "src\\pages\\Logic\\EachBlocks\\EachBlocks.svelte";

    function create_fragment$9(ctx) {
    	let p;
    	let t0;
    	let a;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("See ");
    			a = element("a");
    			t1 = text("PageContainer.svelte");
    			t2 = text(" which is used to display each topic in a category");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", href);
    			add_location(a, file$7, 3, 7, 166);
    			add_location(p, file$7, 3, 0, 159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, a);
    			append_dev(a, t1);
    			append_dev(p, t2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const href = 'https://github.com/JazzyMcJazz/NodeDemo/blob/main/5._First-Svelte/svelte-self-study-1/src/pages/PageContainer.svelte';

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EachBlocks', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EachBlocks> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ href });
    	return [];
    }

    class EachBlocks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EachBlocks",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\pages\Logic\KeyedEachBlocks\ChatRoom.svelte generated by Svelte v3.46.4 */

    const file$6 = "src\\pages\\Logic\\KeyedEachBlocks\\ChatRoom.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let p0;
    	let t0;
    	let t1;
    	let p1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = `${/*lastMessage*/ ctx[1]}`;
    			attr_dev(p0, "id", "title");
    			attr_dev(p0, "class", "svelte-171xzu8");
    			add_location(p0, file$6, 7, 4, 121);
    			attr_dev(p1, "id", "lastMessage");
    			add_location(p1, file$6, 8, 4, 152);
    			attr_dev(div, "class", "svelte-171xzu8");
    			add_location(div, file$6, 6, 0, 110);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, t0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChatRoom', slots, []);
    	let { title } = $$props;
    	let { message = '' } = $$props;
    	const lastMessage = message;
    	const writable_props = ['title', 'message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChatRoom> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('message' in $$props) $$invalidate(2, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({ title, message, lastMessage });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('message' in $$props) $$invalidate(2, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, lastMessage, message];
    }

    class ChatRoom extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { title: 0, message: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChatRoom",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<ChatRoom> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<ChatRoom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ChatRoom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<ChatRoom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<ChatRoom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Logic\KeyedEachBlocks\KeyedEachBlocks.svelte generated by Svelte v3.46.4 */
    const file$5 = "src\\pages\\Logic\\KeyedEachBlocks\\KeyedEachBlocks.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (24:8) {#each chatRooms as chatRoom (chatRoom.id)}
    function create_each_block_1(key_1, ctx) {
    	let first;
    	let chatroom;
    	let current;
    	const chatroom_spread_levels = [/*chatRoom*/ ctx[2]];
    	let chatroom_props = {};

    	for (let i = 0; i < chatroom_spread_levels.length; i += 1) {
    		chatroom_props = assign(chatroom_props, chatroom_spread_levels[i]);
    	}

    	chatroom = new ChatRoom({ props: chatroom_props, $$inline: true });

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(chatroom.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(chatroom, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const chatroom_changes = (dirty & /*chatRooms*/ 1)
    			? get_spread_update(chatroom_spread_levels, [get_spread_object(/*chatRoom*/ ctx[2])])
    			: {};

    			chatroom.$set(chatroom_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chatroom.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chatroom.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(chatroom, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(24:8) {#each chatRooms as chatRoom (chatRoom.id)}",
    		ctx
    	});

    	return block;
    }

    // (32:8) {#each chatRooms as chatRoom}
    function create_each_block(ctx) {
    	let chatroom;
    	let current;
    	const chatroom_spread_levels = [/*chatRoom*/ ctx[2]];
    	let chatroom_props = {};

    	for (let i = 0; i < chatroom_spread_levels.length; i += 1) {
    		chatroom_props = assign(chatroom_props, chatroom_spread_levels[i]);
    	}

    	chatroom = new ChatRoom({ props: chatroom_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(chatroom.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chatroom, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const chatroom_changes = (dirty & /*chatRooms*/ 1)
    			? get_spread_update(chatroom_spread_levels, [get_spread_object(/*chatRoom*/ ctx[2])])
    			: {};

    			chatroom.$set(chatroom_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chatroom.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chatroom.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chatroom, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(32:8) {#each chatRooms as chatRoom}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let button;
    	let t1;
    	let div2;
    	let div0;
    	let h20;
    	let t3;
    	let p0;
    	let t5;
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let t6;
    	let div1;
    	let h21;
    	let t8;
    	let p1;
    	let t10;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*chatRooms*/ ctx[0];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*chatRoom*/ ctx[2].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_1(key, child_ctx));
    	}

    	let each_value = /*chatRooms*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Remove First Chatroom";
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Keyed";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "chatrooms";
    			t5 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t6 = space();
    			div1 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Unkeyed";
    			t8 = space();
    			p1 = element("p");
    			p1.textContent = "chatrooms";
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(button, file$5, 15, 0, 444);
    			add_location(h20, file$5, 21, 8, 612);
    			attr_dev(p0, "class", "svelte-19a1565");
    			add_location(p0, file$5, 22, 8, 636);
    			add_location(div0, file$5, 20, 4, 597);
    			add_location(h21, file$5, 29, 8, 796);
    			attr_dev(p1, "class", "svelte-19a1565");
    			add_location(p1, file$5, 30, 8, 822);
    			add_location(div1, file$5, 28, 4, 781);
    			set_style(div2, "display", "grid");
    			set_style(div2, "grid-template-columns", "1fr 1fr");
    			set_style(div2, "grid-gap", "1em");
    			add_location(div2, file$5, 19, 0, 517);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h20);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(div0, t5);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, h21);
    			append_dev(div1, t8);
    			append_dev(div1, p1);
    			append_dev(div1, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleClick*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*chatRooms*/ 1) {
    				each_value_1 = /*chatRooms*/ ctx[0];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_1, each0_lookup, div0, outro_and_destroy_block, create_each_block_1, null, get_each_context_1);
    				check_outros();
    			}

    			if (dirty & /*chatRooms*/ 1) {
    				each_value = /*chatRooms*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('KeyedEachBlocks', slots, []);

    	let chatRooms = [
    		{
    			id: 1,
    			title: 'Peasant',
    			message: `Hi, I'm a peasant`
    		},
    		{
    			id: 2,
    			title: 'Footman',
    			message: `Hi, I'm a footman`
    		},
    		{
    			id: 3,
    			title: 'Knight',
    			message: `Hi, I'm a knight`
    		},
    		{
    			id: 4,
    			title: 'Paladin',
    			message: `Hi, I'm a paladin`
    		}
    	];

    	function handleClick() {
    		$$invalidate(0, chatRooms = chatRooms.slice(1));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<KeyedEachBlocks> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ChatRoom, chatRooms, handleClick });

    	$$self.$inject_state = $$props => {
    		if ('chatRooms' in $$props) $$invalidate(0, chatRooms = $$props.chatRooms);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [chatRooms, handleClick];
    }

    class KeyedEachBlocks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KeyedEachBlocks",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\pages\Events\DOMEvents\DOMEvents.svelte generated by Svelte v3.46.4 */

    const file$4 = "src\\pages\\Events\\DOMEvents\\DOMEvents.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*m*/ ctx[0].x + "";
    	let t1;
    	let t2;
    	let t3_value = /*m*/ ctx[0].y + "";
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("The mouse position is ");
    			t1 = text(t1_value);
    			t2 = text(" x ");
    			t3 = text(t3_value);
    			attr_dev(div, "class", "svelte-12bbk5r");
    			add_location(div, file$4, 9, 0, 160);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);

    			if (!mounted) {
    				dispose = listen_dev(div, "mousemove", /*handleMousemove*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*m*/ 1 && t1_value !== (t1_value = /*m*/ ctx[0].x + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*m*/ 1 && t3_value !== (t3_value = /*m*/ ctx[0].y + "")) set_data_dev(t3, t3_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DOMEvents', slots, []);
    	let m = { x: 0, y: 0 };

    	function handleMousemove(event) {
    		$$invalidate(0, m.x = event.clientX, m);
    		$$invalidate(0, m.y = event.clientY, m);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DOMEvents> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ m, handleMousemove });

    	$$self.$inject_state = $$props => {
    		if ('m' in $$props) $$invalidate(0, m = $$props.m);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [m, handleMousemove];
    }

    class DOMEvents extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DOMEvents",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\pages\Events\InlineHandlers\InlineHandlers.svelte generated by Svelte v3.46.4 */

    const file$3 = "src\\pages\\Events\\InlineHandlers\\InlineHandlers.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*m*/ ctx[0].x + "";
    	let t1;
    	let t2;
    	let t3_value = /*m*/ ctx[0].y + "";
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("The mouse position is ");
    			t1 = text(t1_value);
    			t2 = text(" x ");
    			t3 = text(t3_value);
    			attr_dev(div, "class", "svelte-12bbk5r");
    			add_location(div, file$3, 4, 0, 52);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);

    			if (!mounted) {
    				dispose = listen_dev(div, "mousemove", /*mousemove_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*m*/ 1 && t1_value !== (t1_value = /*m*/ ctx[0].x + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*m*/ 1 && t3_value !== (t3_value = /*m*/ ctx[0].y + "")) set_data_dev(t3, t3_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InlineHandlers', slots, []);
    	let m = { x: 0, y: 0 };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InlineHandlers> was created with unknown prop '${key}'`);
    	});

    	const mousemove_handler = e => $$invalidate(0, m = { x: e.clientX, y: e.clientY });
    	$$self.$capture_state = () => ({ m });

    	$$self.$inject_state = $$props => {
    		if ('m' in $$props) $$invalidate(0, m = $$props.m);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [m, mousemove_handler];
    }

    class InlineHandlers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InlineHandlers",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\pages\Events\EventModifiers\EventModifiers.svelte generated by Svelte v3.46.4 */

    const file$2 = "src\\pages\\Events\\EventModifiers\\EventModifiers.svelte";

    function create_fragment$4(ctx) {
    	let button;
    	let t1;
    	let p;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Click me";
    			t1 = space();
    			p = element("p");
    			t2 = text(/*text*/ ctx[0]);
    			add_location(button, file$2, 11, 0, 190);
    			add_location(p, file$2, 14, 0, 253);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleClick*/ ctx[1], { once: true }, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t2, /*text*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EventModifiers', slots, []);
    	let text = 'Initial Text';
    	let i = 0;

    	function handleClick() {
    		$$invalidate(0, text = `I can only be changed ${++i} ${i === 1 ? 'time' : 'times'}`);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EventModifiers> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ text, i, handleClick });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('i' in $$props) i = $$props.i;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, handleClick];
    }

    class EventModifiers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EventModifiers",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\pages\Events\ComponentEvents\Message.svelte generated by Svelte v3.46.4 */
    const file$1 = "src\\pages\\Events\\ComponentEvents\\Message.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Click to say hello";
    			add_location(button, file$1, 13, 4, 264);
    			add_location(div, file$1, 12, 0, 253);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*sayHello*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Message', slots, []);
    	const dispatch = createEventDispatcher();

    	function sayHello() {
    		dispatch('play', { audio: new Audio('/sounds/hello.wav') });
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Message> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		sayHello
    	});

    	return [sayHello];
    }

    class Message$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Message",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\Events\ComponentEvents\ComponentEvents.svelte generated by Svelte v3.46.4 */

    function create_fragment$2(ctx) {
    	let message;
    	let current;
    	message = new Message$1({ $$inline: true });
    	message.$on("play", playAudio$1);

    	const block = {
    		c: function create() {
    			create_component(message.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(message, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(message.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(message.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(message, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function playAudio$1(event) {
    	event.detail.audio.play();
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ComponentEvents', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ComponentEvents> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Message: Message$1, playAudio: playAudio$1 });
    	return [];
    }

    class ComponentEvents extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ComponentEvents",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\Events\EventForwarding\Message.svelte generated by Svelte v3.46.4 */
    const file = "src\\pages\\Events\\EventForwarding\\Message.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Click to say hello";
    			add_location(button, file, 13, 4, 264);
    			add_location(div, file, 12, 0, 253);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*sayHello*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Message', slots, []);
    	const dispatch = createEventDispatcher();

    	function sayHello() {
    		dispatch('play', { audio: new Audio('/sounds/hello.wav') });
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Message> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		sayHello
    	});

    	return [sayHello];
    }

    class Message extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Message",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\pages\Events\EventForwarding\EventForwarding.svelte generated by Svelte v3.46.4 */

    function create_fragment(ctx) {
    	let message;
    	let current;
    	message = new Message({ $$inline: true });
    	message.$on("play", playAudio);

    	const block = {
    		c: function create() {
    			create_component(message.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(message, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(message.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(message.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(message, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function playAudio(event) {
    	event.detail.audio.play();
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EventForwarding', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EventForwarding> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Message, playAudio });
    	return [];
    }

    class EventForwarding extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EventForwarding",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		part: 'I',
    		pages: {
    			Introduction: {
    				title: 'Introduction',
    				topics: [
    					{component: HelloWorld, title: 'Hello World', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/HelloWorld'},
    					{component: DynamicAttributes, title: 'Dynamic Attributes', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/DynamicAttributes'},
    					{component: Styling, title: 'Styling', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/Styling'},
    					{component: NestedComponents, title: 'Nested Components', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/NestedComponents'},
    					{component: HtmlTags, title: 'Html Tags', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/HtmlTags'}
    				],
    			},
    			Reactivity: {
    				title: 'Reactivity',
    				topics: [
    					{component: ReactiveAssignments, title: 'Reactive Assignments', src: ''},
    					{component: ReactiveDeclarations, title: 'Reactive Declarations', src: ''},
    					{component: ReactiveStatements, title: 'Reactive Statements', src: ''},

    				]
    			},
    			Props: {
    				title: 'Props',
    				topics: [
    					{component: DeclaringProps, title: 'Declaring Props', src: ''},
    					{component: DefaultValues, title: 'Default Values', src: ''},
    					{component: SpreadProps, title: 'Spread Props', src: ''},
    				]
    			},
    			Logic: {
    				title: 'Logic',
    				topics: [
    					{component: If_Blocks, title: 'If Blocks', src: ''},
    					{component: ElseBlocks, title: 'Else Blocks', src: ''},
    					{component: ElseIfBlocks, title: 'Else-If Blocks', src: ''},
    					{component: EachBlocks, title: 'Each Blocks', src: ''},
    					{component: KeyedEachBlocks, title: 'Keyed Each Blocks', src: ''}
    				]
    			},
    			Events: {
    				title: 'Events',
    				topics: [
    					{component: DOMEvents, title: 'DOM Events', src: ''},
    					{component: InlineHandlers, title: 'Inline Handlers', src: ''},
    					{component: EventModifiers, title: 'Event Modifiers', src: ''},
    					{component: ComponentEvents, title: 'Component Events', src: ''},
    					{component: EventForwarding, title: 'Event Forwarding', src: ''},
    				]
    			}
    		}
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
