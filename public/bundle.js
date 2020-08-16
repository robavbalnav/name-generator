
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
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
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
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
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
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
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
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
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
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
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
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
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const hash = (s) => {
      return s.split("").reduce((acc, value) => {
        acc = (acc << 5) - acc + value.charCodeAt(0);
        return acc & acc;
      }, 0);
    };

    const origins = [
      {
        id: "saudi",
        value: "alsewdy",
      },
      {
        id: "german",
        value: "al-Almani",
      },
      {
        id: "american",
        value: "al-Amriki",
      },
      {
        id: "bosnian",
        value: "al-Bosni",
      },
      {
        id: "albanian",
        value: "al-Albani",
      },
      {
        id: "brazilian",
        value: "al-Brazili",
      },
      {
        id: "french",
        value: "al-Faransi",
      },
      {
        id: "tunisian",
        value: "altuwnisiu",
      },
      {
        id: "afghan",
        value: "al-Afghānī",
      },
      {
        id: "algerian",
        value: "al-Jzayry",
      },
      {
        id: "armenian",
        value: "al-Armini",
      },
      {
        id: "australian",
        value: "al'Usturalia",
      },
      {
        id: "austrian",
        value: "al-Namsawi",
      },
      {
        id: "azerbaijani",
        value: "al-Azeri",
      },
      {
        id: "bahraini",
        value: "al-Bahraini",
      },
      {
        id: "belarusian",
        value: "al-Bylarwsyi",
      },
      {
        id: "belgian",
        value: "al-Baljiki",
      },
      {
        id: "british",
        value: "al'Iinjlizia",
      },
      {
        id: "bruneian",
        value: "al-Brunayi",
      },
      {
        id: "bulgarian",
        value: "al-Bulgharia",
      },
      {
        id: "cameroonian",
        value: "al-Kamiruni",
      },
      {
        id: "canadian",
        value: "al-Kandi",
      },
      {
        id: "chadian",
        value: "al-Shadian",
      },
      {
        id: "chinese",
        value: "al-Sinaa",
      },
      {
        id: "croatian",
        value: "alkuruatia",
      },
      {
        id: "cypriot",
        value: "alqubrusiu",
      },
      {
        id: "danish",
        value: "al-Danmarki",
      },
      {
        id: "dutch",
        value: "al-Hulandi",
      },
      {
        id: "egyptian",
        value: "al-Misria",
      },
      {
        id: "eritrean",
        value: "al-Iirytrin",
      },
      {
        id: "finnish",
        value: "al-Finlandia",
      },
      {
        id: "georgian",
        value: "al-Jawrajia",
      },
      {
        id: "greek",
        value: "al-Yunania",
      },
      {
        id: "icelander",
        value: "al-Ayslandr",
      },
      {
        id: "indian",
        value: "al-Hindiin",
      },
      {
        id: "indonesian",
        value: "al-Iindunisi",
      },
      {
        id: "iranian",
        value: "al-Iiraniun",
      },
      {
        id: "iraqi",
        value: "al-Eiraqiin",
      },
      {
        id: "irish",
        value: "al-Ayralandia",
      },
      {
        id: "israeli",
        value: "al-Iisrayiyli",
      },
      {
        id: "italian",
        value: "al-Iitalia",
      },
      {
        id: "japanese",
        value: "alyabania",
      },
      {
        id: "jordanian",
        value: "al-Urduniyun",
      },
      {
        id: "kazakhstani",
        value: "al-Kazakhstani",
      },
      {
        id: "kuwaiti",
        value: "al-Kuaytiin",
      },
      {
        id: "lebanese",
        value: "al-Lubnaniin",
      },
      {
        id: "liberian",
        value: "al-Libiria",
      },
      {
        id: "libyan",
        value: "alliybia",
      },
      {
        id: "macedonian",
        value: "al-Maqduwni",
      },
      {
        id: "maldivan",
        value: "juzur almaldif",
      },
      {
        id: "malian",
        value: "almalii",
      },
      {
        id: "maltese",
        value: "almalitia",
      },
      {
        id: "mauritanian",
        value: "almuritaniu",
      },
      {
        id: "mexican",
        value: "almaksiki",
      },
      {
        id: "moroccan",
        value: "almaghribiu",
      },
      {
        id: "namibian",
        value: "alnamibiu",
      },
      {
        id: "nepalese",
        value: "alnybaly",
      },
      {
        id: "new zealander",
        value: "alnywzylandi",
      },
      {
        id: "nigerian",
        value: "alnayjiriiyn",
      },
      {
        id: "norwegian",
        value: "alnirwijia",
      },
      {
        id: "omani",
        value: "aleumani",
      },
      {
        id: "pakistani",
        value: "albakistaniu",
      },
      {
        id: "polish",
        value: "albulandia",
      },
      {
        id: "portuguese",
        value: "walburtughalia",
      },
      {
        id: "qatari",
        value: "alqatari",
      },
      {
        id: "romanian",
        value: "alruwmaniu",
      },
      {
        id: "russian",
        value: "alrws",
      },
      {
        id: "rwandan",
        value: "alrawandan",
      },
      {
        id: "scottish",
        value: "al'iiskutlandiu",
      },
      {
        id: "senegalese",
        value: "alsinighal",
      },
      {
        id: "serbian",
        value: "alsirbia",
      },
      {
        id: "singaporean",
        value: "alsinghafuri",
      },
      {
        id: "slovakian",
        value: "alsslufakia",
      },
      {
        id: "slovenian",
        value: "alsslufiniu",
      },
      {
        id: "somali",
        value: "alsuwmaliu",
      },
      {
        id: "south african",
        value: "janub 'iifriqia",
      },
      {
        id: "south korean",
        value: "kuria aljanubia",
      },
      {
        id: "spanish",
        value: "al'iisbania",
      },
      {
        id: "sri lankan",
        value: "alsrilankia",
      },
      {
        id: "sudanese",
        value: "alsudani",
      },
      {
        id: "swedish",
        value: "alsuwidia",
      },
      {
        id: "swiss",
        value: "alsuwisriiyn",
      },
      {
        id: "syrian",
        value: "alsuwriu",
      },
      {
        id: "thai",
        value: "alttaylandia",
      },
      {
        id: "togolese",
        value: "altuwghuliz",
      },
      {
        id: "togolese",
        value: "altuwghuliz",
      },
      {
        id: "turkish",
        value: "alturki",
      },
      {
        id: "ugandan",
        value: "al'uwghandiu",
      },
      {
        id: "ukrainian",
        value: "al'uwkraniu",
      },
      {
        id: "uzbekistani",
        value: "alawzbkstany",
      },
      {
        id: "vietnamese",
        value: "alfiatnamia",
      },
      {
        id: "yemenite",
        value: "alyamani",
      },
      {
        id: "zimbabwean",
        value: "zambabwi",
      },
    ];

    const getFromId = (id) => {
      const origin = origins.find((origin) => origin.id === id);
      return origin ? origin.value : "";
    };

    var professions = ["Tebbeyah", "Tabib", "Muhandis", "Zayif", "Matabikh"];

    var organizations = [
      "Abu Sayyaf",
      "Al-Muhajiroun",
      "Al-Mulathameen",
      "Ansar Al-Furqan",
      "Ansar al-Jihad",
      "Ansar al-Sharia",
      "Ansar al-Din",
      "Bay'at al-Imam",
      "Boko Haram",
      "Ghuraba al-Sham",
      "Hizbul Islam",
      "Hamas",
      "Hezbollah",
      "Izz ad-Din al-Qassam",
      "Jabhatul Islamiya",
      "Jaish ul-Adl",
      "Jaljalat",
      "Jamaah Ansharut Daulah",
      "Jemaah Islamiyah",
      "Jund al-Sham",
      "Jund Ansar Allah",
      "Komando Jihad",
      "Lashkar-e-Islam",
      "Lashkar-e-Omar",
      "Lashkar-e-Taiba",
      "Laskar Jihad",
      "Maktab al-Khidamat",
      "Muaskar Anole",
      "Mujahedeen KOMPAK",
      "Osbat al-Nour",
      "Profetens Ummah",
      "Al-Qaeda",
      "Rawti Shax",
      "Al-Shabaab",
      "Shariat Jamaat",
      "Ummah Tameer-e-Nau",
      "Vilayat Galgaycho",
      "Die Wahre Religion"
    ];

    const getSecondName = (hash) => {
      const aggregated = [...organizations, ...professions];
      return aggregated[
        hash < 0
          ? ((hash % aggregated.length) + aggregated.length) % aggregated.length
          : hash % aggregated.length
      ];
    };

    const civility = (hash) => {
      return hash % 2 ? "Abu" : "";
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const generateName = (inputName, country) => {
      const hashedInput = hash(`${inputName}${country}`);
      const particles = [
        civility(hashedInput),
        inputName,
        getSecondName(hashedInput),
        getFromId(country),
      ]
        .filter(Boolean)
        .map(capitalize)
        .join(" ");
      return particles;
    };

    const nationalities = {
      afghan: "Afghan",
      albanian: "Albanian",
      algerian: "Algerian",
      american: "American",
      andorran: "Andorran",
      angolan: "Angolan",
      antiguans: "Antiguans",
      argentinean: "Argentinean",
      armenian: "Armenian",
      australian: "Australian",
      austrian: "Austrian",
      azerbaijani: "Azerbaijani",
      bahamian: "Bahamian",
      bahraini: "Bahraini",
      bangladeshi: "Bangladeshi",
      barbadian: "Barbadian",
      barbudans: "Barbudans",
      batswana: "Batswana",
      belarusian: "Belarusian",
      belgian: "Belgian",
      belizean: "Belizean",
      beninese: "Beninese",
      bhutanese: "Bhutanese",
      bolivian: "Bolivian",
      bosnian: "Bosnian",
      brazilian: "Brazilian",
      british: "British",
      bruneian: "Bruneian",
      bulgarian: "Bulgarian",
      burkinabe: "Burkinabe",
      burmese: "Burmese",
      burundian: "Burundian",
      cambodian: "Cambodian",
      cameroonian: "Cameroonian",
      canadian: "Canadian",
      "cape verdean": "Cape Verdean",
      "central african": "Central African",
      chadian: "Chadian",
      chilean: "Chilean",
      chinese: "Chinese",
      colombian: "Colombian",
      comoran: "Comoran",
      congolese: "Congolese",
      "costa rican": "Costa Rican",
      croatian: "Croatian",
      cuban: "Cuban",
      cypriot: "Cypriot",
      czech: "Czech",
      danish: "Danish",
      djibouti: "Djibouti",
      dominican: "Dominican",
      dutch: "Dutch",
      "east timorese": "East Timorese",
      ecuadorean: "Ecuadorean",
      egyptian: "Egyptian",
      emirian: "Emirian",
      "equatorial guinean": "Equatorial Guinean",
      eritrean: "Eritrean",
      estonian: "Estonian",
      ethiopian: "Ethiopian",
      fijian: "Fijian",
      filipino: "Filipino",
      finnish: "Finnish",
      french: "French",
      gabonese: "Gabonese",
      gambian: "Gambian",
      georgian: "Georgian",
      german: "German",
      ghanaian: "Ghanaian",
      greek: "Greek",
      grenadian: "Grenadian",
      guatemalan: "Guatemalan",
      "guinea-bissauan": "Guinea-Bissauan",
      guinean: "Guinean",
      guyanese: "Guyanese",
      haitian: "Haitian",
      herzegovinian: "Herzegovinian",
      honduran: "Honduran",
      hungarian: "Hungarian",
      icelander: "Icelander",
      indian: "Indian",
      indonesian: "Indonesian",
      iranian: "Iranian",
      iraqi: "Iraqi",
      irish: "Irish",
      israeli: "Israeli",
      italian: "Italian",
      ivorian: "Ivorian",
      jamaican: "Jamaican",
      japanese: "Japanese",
      jordanian: "Jordanian",
      kazakhstani: "Kazakhstani",
      kenyan: "Kenyan",
      "kittian and nevisian": "Kittian and Nevisian",
      kuwaiti: "Kuwaiti",
      kyrgyz: "Kyrgyz",
      laotian: "Laotian",
      latvian: "Latvian",
      lebanese: "Lebanese",
      liberian: "Liberian",
      libyan: "Libyan",
      liechtensteiner: "Liechtensteiner",
      lithuanian: "Lithuanian",
      luxembourger: "Luxembourger",
      macedonian: "Macedonian",
      malagasy: "Malagasy",
      malawian: "Malawian",
      malaysian: "Malaysian",
      maldivan: "Maldivan",
      malian: "Malian",
      maltese: "Maltese",
      marshallese: "Marshallese",
      mauritanian: "Mauritanian",
      mauritian: "Mauritian",
      mexican: "Mexican",
      micronesian: "Micronesian",
      moldovan: "Moldovan",
      monacan: "Monacan",
      mongolian: "Mongolian",
      moroccan: "Moroccan",
      mosotho: "Mosotho",
      motswana: "Motswana",
      mozambican: "Mozambican",
      namibian: "Namibian",
      nauruan: "Nauruan",
      nepalese: "Nepalese",
      "new zealander": "New Zealander",
      "ni-vanuatu": "Ni-Vanuatu",
      nicaraguan: "Nicaraguan",
      nigerien: "Nigerien",
      "north korean": "North Korean",
      "northern irish": "Northern Irish",
      norwegian: "Norwegian",
      omani: "Omani",
      pakistani: "Pakistani",
      palauan: "Palauan",
      panamanian: "Panamanian",
      "papua new guinean": "Papua New Guinean",
      paraguayan: "Paraguayan",
      peruvian: "Peruvian",
      polish: "Polish",
      portuguese: "Portuguese",
      qatari: "Qatari",
      romanian: "Romanian",
      russian: "Russian",
      rwandan: "Rwandan",
      "saint lucian": "Saint Lucian",
      salvadoran: "Salvadoran",
      samoan: "Samoan",
      "san marinese": "San Marinese",
      "sao tomean": "Sao Tomean",
      saudi: "Saudi",
      scottish: "Scottish",
      senegalese: "Senegalese",
      serbian: "Serbian",
      seychellois: "Seychellois",
      "sierra leonean": "Sierra Leonean",
      singaporean: "Singaporean",
      slovakian: "Slovakian",
      slovenian: "Slovenian",
      "solomon islander": "Solomon Islander",
      somali: "Somali",
      "south african": "South African",
      "south korean": "South Korean",
      spanish: "Spanish",
      "sri lankan": "Sri Lankan",
      sudanese: "Sudanese",
      surinamer: "Surinamer",
      swazi: "Swazi",
      swedish: "Swedish",
      swiss: "Swiss",
      syrian: "Syrian",
      taiwanese: "Taiwanese",
      tajik: "Tajik",
      tanzanian: "Tanzanian",
      thai: "Thai",
      togolese: "Togolese",
      tongan: "Tongan",
      "trinidadian or tobagonian": "Trinidadian or Tobagonian",
      tunisian: "Tunisian",
      turkish: "Turkish",
      tuvaluan: "Tuvaluan",
      ugandan: "Ugandan",
      ukrainian: "Ukrainian",
      uruguayan: "Uruguayan",
      uzbekistani: "Uzbekistani",
      venezuelan: "Venezuelan",
      vietnamese: "Vietnamese",
      welsh: "Welsh",
      yemenite: "Yemenite",
      zambian: "Zambian",
      zimbabwean: "Zimbabwean",
    };

    const nationalitiesArray = Object.entries(nationalities)
      .map(([id, value]) => ({
        id,
        value,
      }))
      .filter((nationality) =>
        Boolean(origins.find((origin) => origin.id === nationality.id))
      );

    /* src\components\Board.svelte generated by Svelte v3.22.3 */
    const file = "src\\components\\Board.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (58:4) {#each nationalities as nationality}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*nationality*/ ctx[6].value + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*nationality*/ ctx[6].id;
    			option.value = option.__value;
    			add_location(option, file, 58, 6, 1145);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(58:4) {#each nationalities as nationality}",
    		ctx
    	});

    	return block;
    }

    // (65:2) {#if name}
    function create_if_block(ctx) {
    	let p0;
    	let t1;
    	let p1;
    	let t2;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "Your jihad name is :";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(/*name*/ ctx[1]);
    			add_location(p0, file, 65, 4, 1343);
    			attr_dev(p1, "class", "generatedName svelte-1b1alrv");
    			add_location(p1, file, 66, 4, 1376);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 2) set_data_dev(t2, /*name*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(65:2) {#if name}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let input;
    	let t0;
    	let select;
    	let t1;
    	let button;
    	let t3;
    	let dispose;
    	let each_value = nationalitiesArray;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block = /*name*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			button = element("button");
    			button.textContent = "Generate my name";
    			t3 = space();
    			if (if_block) if_block.c();
    			attr_dev(input, "class", "field svelte-1b1alrv");
    			attr_dev(input, "placeholder", placeholder);
    			add_location(input, file, 55, 2, 976);
    			attr_dev(select, "class", "field selectInput svelte-1b1alrv");
    			if (/*country*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file, 56, 2, 1040);
    			attr_dev(button, "class", "generateBtn svelte-1b1alrv");
    			add_location(button, file, 61, 2, 1234);
    			attr_dev(div, "class", "wrapper svelte-1b1alrv");
    			add_location(div, file, 54, 0, 951);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*inputName*/ ctx[0]);
    			append_dev(div, t0);
    			append_dev(div, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*country*/ ctx[2]);
    			append_dev(div, t1);
    			append_dev(div, button);
    			append_dev(div, t3);
    			if (if_block) if_block.m(div, null);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    				listen_dev(select, "change", /*select_change_handler*/ ctx[5]),
    				listen_dev(button, "click", /*handleGenerate*/ ctx[3], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputName*/ 1 && input.value !== /*inputName*/ ctx[0]) {
    				set_input_value(input, /*inputName*/ ctx[0]);
    			}

    			if (dirty & /*nationalities*/ 0) {
    				each_value = nationalitiesArray;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*country*/ 4) {
    				select_option(select, /*country*/ ctx[2]);
    			}

    			if (/*name*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			run_all(dispose);
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

    const placeholder = "John";

    function instance($$self, $$props, $$invalidate) {
    	let inputName = "";
    	let name = "";
    	let country = nationalitiesArray[0].id;

    	function handleGenerate() {
    		if (inputName) {
    			$$invalidate(1, name = generateName(inputName, country));
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Board> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Board", $$slots, []);

    	function input_input_handler() {
    		inputName = this.value;
    		$$invalidate(0, inputName);
    	}

    	function select_change_handler() {
    		country = select_value(this);
    		$$invalidate(2, country);
    	}

    	$$self.$capture_state = () => ({
    		generateName,
    		nationalities: nationalitiesArray,
    		placeholder,
    		inputName,
    		name,
    		country,
    		handleGenerate
    	});

    	$$self.$inject_state = $$props => {
    		if ("inputName" in $$props) $$invalidate(0, inputName = $$props.inputName);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("country" in $$props) $$invalidate(2, country = $$props.country);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		inputName,
    		name,
    		country,
    		handleGenerate,
    		input_input_handler,
    		select_change_handler
    	];
    }

    class Board extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Board",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src\components\MainWrapper.svelte generated by Svelte v3.22.3 */

    const file$1 = "src\\components\\MainWrapper.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "wrapper svelte-1b2z23m");
    			add_location(div, file$1, 10, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[0], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MainWrapper> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("MainWrapper", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class MainWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainWrapper",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\components\Title.svelte generated by Svelte v3.22.3 */

    const file$2 = "src\\components\\Title.svelte";

    function create_fragment$2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Get your jihad name";
    			add_location(h1, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
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

    function instance$2($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Title", $$slots, []);
    	return [];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\App.svelte generated by Svelte v3.22.3 */

    // (7:0) <MainWrapper>
    function create_default_slot(ctx) {
    	let t;
    	let current;
    	const title = new Title({ $$inline: true });
    	const board = new Board({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(title.$$.fragment);
    			t = space();
    			create_component(board.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(title, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(board, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);
    			transition_in(board.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			transition_out(board.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(title, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(board, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(7:0) <MainWrapper>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current;

    	const mainwrapper = new MainWrapper({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mainwrapper.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainwrapper, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const mainwrapper_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				mainwrapper_changes.$$scope = { dirty, ctx };
    			}

    			mainwrapper.$set(mainwrapper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainwrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainwrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainwrapper, detaching);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Board, MainWrapper, Title });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
