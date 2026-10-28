window.__ModuleLoader__.load({
	id: "@z-y-q/dsh-mcp-apps",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/util.js
		function getEnumValues$1(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function joinValues(array, separator = "|") {
			return array.map((val) => stringifyPrimitive(val)).join(separator);
		}
		function jsonStringifyReplacer$1(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		var Cached = class {
			constructor(getter) {
				this._getter = getter;
				this._value = void 0;
			}
			get value() {
				const getter = this._getter;
				if (getter !== void 0) {
					this._value = getter();
					this._getter = void 0;
				}
				return this._value;
			}
		};
		function cached$1(getter) {
			return new Cached(getter);
		}
		function nullish$1(input) {
			return input === null || input === void 0;
		}
		function cleanRegex$1(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		function floatSafeRemainder(val, step) {
			const ratio = val / step;
			const roundedRatio = Math.round(ratio);
			const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		function assignProp$1(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		/**
		* Whichever object a def's `shape` currently answers from: the one the caller passed until the first read, the frozen copy after it.
		*
		* Its keys and descriptors read without invoking anything, which is what lets a discriminated union check its discriminator, and the cycle walk read a shape, without resolving a getter that references the schema being constructed. A def that answers `shape` from an accessor of its own has none.
		*/
		function rawShape(def) {
			const desc = Object.getOwnPropertyDescriptor(def, "shape");
			return desc?.get ? desc.get.raw : desc?.value;
		}
		function sourceShape(schema) {
			return rawShape(schema._zod.def) ?? schema._zod.def.shape;
		}
		function deferProp(target, key, getter) {
			Object.defineProperty(target, key, {
				get() {
					const value = getter();
					assignProp$1(this, key, value);
					return value;
				},
				enumerable: true,
				configurable: true
			});
		}
		function putProp(target, key, value) {
			if (key in target) assignProp$1(target, key, value);
			else target[key] = value;
		}
		/**
		* Copies `keys` of `source`'s shape onto `target`, each value passed through `wrap`.
		*
		* A key the source has resolved is copied through now, so the derived shape states it outright and nothing has to resolve it to learn what it holds. A key the source still defers stays deferred, and reads back through the source's own `shape`, so it resolves once and both shapes get that one schema.
		*/
		function mirrorShape(target, source, keys, wrap) {
			const raw = sourceShape(source);
			for (const key of keys) {
				const desc = Object.getOwnPropertyDescriptor(raw, key);
				if (!desc.enumerable) continue;
				if (desc.get) deferProp(target, key, () => {
					const value = source._zod.def.shape[key];
					return wrap ? wrap(value, key) : value;
				});
				else putProp(target, key, wrap ? wrap(desc.value, key) : desc.value);
			}
		}
		function mirrorProps(target, source) {
			for (const key of Reflect.ownKeys(source)) {
				const desc = Object.getOwnPropertyDescriptor(source, key);
				if (!desc.enumerable) continue;
				if (desc.get) deferProp(target, key, () => source[key]);
				else putProp(target, key, desc.value);
			}
		}
		function mergeDefs$1(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) {
				const descriptors = Object.getOwnPropertyDescriptors(def);
				Object.assign(mergedDescriptors, descriptors);
			}
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc$1(str) {
			return JSON.stringify(str);
		}
		function slugify$1(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace$1 = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject$1(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval$1 = /* @__PURE__*/ cached$1(() => {
			if (globalConfig$1.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject$1(o) {
			if (isObject$1(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject$1(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone$1(o) {
			if (isPlainObject$1(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes$1 = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex$1(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone$1(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams$1(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function stringifyPrimitive(value) {
			if (typeof value === "bigint") return value.toString() + "n";
			if (typeof value === "string") return `"${value}"`;
			return `${value}`;
		}
		function optionalKeys$1(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = /*@__PURE__*/ (() => ({
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		}))();
		const BIGINT_FORMAT_RANGES = {
			int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
			uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")]
		};
		function pick$1(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			const newShape = {};
			mirrorShape(newShape, schema, maskedKeys(schema, mask));
			return clone$1(schema, mergeDefs$1(currDef, {
				shape: newShape,
				checks: []
			}));
		}
		function maskedKeys(schema, mask) {
			const raw = sourceShape(schema);
			const keys = [];
			for (const key of Reflect.ownKeys(mask)) {
				if (!Object.getOwnPropertyDescriptor(raw, key)?.enumerable) throw new Error(`Unrecognized key: "${String(key)}"`);
				if (mask[key]) keys.push(key);
			}
			return keys;
		}
		function omit$1(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			const omitted = new Set(maskedKeys(schema, mask));
			const newShape = {};
			mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)).filter((key) => !omitted.has(key)));
			return clone$1(schema, mergeDefs$1(currDef, {
				shape: newShape,
				checks: []
			}));
		}
		function extend$1(schema, shape) {
			if (!isPlainObject$1(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = sourceShape(schema);
				for (const key of Reflect.ownKeys(shape)) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone$1(schema, mergeDefs$1(schema._zod.def, { shape: extended(schema, shape) }));
		}
		function extended(schema, shape) {
			const newShape = {};
			mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)));
			mirrorProps(newShape, shape);
			return newShape;
		}
		function safeExtend$1(schema, shape) {
			if (!isPlainObject$1(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone$1(schema, mergeDefs$1(schema._zod.def, { shape: extended(schema, shape) }));
		}
		function merge$1(a, b) {
			if (!b?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			const newShape = {};
			mirrorShape(newShape, a, Reflect.ownKeys(sourceShape(a)));
			mirrorShape(newShape, b, Reflect.ownKeys(sourceShape(b)));
			return clone$1(a, mergeDefs$1(a._zod.def, {
				shape: newShape,
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial$1(Class, schema, mask, name = "partial") {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
			const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
			const newShape = {};
			mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), Class && ((value, key) => selected && !selected.has(key) ? value : new Class({
				type: "optional",
				innerType: value
			})));
			return clone$1(schema, mergeDefs$1(schema._zod.def, {
				shape: newShape,
				checks: []
			}));
		}
		function required$1(Class, schema, mask) {
			const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
			const newShape = {};
			mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), (value, key) => selected && !selected.has(key) ? value : new Class({
				type: "nonoptional",
				innerType: value
			}));
			return clone$1(schema, mergeDefs$1(schema._zod.def, { shape: newShape }));
		}
		function aborted$1(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted$1(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues$1(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage$1(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function attachSchema(issues, start, inst) {
			var _a;
			for (let i = start; i < issues.length; i++) (_a = issues[i]).schema ?? (_a.schema = inst);
		}
		function finalizeIssue$1(iss, ctx, config) {
			var _a;
			const traits = iss.inst?._zod?.traits;
			if (traits?.has("$ZodType")) {
				if (traits.has("$ZodCheck")) (_a = iss).schema ?? (_a.schema = iss.inst);
				else iss.schema = iss.inst;
			}
			const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
			const message = iss.message ? iss.message : unwrapMessage$1(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage$1(schemaError?.(iss)) ?? unwrapMessage$1(ctx?.error?.(iss)) ?? unwrapMessage$1(config.customError?.(iss)) ?? unwrapMessage$1(config.localeError?.(iss)) ?? "Invalid input";
			const full = {};
			for (const k of Object.keys(iss)) {
				if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__") continue;
				full[k] = iss[k];
			}
			full.path ?? (full.path = []);
			full.message = message;
			if (ctx?.reportInput) full.input = iss.input;
			return full;
		}
		const highSurrogate = /[\uD800-\uDBFF]/;
		function codePointLength(str) {
			const units = str.length;
			if (!highSurrogate.test(str)) return units;
			let count = units;
			for (let i = 0; i < units - 1; i++) if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
				count--;
				i++;
			}
			return count;
		}
		function getLengthableOrigin$1(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function parsedType(data) {
			const t = typeof data;
			switch (t) {
				case "number": return Number.isNaN(data) ? "nan" : "number";
				case "object": {
					if (data === null) return "null";
					if (Array.isArray(data)) return "array";
					const obj = data;
					if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) return obj.constructor.name;
				}
			}
			return t;
		}
		function issue$1(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		/**
		* Installs a trait's members on its prototype. Each value builds that member for the instance on first read; the built value shadows the accessor as an own property, so a detached `const { parse } = schema` keeps working.
		*
		* Call this from a `proto` initializer, which runs once per prototype — never per instance.
		*/
		function members(proto, table) {
			for (const key in table) {
				const desc = Object.getOwnPropertyDescriptor(table, key);
				if (desc.get) Object.defineProperty(proto, key, {
					...desc,
					enumerable: false
				});
				else defineBound(proto, key, desc.value);
			}
		}
		/** Shadows a prototype member with an own value, so a getter that builds from the instance runs once. */
		function own(inst, key, value, enumerable = true) {
			Object.defineProperty(inst, key, {
				configurable: true,
				writable: true,
				enumerable,
				value
			});
			return value;
		}
		/** Like {@link own}, for a member that was never an own data property and has to stay out of `Object.keys`. */
		function hide(inst, key, value) {
			return own(inst, key, value, false);
		}
		/** Adds members a table derives from the instance: each builds on first read and shadows as own data, and assignment shadows the same way, as when these were own properties. */
		function derived(computes, table) {
			for (const key in computes) {
				const compute = computes[key];
				Object.defineProperty(table, key, {
					configurable: true,
					enumerable: true,
					get() {
						return own(this, key, compute(this));
					},
					set(value) {
						own(this, key, value);
					}
				});
			}
			return table;
		}
		function defineBound(proto, key, fn) {
			Object.defineProperty(proto, key, {
				configurable: true,
				get() {
					return this == null ? fn : own(this, key, fn.bind(this));
				},
				set(value) {
					own(this, key, value);
				}
			});
		}
		/** Returns the prototype to install on, or `undefined` if this group is already installed on it. */
		function claim(inst, sentinel) {
			const proto = Object.getPrototypeOf(inst);
			return sentinel in proto ? void 0 : proto;
		}
		let installing;
		let broke = false;
		const breaker = {
			configurable: true,
			get() {
				broke = true;
			}
		};
		/**
		* Installs a lazily-derived internal on the `_zod` prototype of `inst`'s
		* constructor, computed from the internals object itself and cached there on
		* first read. One accessor per constructor rather than one per instance.
		*/
		function defineLazyInternal(inst, key, compute) {
			const proto = Object.getPrototypeOf(inst._zod);
			if (key in proto && installing !== inst._zod) {
				installing = void 0;
				return;
			}
			installing = inst._zod;
			Object.defineProperty(proto, key, {
				configurable: true,
				get() {
					Object.defineProperty(this, key, breaker);
					const outer = broke;
					broke = false;
					try {
						const value = compute(this);
						if (broke) delete this[key];
						else Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							value
						});
						broke = broke || outer;
						return value;
					} catch (err) {
						delete this[key];
						broke = broke || outer;
						throw err;
					}
				},
				set(value) {
					Object.defineProperty(this, key, {
						configurable: true,
						writable: true,
						value
					});
				}
			});
		}
		/**
		* Installs `key` on `inst`'s prototype, computed by `make` on first read and cached there as an own
		* data property. One accessor per constructor rather than one per instance, because an own accessor
		* puts every instance after the first into v8 dictionary mode. The key doubles as the sentinel.
		*/
		function installLazyProp(inst, key, make, enumerable) {
			const proto = claim(inst, key);
			if (!proto) return;
			Object.defineProperty(proto, key, {
				configurable: true,
				get() {
					const desc = {
						configurable: true,
						writable: true,
						enumerable,
						value: void 0
					};
					Object.defineProperty(this, key, desc);
					desc.value = make(this);
					Object.defineProperty(this, key, desc);
					return desc.value;
				},
				set(value) {
					Object.defineProperty(this, key, {
						configurable: true,
						writable: true,
						enumerable,
						value
					});
				}
			});
		}
		/** Marks the thunk `_catch` synthesises for a constant catch value. `Function.length` cannot tell that thunk from a user callback — rest and defaulted parameters both report arity 0 — and a user callback reads `ctx.error`, whose issues only finalize correctly against the caller's per-parse error map. Provenance can say what arity cannot. A plain string key rather than `Symbol.for`, whose call at module scope no bundler can prove pure — the same shape that anchored `urlCanParse` into every build. */
		const CONSTANT_CATCH = "~constantCatch";
		/** Wraps a constant catch value in a thunk tagged with {@link CONSTANT_CATCH}. */
		function constantCatch(value) {
			const fn = () => value;
			fn[CONSTANT_CATCH] = true;
			return fn;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/core.js
		var _a$3;
		const _zodDesc = {
			value: void 0,
			enumerable: false
		};
		let _E = "captureStackTrace" in Error ? Error : null;
		function newError(Definition) {
			const E = _E;
			if (E) {
				const saved = E.stackTraceLimit;
				if (typeof saved === "number") {
					try {
						E.stackTraceLimit = 0;
					} catch {
						_E = null;
						return new Definition();
					}
					try {
						return new Definition();
					} finally {
						E.stackTraceLimit = saved;
					}
				}
			}
			return new Definition();
		}
		function $constructor$1(name, initializer, proto, params) {
			const zodProto = {};
			function Internals(def) {
				this.def = def;
				this.constr = _;
				this.traits = /* @__PURE__ */ new Set();
			}
			Internals.prototype = zodProto;
			const protoMembers = proto;
			const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
			function init(inst, def) {
				if (!inst._zod) {
					_zodDesc.value = new Internals(def);
					try {
						Object.defineProperty(inst, "_zod", _zodDesc);
					} finally {
						_zodDesc.value = void 0;
					}
				} else if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				if (initialized) {
					const own = Object.getPrototypeOf(inst);
					const ctorProto = inst._zod.constr.prototype;
					let up = own;
					while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
					const target = up ?? own;
					if (!initialized.has(target)) {
						initialized.add(target);
						members(target, protoMembers);
					}
				}
				const proto = _.prototype;
				for (const k in proto) {
					if (!Object.prototype.hasOwnProperty.call(proto, k)) continue;
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				const inst = params?.Parent ? newError(Definition) : this;
				init(inst, def);
				const deferred = inst._zod.deferred;
				if (deferred) {
					for (const fn of deferred) fn();
					inst._zod.deferred = void 0;
				}
				const pp = globalThis.__zod_globalConfig?.postProcessor;
				if (pp) pp(inst);
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError$1 = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError$1 = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$3 = globalThis).__zod_globalConfig ?? (_a$3.__zod_globalConfig = {});
		const globalConfig$1 = globalThis.__zod_globalConfig;
		function config$1(newConfig) {
			if (newConfig) Object.assign(globalConfig$1, newConfig);
			return globalConfig$1;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/errors.js
		function _getMessage() {
			const internals = this._zod;
			internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer$1, 2));
			return internals.message;
		}
		function _setMessage(value) {
			this._zod.message = value;
		}
		const _messageDesc = {
			get: _getMessage,
			set: _setMessage,
			enumerable: true,
			configurable: true
		};
		const _issuesDesc = {
			value: void 0,
			enumerable: false
		};
		const _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
		const initializer$3 = (inst, def) => {
			inst.name = "$ZodError";
			_issuesDesc.value = def;
			Object.defineProperty(inst, "issues", _issuesDesc);
			_issuesDesc.value = void 0;
			Object.defineProperty(inst, "message", _messageDesc);
			const proto = Object.getPrototypeOf(inst);
			if (!_installedToString.has(proto)) {
				_installedToString.add(proto);
				Object.defineProperty(proto, "toString", {
					configurable: true,
					enumerable: false,
					get() {
						const value = () => this.message;
						Object.defineProperty(this, "toString", {
							value,
							configurable: true,
							writable: true
						});
						return value;
					},
					set(value) {
						Object.defineProperty(this, "toString", {
							value,
							configurable: true,
							writable: true
						});
					}
				});
			}
		};
		const $ZodError$1 = $constructor$1("$ZodError", initializer$3);
		const $ZodRealError$1 = $constructor$1("$ZodError", initializer$3, void 0, { Parent: Error });
		/** Get-or-create `obj[key]` as an own data property. A path segment naming an inherited member
		* ("toString", "constructor") would otherwise read through to the prototype, and assigning
		* "__proto__" would hit the setter instead of creating a key. */
		function node(obj, key, make) {
			if (!Object.prototype.hasOwnProperty.call(obj, key)) {
				if (key === "__proto__") Object.defineProperty(obj, key, {
					value: make(),
					writable: true,
					enumerable: true,
					configurable: true
				});
				else obj[key] = make();
			}
			return obj[key];
		}
		function flattenError$1(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
			else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError$1(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							const terminal = i === fullpath.length - 1;
							if (el === "_errors") {
								if (terminal) curr._errors.push(mapper(issue));
								i++;
								continue;
							}
							if (!Object.prototype.hasOwnProperty.call(curr, el)) Object.defineProperty(curr, el, {
								value: { _errors: [] },
								enumerable: true,
								writable: true,
								configurable: true
							});
							const node = curr[el];
							if (terminal) node._errors.push(mapper(issue));
							curr = node;
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/parse.js
		function finalizeParams(callee, params) {
			return {
				callee: params?.callee ?? callee,
				Err: params?.Err
			};
		}
		const _parse$1 = (_Err) => {
			const fn = (schema, value, _ctx, _params) => {
				const ctx = _ctx ? {
					..._ctx,
					async: false
				} : { async: false };
				const result = schema._zod.run({
					value,
					issues: []
				}, ctx);
				if (result instanceof Promise) throw new $ZodAsyncError$1();
				if (result.issues.length) {
					const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())));
					captureStackTrace$1(e, _params?.callee ?? fn);
					throw e;
				}
				return result.value;
			};
			return fn;
		};
		const _parseAsync$1 = (_Err) => {
			const fn = async (schema, value, _ctx, params) => {
				const ctx = _ctx ? {
					..._ctx,
					async: true
				} : { async: true };
				let result = schema._zod.run({
					value,
					issues: []
				}, ctx);
				if (result instanceof Promise) result = await result;
				if (result.issues.length) {
					const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())));
					captureStackTrace$1(e, params?.callee ?? fn);
					throw e;
				}
				return result.value;
			};
			return fn;
		};
		const _safeParse$1 = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError$1();
			return result.issues.length ? failure(_Err, result.issues, ctx) : {
				success: true,
				data: result.value
			};
		};
		const safeParse$4 = /* @__PURE__*/ _safeParse$1($ZodRealError$1);
		function failure(Err, issues, ctx) {
			let error;
			return {
				success: false,
				get error() {
					if (!error) {
						error = new Err(issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())));
						issues = void 0;
						ctx = void 0;
					}
					return error;
				},
				set error(e) {
					error = e;
					issues = void 0;
					ctx = void 0;
				}
			};
		}
		const _safeParseAsync$1 = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? failure(_Err, result.issues, ctx) : {
				success: true,
				data: result.value
			};
		};
		const COMPILE_INVALID = /* @__PURE__ */ Symbol.for("zod.compile.invalid");
		const COMPILE_FALLBACK = /* @__PURE__ */ Symbol.for("zod.compile.fallback");
		const validate = ((schema, value, _ctx) => {
			const validator = schema._zod.bag.validator;
			if (validator !== void 0) {
				if (validator(value) !== COMPILE_INVALID) return true;
				if (validator.definite === true && _ctx === void 0) return false;
			}
			return validateFallback(schema, value, _ctx);
		});
		function validateFallback(schema, value, _ctx) {
			const ctx = _ctx ? {
				..._ctx,
				async: false,
				abortEarly: true
			} : {
				async: false,
				abortEarly: true
			};
			const fallbackRun = schema._zod.bag.fallbackRun;
			let result;
			if (fallbackRun) {
				ctx[COMPILE_FALLBACK] = true;
				result = fallbackRun({
					value,
					issues: []
				}, ctx);
			} else result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError$1();
			return result.issues.length === 0;
		}
		const validateAsync$1 = async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true,
				abortEarly: true
			} : {
				async: true,
				abortEarly: true
			};
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length === 0;
		};
		const _encode$1 = (_Err) => {
			const parse = _parse$1(_Err);
			const fn = (schema, value, _ctx, _params) => {
				const ctx = _ctx ? {
					..._ctx,
					direction: "backward"
				} : { direction: "backward" };
				return parse(schema, value, ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _decode$1 = (_Err) => {
			const parse = _parse$1(_Err);
			const fn = (schema, value, _ctx, _params) => {
				return parse(schema, value, _ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _encodeAsync$1 = (_Err) => {
			const parseAsync = _parseAsync$1(_Err);
			const fn = async (schema, value, _ctx, _params) => {
				const ctx = _ctx ? {
					..._ctx,
					direction: "backward"
				} : { direction: "backward" };
				return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _decodeAsync$1 = (_Err) => {
			const parseAsync = _parseAsync$1(_Err);
			const fn = async (schema, value, _ctx, _params) => {
				return await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _safeEncode$1 = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse$1(_Err)(schema, value, ctx);
		};
		const _safeDecode$1 = (_Err) => (schema, value, _ctx) => {
			return _safeParse$1(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync$1 = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync$1(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync$1 = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync$1(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid$1 = /^[cC][0-9a-z]{6,}$/;
		const cuid2$1 = /^[0-9a-z]+$/;
		const ulid$1 = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
		const xid$1 = /^[0-9a-vA-V]{20}$/;
		const ksuid$1 = /^[A-Za-z0-9]{27}$/;
		const nanoid$1 = /^[a-zA-Z0-9_-]{21}$/;
		function nanoidOfLength(length) {
			return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
		}
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration$2 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid$1 = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid$1 = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email$1 = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$3 = `^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
		function emoji$1() {
			return new RegExp(_emoji$3, "u");
		}
		const ipv4$1 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6$1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4$1 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6$1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64$1 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url$1 = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
		const httpProtocol$1 = /^https?$/;
		const e164$1 = /^\+[1-9]\d{6,14}$/;
		const dateSource$1 = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		/** Anchors a pattern source. The interpolation lives here rather than at the call site because
		* esbuild will not drop a `@__PURE__` call whose own argument interpolates a variable, but it
		* will drop `anchor(dateSource)`. Keeping it inline pinned `date` into every bundle. */
		function anchor(source) {
			return new RegExp(`^${source}$`);
		}
		const date$2 = /*@__PURE__*/ anchor(dateSource$1);
		function timeSource$1(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time$2(args) {
			return new RegExp(`^${timeSource$1(args)}$`);
		}
		function datetime$3(args) {
			const opts = ["Z"];
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const qualified = `${timeSource$1({
				precision: args.precision,
				seconds: true
			})}(?:${opts.join("|")})`;
			const timeRegex = args.local ? `${qualified}|${timeSource$1({ precision: args.precision })}` : qualified;
			return new RegExp(`^${dateSource$1}T(?:${timeRegex})$`);
		}
		const anyString = /^[\s\S]{0,}$/;
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const boolean$1 = /^(?:true|false)$/i;
		const _null$2 = /^null$/i;
		const _undefined$2 = /^undefined$/i;
		const lowercase$1 = /^[^A-Z]*$/;
		const uppercase$1 = /^[^a-z]*$/;
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/checks.js
		const $ZodCheck$1 = /*@__PURE__*/ $constructor$1("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		/** Default `when` for length-based checks: run only on non-nullish values with a `length`. */
		const _whenHasLength = (payload) => {
			const val = payload.value;
			return !nullish$1(val) && val.length !== void 0;
		};
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor$1("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck$1.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin: numericOriginMap[typeof payload.value] ?? origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor$1("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck$1.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin: numericOriginMap[typeof payload.value] ?? origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor$1("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck$1.init(inst, def);
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
				payload.issues.push({
					origin: typeof payload.value,
					code: "not_multiple_of",
					divisor: def.value,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor$1("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck$1.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (isInt) {
					if (!Number.isInteger(input)) {
						payload.issues.push({
							expected: origin,
							format: def.format,
							code: "invalid_type",
							continue: false,
							input,
							inst
						});
						return;
					}
					if (!Number.isSafeInteger(input)) {
						if (input > 0) payload.issues.push({
							input,
							code: "too_big",
							maximum: Number.MAX_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						else payload.issues.push({
							input,
							code: "too_small",
							minimum: Number.MIN_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						return;
					}
				}
				if (input < minimum) payload.issues.push({
					origin: "number",
					input,
					code: "too_small",
					minimum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
				if (input > maximum) payload.issues.push({
					origin: "number",
					input,
					code: "too_big",
					maximum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMaxLength$1 = /*@__PURE__*/ $constructor$1("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck$1.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
			inst._zod.check = (payload) => {
				const input = payload.value;
				const units = input.length;
				if ((typeof input === "string" && units > def.maximum ? codePointLength(input) : units) <= def.maximum) return;
				const origin = getLengthableOrigin$1(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength$1 = /*@__PURE__*/ $constructor$1("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck$1.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
			inst._zod.check = (payload) => {
				const input = payload.value;
				const units = input.length;
				if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units) >= def.minimum) return;
				const origin = getLengthableOrigin$1(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals$1 = /*@__PURE__*/ $constructor$1("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck$1.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
			inst._zod.check = (payload) => {
				const input = payload.value;
				const units = input.length;
				const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
				if (length === def.length) return;
				const origin = getLengthableOrigin$1(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat$1 = /*@__PURE__*/ $constructor$1("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck$1.init(inst, def);
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex$1 = /*@__PURE__*/ $constructor$1("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat$1.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase$1 = /*@__PURE__*/ $constructor$1("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase$1);
			$ZodCheckStringFormat$1.init(inst, def);
		});
		const $ZodCheckUpperCase$1 = /*@__PURE__*/ $constructor$1("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase$1);
			$ZodCheckStringFormat$1.init(inst, def);
		});
		const $ZodCheckIncludes$1 = /*@__PURE__*/ $constructor$1("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck$1.init(inst, def);
			const escapedRegex = escapeRegex$1(def.includes);
			def.pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith$1 = /*@__PURE__*/ $constructor$1("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck$1.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex$1(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith$1 = /*@__PURE__*/ $constructor$1("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck$1.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex$1(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite$1 = /*@__PURE__*/ $constructor$1("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck$1.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/doc.js
		var Doc$1 = class {
			constructor(args = [], closed = {}) {
				this.content = [];
				this.indent = 0;
				this.args = args;
				this.closed = closed;
			}
			indented(fn) {
				this.indent += 1;
				try {
					fn(this);
				} finally {
					this.indent -= 1;
				}
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const content = this?.content ?? [``];
				return new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${content.join("\n")}\n};`)(...Object.values(this.closed));
			}
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/versions.js
		const version$1 = {
			major: 4,
			minor: 6,
			patch: 5
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/schemas.js
		const $ZodType$1 = /*@__PURE__*/ $constructor$1("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version$1;
			const defChecks = inst._zod.def.checks;
			const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					if (payload.memo) return payload;
					let isAborted = aborted$1(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted$1(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError$1();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							attachSchema(payload.issues, currLen, inst);
							if (!isAborted) isAborted = aborted$1(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							attachSchema(payload.issues, currLen, inst);
							if (!isAborted) isAborted = aborted$1(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted$1(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError$1();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError$1();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
		}, {
			get "~standard"() {
				return hide(this, "~standard", standardProps(this));
			},
			set "~standard"(value) {
				own(this, "~standard", value);
			}
		});
		/** The Standard Schema surface for `inst`. Shared so wrappers can extend it without forcing it. */
		const toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())) } : { value: r.value };
		async function validateAsync(inst, value) {
			const ctx = { async: true };
			return toStandardResult(await inst._zod.run({
				value,
				issues: []
			}, ctx), ctx);
		}
		function standardProps(inst) {
			return {
				validate: (value) => {
					const ctx = { async: false };
					try {
						const r = inst._zod.run({
							value,
							issues: []
						}, ctx);
						if (!(r instanceof Promise)) return toStandardResult(r, ctx);
					} catch (_) {}
					return validateAsync(inst, value);
				},
				vendor: "zod",
				version: 1
			};
		}
		const $ZodString$1 = /*@__PURE__*/ $constructor$1("$ZodString", (inst, def) => {
			$ZodType$1.init(inst, def);
			inst._zod.pattern = def.pattern ?? anyString;
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat$1 = /*@__PURE__*/ $constructor$1("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat$1.init(inst, def);
			$ZodString$1.init(inst, def);
		});
		const $ZodGUID$1 = /*@__PURE__*/ $constructor$1("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid$1);
			$ZodStringFormat$1.init(inst, def);
		});
		const $ZodUUID$1 = /*@__PURE__*/ $constructor$1("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid$1(v));
			} else def.pattern ?? (def.pattern = uuid$1());
			$ZodStringFormat$1.init(inst, def);
		});
		const $ZodEmail$1 = /*@__PURE__*/ $constructor$1("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email$1);
			$ZodStringFormat$1.init(inst, def);
		});
		function canParseURL(input) {
			try {
				if (typeof URL !== "undefined" && typeof URL.canParse === "function") return URL.canParse(input);
				new URL(input);
				return true;
			} catch {
				return false;
			}
		}
		function validateURL(trimmed, def) {
			if (!("normalize" in def) && !("hostname" in def) && !("protocol" in def)) return canParseURL(trimmed) || 2;
			return parseURLObject(trimmed, def);
		}
		/** Parses a URL while preserving the non-normalizing HTTP guard. */
		function parseURLObject(trimmed, def) {
			if (!def.normalize && def.protocol?.source === httpProtocol$1.source && !/^https?:\/\//i.test(trimmed)) return 1;
			try {
				if (typeof URL !== "undefined") {
					const URLStatic = URL;
					if (typeof URLStatic.parse === "function") return URLStatic.parse(trimmed) ?? 2;
				}
				return new URL(trimmed);
			} catch {
				return 2;
			}
		}
		const asciiTabOrNewline = /[\t\n\r]/g;
		/** The URL parser deletes every ASCII tab, LF and CR from its input before it parses, so `new URL("https://exa\nmple.com")` reports on `example.com`. Applying the same deletion to the returned value closes the half of that divergence which can move the host; the parser's other rewrite, stripping C0 controls at the edges, cannot. */
		function stripTabAndNewline(value) {
			return value.replace(asciiTabOrNewline, "");
		}
		function urlHostnameOk(url, hostname) {
			hostname.lastIndex = 0;
			return hostname.test(url.hostname);
		}
		function urlProtocolOk(url, protocol) {
			protocol.lastIndex = 0;
			return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
		}
		const $ZodURL$1 = /*@__PURE__*/ $constructor$1("$ZodURL", (inst, def) => {
			$ZodStringFormat$1.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					const url = validateURL(trimmed, def);
					if (url === 1) {
						payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid URL format",
							input: payload.value,
							inst,
							continue: !def.abort
						});
						return;
					}
					if (url === 2) {
						payload.issues.push({
							code: "invalid_format",
							format: "url",
							input: payload.value,
							inst,
							continue: !def.abort
						});
						return;
					}
					if (url === true) {
						payload.value = stripTabAndNewline(trimmed);
						return;
					}
					if (def.hostname && !urlHostnameOk(url, def.hostname)) payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid hostname",
						pattern: def.hostname.source,
						input: payload.value,
						inst,
						continue: !def.abort
					});
					if (def.protocol && !urlProtocolOk(url, def.protocol)) payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid protocol",
						pattern: def.protocol.source,
						input: payload.value,
						inst,
						continue: !def.abort
					});
					payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji$1 = /*@__PURE__*/ $constructor$1("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji$1());
			$ZodStringFormat$1.init(inst, def);
		});
		const $ZodNanoID$1 = /*@__PURE__*/ $constructor$1("$ZodNanoID", (inst, def) => {
			if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1)) throw new Error(`Invalid nanoid length: ${def.length}`);
			def.pattern ?? (def.pattern = def.length === void 0 ? nanoid$1 : nanoidOfLength(def.length));
			$ZodStringFormat$1.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID$1 = /*@__PURE__*/ $constructor$1("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid$1);
			$ZodStringFormat$1.init(inst, def);
		});
		const $ZodCUID2$1 = /*@__PURE__*/ $constructor$1("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2$1);
			$ZodStringFormat$1.init(inst, def);
		});
		const $ZodULID$1 = /*@__PURE__*/ $constructor$1("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid$1);
			$ZodStringFormat$1.init(inst, def);
		});
		const $ZodXID$1 = /*@__PURE__*/ $constructor$1("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid$1);
			$ZodStringFormat$1.init(inst, def);
		});
		const $ZodKSUID$1 = /*@__PURE__*/ $constructor$1("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid$1);
			$ZodStringFormat$1.init(inst, def);
		});
		const $ZodISODateTime$1 = /*@__PURE__*/ $constructor$1("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime$3(def));
			$ZodStringFormat$1.init(inst, def);
		});
		const $ZodISODate$1 = /*@__PURE__*/ $constructor$1("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date$2);
			$ZodStringFormat$1.init(inst, def);
		});
		const $ZodISOTime$1 = /*@__PURE__*/ $constructor$1("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time$2(def));
			$ZodStringFormat$1.init(inst, def);
		});
		const $ZodISODuration$1 = /*@__PURE__*/ $constructor$1("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration$2);
			$ZodStringFormat$1.init(inst, def);
		});
		const $ZodIPv4$1 = /*@__PURE__*/ $constructor$1("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4$1);
			$ZodStringFormat$1.init(inst, def);
		});
		/** An IPv6 address is written with hex digits, colons and dots, and nothing else. The guard is what makes the check below an IPv6 check: `new URL("http://[...]")` parses an authority, not an address, so `@` and `\` re-delimit it and `"::@1\\"` validates against the host `0.0.0.1`. The URL parser also deletes ASCII tab, LF and CR rather than failing, which is how `"::1\n"` validated as `::1`. */
		const ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
		function isValidIPv6(value) {
			if (!ipv6Alphabet.test(value)) return false;
			return canParseURL(`http://[${value}]`);
		}
		const $ZodIPv6$1 = /*@__PURE__*/ $constructor$1("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6$1);
			$ZodStringFormat$1.init(inst, def);
			inst._zod.check = (payload) => {
				if (!isValidIPv6(payload.value)) payload.issues.push({
					code: "invalid_format",
					format: "ipv6",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCIDRv4$1 = /*@__PURE__*/ $constructor$1("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4$1);
			$ZodStringFormat$1.init(inst, def);
		});
		function isValidCIDRv6(value) {
			const parts = value.split("/");
			if (parts.length !== 2) return false;
			const [address, prefix] = parts;
			if (!prefix) return false;
			const prefixNum = Number(prefix);
			if (`${prefixNum}` !== prefix) return false;
			if (prefixNum < 0 || prefixNum > 128) return false;
			return isValidIPv6(address);
		}
		const $ZodCIDRv6$1 = /*@__PURE__*/ $constructor$1("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6$1);
			$ZodStringFormat$1.init(inst, def);
			inst._zod.check = (payload) => {
				if (!isValidCIDRv6(payload.value)) payload.issues.push({
					code: "invalid_format",
					format: "cidrv6",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64$1(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const base64Charset = /^[0-9a-zA-Z+/]*={0,2}$/;
		const $ZodBase64$1 = /*@__PURE__*/ $constructor$1("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64Charset);
			$ZodStringFormat$1.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidBase64$1(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const base64urlCharset = /^[A-Za-z0-9_-]*$/;
		function isValidBase64URL$1(data) {
			if (!base64urlCharset.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64$1(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL$1 = /*@__PURE__*/ $constructor$1("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64urlCharset);
			$ZodStringFormat$1.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidBase64URL$1(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164$1 = /*@__PURE__*/ $constructor$1("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164$1);
			$ZodStringFormat$1.init(inst, def);
		});
		function isValidJWT$1(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT$1 = /*@__PURE__*/ $constructor$1("$ZodJWT", (inst, def) => {
			$ZodStringFormat$1.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT$1(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodNumber = /*@__PURE__*/ $constructor$1("$ZodNumber", (inst, def) => {
			$ZodType$1.init(inst, def);
			inst._zod.pattern = number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
				payload.issues.push({
					expected: "number",
					code: "invalid_type",
					input,
					inst,
					...received ? { received } : {}
				});
				return payload;
			};
		});
		const $ZodNumberFormat = /*@__PURE__*/ $constructor$1("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodBoolean = /*@__PURE__*/ $constructor$1("$ZodBoolean", (inst, def) => {
			$ZodType$1.init(inst, def);
			inst._zod.pattern = boolean$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Boolean(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "boolean") return payload;
				payload.issues.push({
					expected: "boolean",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodUndefined = /*@__PURE__*/ $constructor$1("$ZodUndefined", (inst, def) => {
			$ZodType$1.init(inst, def);
			inst._zod.pattern = _undefined$2;
			inst._zod.values = /* @__PURE__ */ new Set([void 0]);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (typeof input === "undefined") return payload;
				payload.issues.push({
					expected: "undefined",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodNull = /*@__PURE__*/ $constructor$1("$ZodNull", (inst, def) => {
			$ZodType$1.init(inst, def);
			inst._zod.pattern = _null$2;
			inst._zod.values = /* @__PURE__ */ new Set([null]);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (input === null) return payload;
				payload.issues.push({
					expected: "null",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodAny = /*@__PURE__*/ $constructor$1("$ZodAny", (inst, def) => {
			$ZodType$1.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodUnknown$1 = /*@__PURE__*/ $constructor$1("$ZodUnknown", (inst, def) => {
			$ZodType$1.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever$1 = /*@__PURE__*/ $constructor$1("$ZodNever", (inst, def) => {
			$ZodType$1.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult$1(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues$1(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray$1 = /*@__PURE__*/ $constructor$1("$ZodArray", (inst, def) => {
			$ZodType$1.init(inst, def);
			const memo = globalConfig$1.memoizer;
			memo?.attach(inst);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
				const proms = [];
				const abortEarly = ctx?.abortEarly;
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult$1(result, payload, i)));
					else {
						handleArrayResult$1(result, payload, i);
						if (abortEarly && result.issues.length !== 0 && aborted$1(result)) break;
					}
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult$1(result, final, key, input, optin, optout) {
			const isPresent = key in input;
			const isOptionalOut = optout === "optional";
			if (!isPresent && isOptionalOut && optin === "optional") return;
			if (result.issues.length) {
				if (optin !== void 0 && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues$1(key, result.issues));
			}
			if (!isPresent && optin === void 0) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent || optin === "defaulted" && !isOptionalOut) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		const NO_SYMBOL_KEYS = [];
		function normalizeDef$1(def) {
			const keys = Object.keys(def.shape);
			const ownSymbols = Object.getOwnPropertySymbols(def.shape);
			const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
			const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
			for (const k of allKeys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
			const okeys = optionalKeys$1(def.shape);
			return {
				...def,
				allKeys,
				symbolKeys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall$1(proms, input, payload, ctx, def, inst, abortEarly) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const optin = _catchall.optin;
			const optout = _catchall.optout;
			let seen = 0;
			for (const key in input) {
				if (abortEarly && payload.issues.length !== seen) {
					if (aborted$1(payload, seen)) break;
					seen = payload.issues.length;
				}
				if (keySet.has(key)) continue;
				if (key === "__proto__") {
					if (t === "never") unrecognized.push(key);
					continue;
				}
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult$1(r, payload, key, input, optin, optout)));
				else handlePropertyResult$1(r, payload, key, input, optin, optout);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst,
				continue: true
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const $ZodObject$1 = /*@__PURE__*/ $constructor$1("$ZodObject", (inst, def) => {
			$ZodType$1.init(inst, def);
			const desc = Object.getOwnPropertyDescriptor(def, "shape");
			const sh = desc?.get ? desc.get.raw : def.shape ?? {};
			if (sh) {
				const get = () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					get.raw = newSh;
					return newSh;
				};
				get.raw = sh;
				Object.defineProperty(def, "shape", { get });
			}
			const _normalized = cached$1(() => normalizeDef$1(def));
			defineLazyInternal(inst, "propValues", (zod) => {
				const shape = zod.def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp$1(propValues, key, /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
						if (field.optin !== void 0) propValues[key].add(void 0);
					}
				}
				return propValues;
			});
			const isObject = isObject$1;
			const catchall = def.catchall;
			let value;
			const memo = globalConfig$1.memoizer;
			memo?.attach(inst);
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
				const proms = [];
				const shape = value.shape;
				const abortEarly = ctx?.abortEarly;
				let seen = payload.issues.length;
				for (const key of value.allKeys) {
					if (abortEarly && payload.issues.length !== seen) {
						if (aborted$1(payload, seen)) break;
						seen = payload.issues.length;
					}
					if (key === "__proto__") continue;
					const el = shape[key];
					const optin = el._zod.optin;
					const optout = el._zod.optout;
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult$1(r, payload, key, input, optin, optout)));
					else handlePropertyResult$1(r, payload, key, input, optin, optout);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall$1(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
			};
		});
		const $ZodObjectJIT$1 = /*@__PURE__*/ $constructor$1("$ZodObjectJIT", (inst, def) => {
			$ZodObject$1.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached$1(() => normalizeDef$1(def));
			const memo = globalConfig$1.memoizer;
			const generateFastpass = (shape) => {
				const normalized = _normalized.value;
				const syms = normalized.symbolKeys;
				const doc = new Doc$1(["payload", "ctx"], {
					shape,
					inst,
					memo,
					syms
				});
				const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				const prefixStr = (id, k) => `
          let ${id}_ab = false;
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${id}_ab = true;
          }
          if (${id}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.allKeys) ids[key] = `key_${counter++}`;
				doc.write(memo ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
				for (const key of normalized.allKeys) {
					if (key === "__proto__") continue;
					const id = ids[key];
					const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc$1(key);
					const isPresent = `${k} in input`;
					const schema = shape[key];
					const optin = schema?._zod?.optin;
					const isOptionalIn = optin !== void 0;
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(k)};`);
					if (isOptionalIn && isOptionalOut) {
						const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
						doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					} else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
					else {
						doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
      `);
						if (optin === "defaulted") doc.write(`newResult[${k}] = ${id}.value;`);
						else doc.write(`
        if (${id}.value !== undefined || ${isPresent}) {
          newResult[${k}] = ${id}.value;
        }
      `);
					}
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				return doc.compile();
			};
			let fastpass;
			const isObject = isObject$1;
			const jit = !globalConfig$1.jitless;
			const fastEnabled = jit && allowsEval$1.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall$1([], input, payload, ctx, value, inst, ctx?.abortEarly === true);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults$1(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted$1(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())))
			});
			return final;
		}
		const $ZodUnion$1 = /*@__PURE__*/ $constructor$1("$ZodUnion", (inst, def) => {
			$ZodType$1.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0);
			defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazyInternal(inst, "values", (zod) => {
				if (zod.def.options.every((o) => o._zod.values)) return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazyInternal(inst, "pattern", (zod) => {
				if (zod.def.options.every((o) => o._zod.pattern)) {
					const patterns = zod.def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex$1(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults$1(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults$1(results, payload, inst, ctx);
				});
			};
		});
		function discriminatorMap(def) {
			const map = /* @__PURE__ */ new Map();
			for (const option of def.options) {
				const values = option._zod.propValues?.[def.discriminator];
				if (!values || values.size === 0) throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
				for (const value of values) if (map.has(value)) {
					if (value !== void 0) throw new Error(`Duplicate discriminator value "${String(value)}"`);
					map.set(value, null);
				} else map.set(value, option);
			}
			return map;
		}
		const $ZodDiscriminatedUnion = /*@__PURE__*/ $constructor$1("$ZodDiscriminatedUnion", (inst, def) => {
			def.inclusive = false;
			$ZodUnion$1.init(inst, def);
			const _super = inst._zod.parse;
			defineLazyInternal(inst, "propValues", (zod) => {
				const propValues = {};
				let undefinedCount = 0;
				for (const option of zod.def.options) {
					const pv = option._zod.propValues;
					if (!pv || Object.keys(pv).length === 0) throw new Error(`Invalid discriminated union option at index "${zod.def.options.indexOf(option)}"`);
					if (pv[zod.def.discriminator]?.has(void 0)) undefinedCount++;
					for (const [k, v] of Object.entries(pv)) {
						if (!Object.prototype.hasOwnProperty.call(propValues, k)) assignProp$1(propValues, k, /* @__PURE__ */ new Set());
						for (const val of v) propValues[k].add(val);
					}
				}
				if (!zod.def.unionFallback && undefinedCount > 1) propValues[zod.def.discriminator]?.delete(void 0);
				return propValues;
			});
			def.options.forEach((option, i) => {
				const propShape = rawShape(option._zod.def);
				if (propShape && !Object.prototype.hasOwnProperty.call(propShape, def.discriminator)) throw new Error(`Invalid discriminated union option at index "${i}"`);
			});
			const disc = cached$1(() => discriminatorMap(def));
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!isObject$1(input)) {
					payload.issues.push({
						code: "invalid_type",
						expected: "object",
						input,
						inst
					});
					return payload;
				}
				const value = input?.[def.discriminator];
				const opt = disc.value.get(value);
				if (opt && (value !== void 0 || ctx.direction !== "backward")) return opt._zod.run(payload, ctx);
				if (def.unionFallback || ctx.direction === "backward") return _super(payload, ctx);
				payload.issues.push({
					code: "invalid_union",
					errors: [],
					note: "No matching discriminator",
					discriminator: def.discriminator,
					options: Array.from(disc.value.keys()).filter((value) => disc.value.get(value) !== null),
					input,
					path: [def.discriminator],
					inst
				});
				return payload;
			};
		});
		const $ZodIntersection$1 = /*@__PURE__*/ $constructor$1("$ZodIntersection", (inst, def) => {
			$ZodType$1.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults$1(payload, left, right);
				});
				return handleIntersectionResults$1(payload, left, right);
			};
		});
		function mergeValues$1(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject$1(a) && isPlainObject$1(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				if (Object.prototype.hasOwnProperty.call(newObj, "__proto__")) delete newObj.__proto__;
				for (const key of sharedKeys) {
					if (key === "__proto__") continue;
					const sharedValue = mergeValues$1(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues$1(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults$1(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			const keyIssues = /* @__PURE__ */ new Map();
			const collect = (iss, side) => {
				let keys;
				if (iss.code === "unrecognized_keys" && !iss.path?.length) {
					unrecIssue ?? (unrecIssue = iss);
					keys = iss.keys;
				} else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
					const k = String(iss.path[0]);
					if (!keyIssues.has(k)) keyIssues.set(k, iss);
					keys = [k];
				} else return false;
				for (const k of keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k)[side] = true;
				}
				return true;
			};
			for (const iss of left.issues) if (!collect(iss, "l")) result.issues.push(iss);
			for (const iss of right.issues) if (!collect(iss, "r")) result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length) {
				const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
				if (aggregated.length) result.issues.push({
					...unrecIssue,
					keys: aggregated
				});
				for (const k of bothKeys) if (!aggregated.includes(k) && keyIssues.has(k)) result.issues.push(keyIssues.get(k));
			}
			const merged = mergeValues$1(left.value, right.value);
			if (!merged.valid) {
				if (aborted$1(result)) return result;
				throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			}
			result.value = merged.data;
			return result;
		}
		const $ZodRecord = /*@__PURE__*/ $constructor$1("$ZodRecord", (inst, def) => {
			$ZodType$1.init(inst, def);
			const memo = globalConfig$1.memoizer;
			memo?.attach(inst);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!isPlainObject$1(input)) {
					payload.issues.push({
						expected: "record",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				const proms = [];
				const values = def.keyType._zod.values;
				if (values && !def.partial) {
					payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
					const recordKeys = /* @__PURE__ */ new Set();
					for (const key of values) if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
						recordKeys.add(typeof key === "number" ? key.toString() : key);
						if (key === "__proto__") continue;
						const keyResult = def.keyType._zod.run({
							value: key,
							issues: []
						}, ctx);
						if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
						if (keyResult.issues.length) {
							payload.issues.push({
								code: "invalid_key",
								origin: "record",
								issues: keyResult.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())),
								input: key,
								path: [key],
								inst
							});
							continue;
						}
						const outKey = keyResult.value;
						if (outKey === "__proto__") continue;
						const result = def.valueType._zod.run({
							value: input[key],
							issues: []
						}, ctx);
						if (result instanceof Promise) proms.push(result.then((result) => {
							if (result.issues.length) payload.issues.push(...prefixIssues$1(key, result.issues));
							payload.value[outKey] = result.value;
						}));
						else {
							if (result.issues.length) payload.issues.push(...prefixIssues$1(key, result.issues));
							payload.value[outKey] = result.value;
						}
					}
					let unrecognized;
					for (const key in input) if (!recordKeys.has(key)) {
						if (def.mode === "loose") {
							if (key === "__proto__") continue;
							payload.value[key] = input[key];
						} else {
							unrecognized = unrecognized ?? [];
							unrecognized.push(key);
						}
					}
					if (unrecognized && unrecognized.length > 0) payload.issues.push({
						code: "unrecognized_keys",
						input,
						inst,
						keys: unrecognized,
						continue: true
					});
				} else {
					payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
					let unrecognized;
					for (const key of Reflect.ownKeys(input)) {
						if (key === "__proto__") continue;
						if (!Object.prototype.propertyIsEnumerable.call(input, key)) continue;
						let keyResult = def.keyType._zod.run({
							value: key,
							issues: []
						}, ctx);
						if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
						if (typeof key === "string" && number$1.test(key) && keyResult.issues.length) {
							const retryResult = def.keyType._zod.run({
								value: Number(key),
								issues: []
							}, ctx);
							if (retryResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
							if (retryResult.issues.length === 0) keyResult = retryResult;
						}
						if (keyResult.issues.length) {
							if (def.mode === "loose") payload.value[key] = input[key];
							else if (values) {
								unrecognized = unrecognized ?? [];
								unrecognized.push(key);
							} else payload.issues.push({
								code: "invalid_key",
								origin: "record",
								issues: keyResult.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())),
								input: key,
								path: [key],
								inst
							});
							continue;
						}
						const outKey = keyResult.value;
						if (outKey === "__proto__") continue;
						const result = def.valueType._zod.run({
							value: input[key],
							issues: []
						}, ctx);
						if (result instanceof Promise) proms.push(result.then((result) => {
							if (result.issues.length) payload.issues.push(...prefixIssues$1(key, result.issues));
							payload.value[outKey] = result.value;
						}));
						else {
							if (result.issues.length) payload.issues.push(...prefixIssues$1(key, result.issues));
							payload.value[outKey] = result.value;
						}
					}
					if (unrecognized && unrecognized.length > 0) payload.issues.push({
						code: "unrecognized_keys",
						input,
						inst,
						keys: unrecognized,
						continue: true
					});
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		const $ZodEnum$1 = /*@__PURE__*/ $constructor$1("$ZodEnum", (inst, def) => {
			$ZodType$1.init(inst, def);
			const values = getEnumValues$1(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			defineLazyInternal(inst, "pattern", (zod) => {
				const patternValues = getEnumValues$1(zod.def.entries).filter((k) => propertyKeyTypes$1.has(typeof k));
				return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex$1(o.toString())).join("|")})$` : "^[^\\s\\S]$");
			});
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodLiteral = /*@__PURE__*/ $constructor$1("$ZodLiteral", (inst, def) => {
			$ZodType$1.init(inst, def);
			const values = new Set(def.values);
			inst._zod.values = values;
			defineLazyInternal(inst, "pattern", (zod) => {
				const vals = zod.def.values;
				return new RegExp(vals.length ? `^(${vals.map((o) => typeof o === "string" ? escapeRegex$1(o) : o ? escapeRegex$1(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
			});
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (values.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values: def.values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform$1 = /*@__PURE__*/ $constructor$1("$ZodTransform", (inst, def) => {
			$ZodType$1.init(inst, def);
			inst._zod.optin = "optional";
			globalConfig$1.memoizer?.guard(inst);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError$1(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError$1();
				payload.value = _out;
				return payload;
			};
		});
		function handleOptionalResult$1(payload, result) {
			payload.value = result.issues.length ? void 0 : result.value;
			return payload;
		}
		const $ZodOptional$1 = /*@__PURE__*/ $constructor$1("$ZodOptional", (inst, def) => {
			$ZodType$1.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
			inst._zod.optout = "optional";
			defineLazyInternal(inst, "values", (zod) => {
				const values = zod.def.innerType._zod.values;
				return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
			});
			defineLazyInternal(inst, "pattern", (zod) => {
				const pattern = zod.def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex$1(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === void 0) {
					if (def.innerType._zod.optin !== "defaulted") return payload;
					const result = def.innerType._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) return result.then((result) => handleOptionalResult$1(payload, result));
					return handleOptionalResult$1(payload, result);
				}
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional$1 = /*@__PURE__*/ $constructor$1("$ZodExactOptional", (inst, def) => {
			$ZodOptional$1.init(inst, def);
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable$1 = /*@__PURE__*/ $constructor$1("$ZodNullable", (inst, def) => {
			$ZodType$1.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
			defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
			defineLazyInternal(inst, "pattern", (zod) => {
				const pattern = zod.def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex$1(pattern.source)}|null)$`) : void 0;
			});
			defineLazyInternal(inst, "values", (zod) => {
				return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault$1 = /*@__PURE__*/ $constructor$1("$ZodDefault", (inst, def) => {
			$ZodType$1.init(inst, def);
			inst._zod.optin = "defaulted";
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult$1(result, def));
				return handleDefaultResult$1(result, def);
			};
		});
		function handleDefaultResult$1(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault$1 = /*@__PURE__*/ $constructor$1("$ZodPrefault", (inst, def) => {
			$ZodType$1.init(inst, def);
			inst._zod.optin = "defaulted";
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional$1 = /*@__PURE__*/ $constructor$1("$ZodNonOptional", (inst, def) => {
			$ZodType$1.init(inst, def);
			defineLazyInternal(inst, "values", (zod) => {
				const v = zod.def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult$1(result, inst));
				return handleNonOptionalResult$1(result, inst);
			};
		});
		function handleNonOptionalResult$1(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		function handleCatchResult(payload, result, def, ctx) {
			if (!result.issues.length) {
				payload.value = result.value;
				if (result.memo) payload.memo = true;
				return payload;
			}
			payload.value = def.catchValue({
				...result,
				value: payload.value,
				error: { issues: result.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())) },
				input: payload.value
			});
			return payload;
		}
		const $ZodCatch$1 = /*@__PURE__*/ $constructor$1("$ZodCatch", (inst, def) => {
			$ZodType$1.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
			defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run({
					value: payload.value,
					issues: []
				}, ctx);
				if (result instanceof Promise) return result.then((result) => handleCatchResult(payload, result, def, ctx));
				return handleCatchResult(payload, result, def, ctx);
			};
		});
		const $ZodPipe$1 = /*@__PURE__*/ $constructor$1("$ZodPipe", (inst, def) => {
			$ZodType$1.init(inst, def);
			defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
			defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
			defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
			defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult$1(right, def.in, ctx));
					return handlePipeResult$1(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult$1(left, def.out, ctx));
				return handlePipeResult$1(left, def.out, ctx);
			};
		});
		function handlePipeResult$1(left, next, ctx) {
			if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues
			}, ctx);
		}
		const $ZodPreprocess = /*@__PURE__*/ $constructor$1("$ZodPreprocess", (inst, def) => {
			$ZodPipe$1.init(inst, def);
		});
		const $ZodReadonly$1 = /*@__PURE__*/ $constructor$1("$ZodReadonly", (inst, def) => {
			$ZodType$1.init(inst, def);
			defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
			defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult$1);
				return handleReadonlyResult$1(result);
			};
		});
		function handleReadonlyResult$1(payload) {
			if (!payload.memo) payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom$1 = /*@__PURE__*/ $constructor$1("$ZodCustom", (inst, def) => {
			$ZodCheck$1.init(inst, def);
			$ZodType$1.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult$1(r, payload, input, inst));
				handleRefineResult$1(r, payload, input, inst);
			};
		});
		function handleRefineResult$1(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue$1(_iss));
			}
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/memoizer.js
		var $ZodCyclicError = class extends Error {
			constructor() {
				super(`Cannot parse a reference cycle that closes through a transform`);
				this.name = "ZodCyclicError";
			}
		};
		/** Keyed off the context object every schema in one parse call already shares. */
		const STATE = "~memo";
		const NO_ISSUES = [];
		function isRef(value) {
			return value !== null && typeof value === "object";
		}
		function cloneIssues(issues) {
			return issues.map((iss) => iss.path ? {
				...iss,
				path: iss.path.slice()
			} : { ...iss });
		}
		const recursive = /*@__PURE__*/ new WeakMap();
		/** What the walk established, in order of certainty: ordered so the strongest answer among children wins. */
		const NONE = 0;
		const ASSUMED = 1;
		const PROVEN = 2;
		/** Whether this schema's subtree contains a cycle, so one parse can re-enter it. */
		function isRecursive(inst, stack, resolve) {
			const cached = recursive.get(inst);
			if (cached !== void 0) return cached ? PROVEN : NONE;
			if (stack.has(inst)) return PROVEN;
			stack.add(inst);
			let result = NONE;
			const check = (child) => {
				if (result !== PROVEN && child?._zod) {
					const answer = isRecursive(child, stack, resolve);
					if (answer > result) result = answer;
				}
			};
			const shape = (sh, spread) => {
				let answer = NONE;
				for (const key of Reflect.ownKeys(sh)) {
					const desc = Object.getOwnPropertyDescriptor(sh, key);
					if (spread && !desc.enumerable) continue;
					const child = desc.get ? ASSUMED : desc.value?._zod ? isRecursive(desc.value, stack, resolve) : NONE;
					if (child > answer) answer = child;
				}
				return answer;
			};
			const merge = (answer) => {
				if (answer > result) result = answer;
			};
			const def = inst._zod.def;
			switch (def.type) {
				case "object": {
					const raw = rawShape(def);
					merge(raw ? shape(raw, true) : ASSUMED);
					check(def.catchall);
					break;
				}
				case "array":
					check(def.element);
					break;
				case "tuple":
					for (const el of def.items) check(el);
					check(def.rest);
					break;
				case "record":
				case "map":
					check(def.keyType);
					check(def.valueType);
					break;
				case "set":
					check(def.valueType);
					break;
				case "union":
					for (const el of def.options) check(el);
					break;
				case "intersection":
					check(def.left);
					check(def.right);
					break;
				case "optional":
				case "nullable":
				case "default":
				case "prefault":
				case "catch":
				case "readonly":
				case "nonoptional":
				case "promise":
				case "success":
					check(def.innerType);
					break;
				case "pipe":
					check(def.in);
					check(def.out);
					break;
				case "function":
					check(def.input);
					check(def.output);
					break;
				case "lazy": {
					const inner = def._cachedInner ?? (resolve ? inst._zod.innerType : void 0);
					merge(inner ? isRecursive(inner, stack, false) : ASSUMED);
					break;
				}
				case "template_literal":
				case "string":
				case "number":
				case "int":
				case "boolean":
				case "bigint":
				case "symbol":
				case "undefined":
				case "null":
				case "void":
				case "never":
				case "any":
				case "unknown":
				case "date":
				case "nan":
				case "enum":
				case "literal":
				case "file":
				case "transform":
				case "custom": break;
				default: for (const key in def) {
					const desc = Object.getOwnPropertyDescriptor(def, key);
					if (!desc || desc.get) continue;
					const value = desc.value;
					if (!value || typeof value !== "object") continue;
					if (value._zod) check(value);
					else if (Array.isArray(value)) for (const el of value) check(el);
				}
			}
			stack.delete(inst);
			return settle(inst, result);
		}
		/** An assumed answer must not outlive the resolution that settles it, so only a certain one is cached. */
		function settle(inst, answer) {
			if (answer !== ASSUMED) recursive.set(inst, answer === PROVEN);
			return answer;
		}
		function bucketFor(state, inst) {
			let bucket = state.buckets.get(inst);
			if (!bucket) {
				bucket = /* @__PURE__ */ new WeakMap();
				state.buckets.set(inst, bucket);
			}
			return bucket;
		}
		let handoff;
		const open = [];
		const memo = {
			alloc(_inst, payload, empty) {
				const bucket = handoff;
				if (!bucket) return empty;
				handoff = void 0;
				const entry = {
					value: empty,
					issues: null
				};
				bucket.set(payload.value, entry);
				open.push(entry);
				return empty;
			},
			guard(inst) {
				var _a;
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred.push(() => {
					const base = inst._zod.parse;
					const wrapped = (payload, ctx) => {
						if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value)) throw new $ZodCyclicError();
						return base(payload, ctx);
					};
					inst._zod.parse = wrapped;
					if (inst._zod.run === base) inst._zod.run = wrapped;
				});
			},
			attach(inst) {
				var _a;
				let isRecursiveInst;
				let rechecked = false;
				let lastCtx;
				let lastBucket;
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred.push(() => {
					const base = inst._zod.parse;
					const wrapped = (payload, ctx) => {
						if (isRecursiveInst === void 0) {
							const walked = isRecursive(inst, /* @__PURE__ */ new Set(), false);
							if (walked === NONE) {
								inst._zod.parse = base;
								if (inst._zod.run === wrapped) inst._zod.run = base;
								return base(payload, ctx);
							}
							if (walked === PROVEN || rechecked) isRecursiveInst = true;
							else rechecked = true;
						}
						const input = payload.value;
						if (!isRef(input)) return base(payload, ctx);
						let state = ctx[STATE];
						if (!state) {
							state = {
								buckets: /* @__PURE__ */ new WeakMap(),
								backEdges: void 0
							};
							ctx[STATE] = state;
						}
						let bucket;
						if (lastCtx === ctx) bucket = lastBucket;
						else {
							bucket = bucketFor(state, inst);
							lastCtx = ctx;
							lastBucket = bucket;
						}
						const hit = bucket.get(input);
						if (hit) {
							payload.value = hit.value;
							if (hit.issues) {
								if (hit.issues.length) payload.issues.push(...cloneIssues(hit.issues));
							} else {
								payload.memo = true;
								state.backEdges ?? (state.backEdges = /* @__PURE__ */ new WeakSet());
								state.backEdges.add(hit.value);
							}
							return payload;
						}
						handoff = bucket;
						const depth = open.length;
						const result = base(payload, ctx);
						handoff = void 0;
						const entry = open.length > depth ? open.pop() : void 0;
						if (result instanceof Promise) return result.then((r) => {
							if (entry) entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
							return r;
						});
						if (entry) entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
						return result;
					};
					inst._zod.parse = wrapped;
					if (inst._zod.run === base) inst._zod.run = wrapped;
				});
			}
		};
		/** The memoizer that gives containers cycle support. `zod` installs it by default; `zod/mini` opts in with `config({ memoizer: memoizer() })`. */
		function memoizer() {
			return memo;
		}
		/** Whether this value is a node a back-edge resolved to before it finished. */
		function isBackEdge(ctx, value) {
			const backEdges = ctx[STATE]?.backEdges;
			return backEdges !== void 0 && isRef(value) && backEdges.has(value);
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/en.js
		const error = () => {
			const Sizable = {
				string: {
					unit: "characters",
					verb: "to have"
				},
				file: {
					unit: "bytes",
					verb: "to have"
				},
				array: {
					unit: "items",
					verb: "to have"
				},
				set: {
					unit: "items",
					verb: "to have"
				},
				map: {
					unit: "entries",
					verb: "to have"
				}
			};
			function getSizing(origin) {
				return Sizable[origin] ?? null;
			}
			const FormatDictionary = {
				regex: "input",
				email: "email address",
				url: "URL",
				emoji: "emoji",
				uuid: "UUID",
				uuidv4: "UUIDv4",
				uuidv6: "UUIDv6",
				nanoid: "nanoid",
				guid: "GUID",
				cuid: "cuid",
				cuid2: "cuid2",
				ulid: "ULID",
				xid: "XID",
				ksuid: "KSUID",
				datetime: "ISO datetime",
				date: "ISO date",
				time: "ISO time",
				duration: "ISO duration",
				ipv4: "IPv4 address",
				ipv6: "IPv6 address",
				mac: "MAC address",
				cidrv4: "IPv4 range",
				cidrv6: "IPv6 range",
				base64: "base64-encoded string",
				base64url: "base64url-encoded string",
				json_string: "JSON string",
				e164: "E.164 number",
				currency_code: "currency code",
				credit_card: "credit card number",
				iban: "IBAN",
				jwt: "JWT",
				template_literal: "input"
			};
			const TypeDictionary = { nan: "NaN" };
			function getTypeName(type, input) {
				if (type === "number" && typeof input === "number" && !Number.isFinite(input)) return String(input);
				return TypeDictionary[type] ?? type;
			}
			return (issue) => {
				switch (issue.code) {
					case "invalid_type": return `Invalid input: expected ${getTypeName(issue.expected)}, received ${getTypeName(parsedType(issue.input), issue.input)}`;
					case "invalid_value":
						if (issue.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
						return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
					case "too_big": {
						const adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<";
						const sizing = getSizing(issue.origin);
						if (sizing) return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
						return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
					}
					case "too_small": {
						const adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">";
						const sizing = getSizing(issue.origin);
						if (sizing) return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
						return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
					}
					case "invalid_format": {
						const _issue = issue;
						if (_issue.format === "starts_with") return `Invalid string: must start with "${_issue.prefix}"`;
						if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
						if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
						if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
						return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
					}
					case "not_multiple_of": return `Invalid number: must be a multiple of ${issue.divisor}`;
					case "unrecognized_keys": return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
					case "invalid_key": return `Invalid key in ${issue.origin}`;
					case "invalid_union":
						if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `Invalid discriminator value. Expected ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
						if (issue.inclusive === false) return "Invalid input: more than one option matched";
						return "Invalid input";
					case "invalid_element": return `Invalid value in ${issue.origin}`;
					default: return `Invalid input`;
				}
			};
		};
		function en_default() {
			return { localeError: error() };
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/registries.js
		var _a$2;
		var $ZodRegistry$1 = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry$1() {
			return new $ZodRegistry$1();
		}
		(_a$2 = globalThis).__zod_globalRegistry ?? (_a$2.__zod_globalRegistry = registry$1());
		const globalRegistry$1 = globalThis.__zod_globalRegistry;
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/api.js
		function snapshotChecks(def) {
			if (def.checks) def.checks = [...def.checks];
			return def;
		}
		// @__NO_SIDE_EFFECTS__
		function _string$1(Class, params) {
			return new Class(snapshotChecks({
				type: "string",
				...normalizeParams$1(params)
			}));
		}
		// @__NO_SIDE_EFFECTS__
		function _email$1(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid$1(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid$1(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4$1(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6$1(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7$1(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url$1(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji$2(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid$1(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid$1(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2$1(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid$1(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid$1(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid$1(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4$1(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6$1(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4$1(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6$1(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64$1(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url$1(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164$1(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt$1(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime$1(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate$1(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime$1(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration$1(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class(snapshotChecks({
				type: "number",
				checks: [],
				...normalizeParams$1(params)
			}));
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _boolean(Class, params) {
			return new Class({
				type: "boolean",
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _undefined$1(Class, params) {
			return new Class({
				type: "undefined",
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _null$1(Class, params) {
			return new Class({
				type: "null",
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _any(Class) {
			return new Class({ type: "any" });
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown$1(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never$1(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams$1(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams$1(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams$1(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams$1(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams$1(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength$1(maximum, params) {
			return new $ZodCheckMaxLength$1({
				check: "max_length",
				...normalizeParams$1(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength$1(minimum, params) {
			return new $ZodCheckMinLength$1({
				check: "min_length",
				...normalizeParams$1(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length$1(length, params) {
			return new $ZodCheckLengthEquals$1({
				check: "length_equals",
				...normalizeParams$1(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex$1(pattern, params) {
			return new $ZodCheckRegex$1({
				check: "string_format",
				format: "regex",
				...normalizeParams$1(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase$1(params) {
			return new $ZodCheckLowerCase$1({
				check: "string_format",
				format: "lowercase",
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase$1(params) {
			return new $ZodCheckUpperCase$1({
				check: "string_format",
				format: "uppercase",
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes$1(includes, params) {
			return new $ZodCheckIncludes$1({
				check: "string_format",
				format: "includes",
				...normalizeParams$1(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith$1(prefix, params) {
			return new $ZodCheckStartsWith$1({
				check: "string_format",
				format: "starts_with",
				...normalizeParams$1(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith$1(suffix, params) {
			return new $ZodCheckEndsWith$1({
				check: "string_format",
				format: "ends_with",
				...normalizeParams$1(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite$1(tx) {
			return new $ZodCheckOverwrite$1({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize$1(form) {
			return /* @__PURE__ */ _overwrite$1((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim$1() {
			return /* @__PURE__ */ _overwrite$1((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase$1() {
			return /* @__PURE__ */ _overwrite$1((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase$1() {
			return /* @__PURE__ */ _overwrite$1((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify$1() {
			return /* @__PURE__ */ _overwrite$1((input) => slugify$1(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array$1(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams$1(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _custom(Class, fn, _params) {
			const norm = normalizeParams$1(_params);
			norm.abort ?? (norm.abort = true);
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...norm
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine$1(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams$1(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine$1(fn, params) {
			const ch = /* @__PURE__ */ _check$1((payload) => {
				payload.addIssue = (issue) => {
					if (typeof issue === "string") payload.issues.push(issue$1(issue, payload.value, ch._zod.def));
					else {
						const _issue = issue;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						if (!("input" in _issue)) _issue.input = payload.value;
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue$1(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check$1(fn, params) {
			const ch = new $ZodCheck$1({
				check: "custom",
				...normalizeParams$1(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/to-json-schema.js
		function assignProps(target, ...sources) {
			for (const source of sources) for (const key of Reflect.ownKeys(source)) if (Object.prototype.propertyIsEnumerable.call(source, key)) assignProp$1(target, key, source[key]);
			return target;
		}
		function initializeContext$1(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry$1,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				sharedDefsExtractedFor: void 0,
				sharedEmitDoneFor: void 0,
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				intersections: [],
				deferred: [],
				external: params?.external ?? void 0
			};
		}
		/**
		* Applies the `unrepresentable` setting at a site that has no JSON Schema equivalent. Throws
		* `message` unless the setting (or the handler's return value) says otherwise. Returns `true` if a
		* custom JSON Schema was written into `json`, in which case the caller must not write its own.
		*/
		function handleUnrepresentable(schema, ctx, json, params, message) {
			const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({
				zodSchema: schema,
				path: params.path,
				message
			}) : ctx.unrepresentable;
			if (result === "any") return false;
			if (result === void 0 || result === "throw") throw new Error(message);
			Object.assign(json, result);
			return true;
		}
		function processSchema(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			ctx.sharedDefsExtractedFor = void 0;
			ctx.sharedEmitDoneFor = void 0;
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					processSchema(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) assignProps(result.schema, meta);
			if (ctx.io === "input" && isTransforming$1(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function encodeJSONPointerSegment(segment) {
			return segment.replace(/~/g, "~0").replace(/\//g, "~1");
		}
		function extractDefs$1(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external) return;
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}`
					};
				}
				const uriPrefix = `#`;
				const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
				if (entry[1] === root && !entry[1].schema.id) return { ref: uriPrefix };
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + encodeJSONPointerSegment(defId)
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") extractToDef(entry);
				}
			}
			if (ctx.external) ctx.sharedDefsExtractedFor = ctx.external;
		}
		/** Rewrites `anyOf: [{type: "a"}, {type: "b"}]` to `type: ["a", "b"]`, which every JSON Schema draft treats as equivalent and most consumers render far better for the nullable case. Only branches that are a bare type assertion qualify — anything carrying a constraint, `$ref`, `const` or metadata is left alone. Runs after `flattenRef`, so a branch an override decorated or `$defs` extraction turned into a `$ref` is no longer bare and correctly stays in `anyOf`. `oneOf` is excluded: `integer` and `number` overlap, so "exactly one" and "at least one" are not the same there. OpenAPI 3.0 is excluded: its `type` must be a single string. */
		function compactTypeUnion(schema) {
			const options = schema.anyOf;
			if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0) return;
			const types = [];
			for (const option of options) {
				if (!option || typeof option !== "object") return;
				compactTypeUnion(option);
				const keys = Object.keys(option);
				if (keys.length !== 1 || keys[0] !== "type") return;
				const type = option.type;
				for (const member of Array.isArray(type) ? type : [type]) {
					if (typeof member !== "string") return;
					if (!types.includes(member)) types.push(member);
				}
			}
			delete schema.anyOf;
			schema.type = types.length === 1 ? types[0] : types;
		}
		/** Keywords `foldIntersection` knows how to combine. Anything else — `$ref`, `patternProperties`,
		* an annotation like `description` — makes a member unfoldable, so a constraint this does not
		* understand leaves the `allOf` alone instead of being silently dropped or misattributed. */
		const FOLDABLE_KEYS = /* @__PURE__ */ new Set([
			"type",
			"properties",
			"required",
			"additionalProperties"
		]);
		const UNION_KEYS = ["oneOf", "anyOf"];
		/** A member's constraint on a key it does not declare itself. A `catchall` states one; `false`, an absent `additionalProperties`, and the empty schema a loose object emits state nothing. */
		function undeclaredConstraint(member) {
			const extra = member.additionalProperties;
			if (extra === void 0 || extra === false || typeof extra !== "object" || extra === null) return null;
			return Object.keys(extra).length ? extra : null;
		}
		/** Combines object members into the single object they describe together, or returns `null` if any of them carries a keyword outside {@link FOLDABLE_KEYS}. */
		function foldObjects(members) {
			const objects = [];
			for (const member of members) {
				if (typeof member !== "object" || member.type !== "object") return null;
				for (const key in member) if (!FOLDABLE_KEYS.has(key)) return null;
				objects.push(member);
			}
			const properties = {};
			const required = /* @__PURE__ */ new Set();
			for (const object of objects) {
				for (const key in object.properties) {
					if (Object.prototype.hasOwnProperty.call(properties, key)) continue;
					const parts = [];
					for (const other of objects) {
						const part = other.properties?.[key] ?? undeclaredConstraint(other);
						if (part === null || part === void 0) continue;
						if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part))) parts.push(part);
					}
					assignProp$1(properties, key, parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts });
				}
				for (const key of object.required ?? []) required.add(key);
			}
			const folded = {
				type: "object",
				properties
			};
			if (required.size) folded.required = [...required];
			if (objects.every((object) => object.additionalProperties === false)) folded.additionalProperties = false;
			else {
				const constraints = [];
				for (const object of objects) {
					const constraint = undeclaredConstraint(object);
					if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint))) constraints.push(constraint);
				}
				if (constraints.length === 1) folded.additionalProperties = constraints[0];
				else if (constraints.length > 1) folded.additionalProperties = { allOf: constraints };
			}
			return folded;
		}
		/** `additionalProperties` in an `allOf` member sees only that member's own `properties`, so two
		* closed object members reject each other's keys and the schema validates nothing. Zod's parser
		* pools the key sets instead — `handleIntersectionResults` reports a key as unrecognized only when
		* *every* side rejects it — so the emitted schema has to pool them too, and folding the members
		* into one object is the encoding that says so on every target.
		*
		* This runs from `finalize`, after `extractDefs`, which is what keeps it clear of the `$ref`
		* machinery: a member extracted into `$defs` is already a `$ref` by now and declines to fold, so it
		* keeps its reference and its own closedness rather than being inlined as a stale copy. */
		function foldIntersection(json) {
			const allOf = json.allOf;
			if (!Array.isArray(allOf) || allOf.length < 2) return;
			for (const key of FOLDABLE_KEYS) if (key in json) return;
			const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
			let folded = null;
			if (!unions.length) folded = foldObjects(allOf);
			else {
				const union = unions[0];
				const keyword = UNION_KEYS.find((k) => Array.isArray(union[k]));
				if (Object.keys(union).length !== 1) return;
				const rest = allOf.filter((m) => m !== union);
				const branches = union[keyword].map((branch) => foldObjects([...rest, branch]));
				if (branches.some((b) => !b)) return;
				folded = { [keyword]: branches };
			}
			if (!folded) return;
			delete json.allOf;
			assignProps(json, folded);
		}
		function finalize$1(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else assignProps(schema, refSchema);
					assignProps(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
				for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
				if (ctx.target !== "openapi-3.0") for (const entry of ctx.seen.entries()) compactTypeUnion(entry[1].def ?? entry[1].schema);
				for (const rewrite of ctx.deferred) rewrite();
				if (ctx.intersections.length) {
					const carriers = /* @__PURE__ */ new Map();
					for (const seen of ctx.seen.values()) for (const json of [seen.schema, seen.def]) {
						const allOf = json?.allOf;
						if (!Array.isArray(allOf)) continue;
						const existing = carriers.get(allOf);
						if (existing) existing.push(json);
						else carriers.set(allOf, [json]);
					}
					for (const allOf of ctx.intersections) for (const json of carriers.get(allOf) ?? []) foldIntersection(json);
				}
			}
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					assignProp$1(defs, seen.defId, seen.def);
				}
			}
			if (ctx.external) ctx.sharedEmitDoneFor = ctx.external;
			if (ctx.external) {} else if (Object.keys(defs).length > 0) {
				if (ctx.target === "draft-2020-12") result.$defs = defs;
				else result.definitions = defs;
			}
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod$1(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod$1(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming$1(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming$1(def.element, ctx);
			if (def.type === "set") return isTransforming$1(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming$1(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") return isTransforming$1(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming$1(def.left, ctx) || isTransforming$1(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming$1(def.keyType, ctx) || isTransforming$1(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming$1(def.in, ctx) || isTransforming$1(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming$1(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming$1(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming$1(item, ctx)) return true;
				if (def.rest && isTransforming$1(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod$1 = (schema, processors = {}) => (params) => {
			const ctx = initializeContext$1({
				...params,
				processors
			});
			processSchema(schema, ctx);
			extractDefs$1(ctx, schema);
			return finalize$1(ctx, schema);
		};
		const createStandardJSONSchemaMethod$1 = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext$1({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			processSchema(schema, ctx);
			extractDefs$1(ctx, schema);
			return finalize$1(ctx, schema);
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/json-schema-processors.js
		const narrowMin = (agg, key, value) => {
			if (agg[key] === void 0 || value > agg[key]) agg[key] = value;
		};
		const narrowMax = (agg, key, value) => {
			if (agg[key] === void 0 || value < agg[key]) agg[key] = value;
		};
		const narrowBoth = (agg, value) => {
			narrowMin(agg, "minimum", value);
			narrowMax(agg, "maximum", value);
		};
		const addDivisor = (agg, value) => {
			agg.multipleOf ?? (agg.multipleOf = []);
			if (!agg.multipleOf.includes(value)) agg.multipleOf.push(value);
		};
		const addPattern = (agg, pattern) => {
			agg.patterns ?? (agg.patterns = /* @__PURE__ */ new Set());
			agg.patterns.add(pattern);
		};
		const intersectMime = (agg, mime) => {
			agg.mime = agg.mime ? agg.mime.filter((m) => mime.includes(m)) : [...mime];
		};
		const setFormat = (agg, format) => {
			agg.format = format;
			if (format.includes("int")) agg.isInt = true;
		};
		const minContributor = (agg, def) => narrowMin(agg, "minimum", def.minimum);
		const maxContributor = (agg, def) => narrowMax(agg, "maximum", def.maximum);
		const formatContributor = (ranges) => (agg, def) => {
			setFormat(agg, def.format);
			const [minimum, maximum] = ranges[def.format];
			narrowMin(agg, "minimum", minimum);
			narrowMax(agg, "maximum", maximum);
		};
		const contributors = {
			greater_than: (agg, def) => narrowMin(agg, def.inclusive ? "minimum" : "exclusiveMinimum", def.value),
			less_than: (agg, def) => narrowMax(agg, def.inclusive ? "maximum" : "exclusiveMaximum", def.value),
			multiple_of: (agg, def) => addDivisor(agg, def.value),
			number_format: formatContributor(NUMBER_FORMAT_RANGES),
			bigint_format: formatContributor(BIGINT_FORMAT_RANGES),
			min_length: minContributor,
			max_length: maxContributor,
			length_equals: (agg, def) => narrowBoth(agg, def.length),
			min_size: minContributor,
			max_size: maxContributor,
			size_equals: (agg, def) => narrowBoth(agg, def.size),
			string_format: (agg, def) => {
				setFormat(agg, def.format);
				if (def.pattern) addPattern(agg, def.pattern);
				if (def.format === "base64" || def.format === "base64url") agg.contentEncoding = def.format;
				if (def.local || def.precision === -1) agg.laxFormat = true;
			},
			mime_type: (agg, def) => intersectMime(agg, def.mime)
		};
		function aggregateChecks(schema) {
			const agg = {};
			const def = schema._zod.def;
			const list = schema._zod.traits.has("$ZodCheck") ? [schema, ...def.checks ?? []] : def.checks ?? [];
			for (const ch of list) contributors[ch._zod.def.check]?.(agg, ch._zod.def);
			const bag = schema._zod.bag;
			if (bag.minimum !== void 0) narrowMin(agg, "minimum", bag.minimum);
			if (bag.exclusiveMinimum !== void 0) narrowMin(agg, "exclusiveMinimum", bag.exclusiveMinimum);
			if (bag.maximum !== void 0) narrowMax(agg, "maximum", bag.maximum);
			if (bag.exclusiveMaximum !== void 0) narrowMax(agg, "exclusiveMaximum", bag.exclusiveMaximum);
			if (bag.multipleOf !== void 0) addDivisor(agg, bag.multipleOf);
			if (bag.format !== void 0) {
				agg.format ?? (agg.format = bag.format);
				if (bag.format.includes("int")) agg.isInt = true;
			}
			if (bag.mime) intersectMime(agg, bag.mime);
			for (const pattern of bag.patterns ?? []) addPattern(agg, pattern);
			return agg;
		}
		const formatMap$1 = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const exactPatterns = /* @__PURE__ */ new Map([[base64Charset, base64$1], [base64urlCharset, base64url$1]]);
		const exactPattern = (p) => exactPatterns.get(p) ?? p;
		const stringProcessor$1 = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks(schema);
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap$1[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time" || laxFormat) delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const patternList = [...patterns].map(exactPattern);
				if (patternList.length === 1) json.pattern = patternList[0].source;
				else if (patternList.length > 1) json.allOf = [...patternList.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const { minimum, maximum, multipleOf, exclusiveMaximum, exclusiveMinimum, isInt } = aggregateChecks(schema);
			json.type = isInt ? "integer" : "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) {
				if (legacy) {
					json.minimum = exclusiveMinimum;
					json.exclusiveMinimum = true;
				} else json.exclusiveMinimum = exclusiveMinimum;
			} else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) {
				if (legacy) {
					json.maximum = exclusiveMaximum;
					json.exclusiveMaximum = true;
				} else json.exclusiveMaximum = exclusiveMaximum;
			} else if (typeof maximum === "number") json.maximum = maximum;
			if (multipleOf) {
				const divisors = /* @__PURE__ */ new Set();
				for (const divisor of multipleOf) if (Number.isFinite(divisor) && divisor !== 0) divisors.add(Math.abs(divisor));
				else handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${divisor} cannot be represented in JSON Schema`);
				const [first, ...rest] = divisors;
				if (first !== void 0) json.multipleOf = first;
				if (rest.length) json.allOf = [...json.allOf ?? [], ...rest.map((m) => ({ multipleOf: m }))];
			}
		};
		const booleanProcessor = (_schema, _ctx, json, _params) => {
			json.type = "boolean";
		};
		const nullProcessor = (_schema, ctx, json, _params) => {
			if (ctx.target === "openapi-3.0") {
				json.type = "string";
				json.nullable = true;
				json.enum = [null];
			} else json.type = "null";
		};
		const undefinedProcessor = (schema, ctx, json, params) => {
			handleUnrepresentable(schema, ctx, json, params, "Undefined cannot be represented in JSON Schema");
		};
		const neverProcessor$1 = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor$1 = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues$1(def.entries);
			if (values.length === 0) {
				json.not = {};
				return;
			}
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const literalProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			if (def.values.length === 0) {
				json.not = {};
				return;
			}
			const vals = [];
			for (const val of def.values) if (val === void 0) {
				if (handleUnrepresentable(schema, ctx, json, params, "Literal `undefined` cannot be represented in JSON Schema")) return;
			} else if (typeof val === "bigint") {
				if (handleUnrepresentable(schema, ctx, json, params, "BigInt literals cannot be represented in JSON Schema")) return;
				vals.push(Number(val));
			} else vals.push(val);
			if (vals.length === 0) {} else if (vals.length === 1) {
				const val = vals[0];
				json.type = val === null ? "null" : typeof val;
				if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
				else json.const = val;
			} else {
				if (vals.every((v) => typeof v === "number")) json.type = "number";
				if (vals.every((v) => typeof v === "string")) json.type = "string";
				if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
				if (vals.every((v) => v === null)) json.type = "null";
				json.enum = vals;
			}
		};
		const customProcessor$1 = (schema, ctx, json, params) => {
			handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor$1 = (schema, ctx, json, params) => {
			handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor$1 = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = aggregateChecks(schema);
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = processSchema(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		function inputOptin(schema) {
			const def = schema._zod.def;
			if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) return inputOptin(def.out);
			if (def.type === "catch") return inputOptin(def.innerType);
			return schema._zod.optin;
		}
		const objectProcessor$1 = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const shape = def.shape;
			if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) return;
			json.type = "object";
			json.properties = {};
			for (const key in shape) assignProp$1(json.properties, key, processSchema(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			}));
			const requiredKeys = [];
			for (const key of Object.keys(shape)) {
				const field = def.shape[key];
				if (ctx.io === "input" ? inputOptin(field) === void 0 : field._zod.optout === void 0) requiredKeys.push(key);
			}
			if (requiredKeys.length > 0) json.required = requiredKeys;
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = processSchema(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor$1 = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => processSchema(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor$1 = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = processSchema(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = processSchema(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			const allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
			json.allOf = allOf;
			ctx.intersections.push(allOf);
		};
		/** JSON object keys are always strings, so a numeric record key schema is re-expressed over the
		* numeric-string form the record parser matches. Deferred to `finalize`, after the flatten: a key
		* behind a wrapper only carries its own `type` before then, and a union key only has its branches.
		*
		* A numeric bound cannot apply to a property name, so `minimum` and its siblings are dropped rather
		* than carried over: keeping them beside `type: "string"` reproduces the match-nothing schema this
		* exists to fix. A key that carries one therefore emits wider than the record parses — `z.record(z.number().min(5), V)`
		* accepts `"3"` — which is the deliberate trade, since throwing on it would reject an ordinary schema
		* outright. */
		function stringifyKeyNames(bySchema, json, visited) {
			if (json.$ref) {
				if (visited.has(json)) return json;
				visited.add(json);
				const def = bySchema.get(json)?.def;
				if (!def) return json;
				const inlined = stringifyKeyNames(bySchema, def, visited);
				return inlined === def ? json : inlined;
			}
			for (const keyword of ["anyOf", "oneOf"]) {
				const branches = json[keyword];
				if (!Array.isArray(branches)) continue;
				const mapped = branches.map((branch) => stringifyKeyNames(bySchema, branch, visited));
				if (mapped.some((branch, i) => branch !== branches[i])) json = {
					...json,
					[keyword]: mapped
				};
			}
			const types = Array.isArray(json.type) ? json.type : [json.type];
			const numericType = !types.includes("string") && types.some((t) => t === "number" || t === "integer");
			const values = json.enum ?? (json.const !== void 0 ? [json.const] : void 0);
			if (!numericType && !values?.some((v) => typeof v === "number")) return json;
			const { minimum, maximum, exclusiveMinimum, exclusiveMaximum, multipleOf, format, id, ...rest } = json;
			if (rest.enum) rest.enum = rest.enum.map((v) => typeof v === "number" ? String(v) : v);
			else if (typeof rest.const === "number") rest.const = String(rest.const);
			if (!numericType) return rest;
			rest.type = "string";
			if (!values) rest.pattern = (types.includes("number") ? number$1 : integer).source;
			return rest;
		}
		/** Every record of one conversion, so the carriers are found in a single pass rather than once per record. */
		const pendingRecords = /* @__PURE__ */ new WeakMap();
		function rewriteKeyNames(ctx) {
			const bySchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.values()) if (entry.def && !bySchema.has(entry.schema)) bySchema.set(entry.schema, entry);
			const rewrites = /* @__PURE__ */ new Map();
			for (const record of pendingRecords.get(ctx) ?? []) {
				const seen = ctx.seen.get(record);
				const names = (seen?.def ?? seen?.schema)?.propertyNames;
				if (!names || names === true || rewrites.has(names)) continue;
				const rewritten = stringifyKeyNames(bySchema, names, /* @__PURE__ */ new Set());
				if (rewritten !== names) rewrites.set(names, rewritten);
			}
			if (!rewrites.size) return;
			for (const entry of ctx.seen.values()) for (const carrier of [entry.schema, entry.def]) {
				const rewritten = carrier && rewrites.get(carrier.propertyNames);
				if (rewritten) carrier.propertyNames = rewritten;
			}
		}
		const recordProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			const keyType = def.keyType;
			const patterns = aggregateChecks(keyType).patterns;
			if (def.mode === "loose" && patterns && patterns.size > 0) {
				const valueSchema = processSchema(def.valueType, ctx, {
					...params,
					path: [
						...params.path,
						"patternProperties",
						"*"
					]
				});
				json.patternProperties = {};
				for (const pattern of patterns) assignProp$1(json.patternProperties, exactPattern(pattern).source, valueSchema);
			} else {
				if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
					json.propertyNames = processSchema(def.keyType, ctx, {
						...params,
						path: [...params.path, "propertyNames"]
					});
					let pending = pendingRecords.get(ctx);
					if (!pending) {
						pending = [];
						pendingRecords.set(ctx, pending);
						ctx.deferred.push(() => rewriteKeyNames(ctx));
					}
					pending.push(schema);
				}
				json.additionalProperties = processSchema(def.valueType, ctx, {
					...params,
					path: [...params.path, "additionalProperties"]
				});
			}
			const keyValues = keyType._zod.values;
			const omittableOnInput = ctx.io === "input" && inputOptin(def.valueType) !== void 0;
			if (keyValues && !def.partial && !omittableOnInput) {
				const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
				if (validKeyValues.length > 0) json.required = validKeyValues.map(String);
			}
		};
		const nullableProcessor$1 = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = processSchema(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor$1 = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			processSchema(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		/** Round-trips a default value through JSON so the emitted schema is guaranteed to be valid JSON.
		* A BigInt has no reliable encoding, so it goes through `unrepresentable` like any other
		* unrepresentable value. Returns a sentinel when the caller must not write a default of its own. */
		const UNREPRESENTABLE_DEFAULT = Symbol();
		function serializeDefaultValue(value, schema, ctx, json, params) {
			let unrepresentable = false;
			const serialized = JSON.stringify(value, (_, val) => {
				if (typeof val !== "bigint") return val;
				unrepresentable = true;
				return null;
			});
			if (!unrepresentable) return JSON.parse(serialized);
			handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
			return UNREPRESENTABLE_DEFAULT;
		}
		const defaultProcessor$1 = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			processSchema(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
			if (value !== UNREPRESENTABLE_DEFAULT) json.default = value;
		};
		const prefaultProcessor$1 = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			processSchema(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io !== "input") return;
			const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
			if (value !== UNREPRESENTABLE_DEFAULT) json._prefault = value;
		};
		const catchProcessor$1 = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			processSchema(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
				return;
			}
			json.default = catchValue;
		};
		const pipeProcessor$1 = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			processSchema(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor$1 = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			processSchema(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor$1 = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			processSchema(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/errors.js
		const _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
		function _lazyMethod(proto, key, make) {
			Object.defineProperty(proto, key, {
				configurable: true,
				enumerable: false,
				get() {
					const value = make(this);
					Object.defineProperty(this, key, {
						value,
						configurable: true,
						writable: true
					});
					return value;
				},
				set(value) {
					Object.defineProperty(this, key, {
						value,
						configurable: true,
						writable: true
					});
				}
			});
		}
		const initializer$2 = (inst, issues) => {
			$ZodError$1.init(inst, issues);
			inst.name = "ZodError";
			const proto = Object.getPrototypeOf(inst);
			if (_installedErrorProtos.has(proto)) return;
			_installedErrorProtos.add(proto);
			_lazyMethod(proto, "format", (self) => (mapper) => formatError$1(self, mapper));
			_lazyMethod(proto, "flatten", (self) => (mapper) => flattenError$1(self, mapper));
			_lazyMethod(proto, "addIssue", (self) => (issue) => {
				self.issues.push(issue);
				self.message = JSON.stringify(self.issues, jsonStringifyReplacer$1, 2);
			});
			_lazyMethod(proto, "addIssues", (self) => (issues) => {
				self.issues.push(...issues);
				self.message = JSON.stringify(self.issues, jsonStringifyReplacer$1, 2);
			});
			Object.defineProperty(proto, "isEmpty", {
				configurable: true,
				enumerable: false,
				get() {
					return this.issues.length === 0;
				}
			});
		};
		const ZodRealError$1 = /*@__PURE__*/ $constructor$1("ZodError", initializer$2, void 0, { Parent: Error });
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/parse.js
		const parse$1 = /* @__PURE__ */ _parse$1(ZodRealError$1);
		const parseAsync$1 = /* @__PURE__ */ _parseAsync$1(ZodRealError$1);
		const safeParse$3 = /* @__PURE__ */ _safeParse$1(ZodRealError$1);
		const safeParseAsync$2 = /* @__PURE__ */ _safeParseAsync$1(ZodRealError$1);
		const encode$1 = /* @__PURE__ */ _encode$1(ZodRealError$1);
		const decode$1 = /* @__PURE__ */ _decode$1(ZodRealError$1);
		const encodeAsync$1 = /* @__PURE__ */ _encodeAsync$1(ZodRealError$1);
		const decodeAsync$1 = /* @__PURE__ */ _decodeAsync$1(ZodRealError$1);
		const safeEncode$1 = /* @__PURE__ */ _safeEncode$1(ZodRealError$1);
		const safeDecode$1 = /* @__PURE__ */ _safeDecode$1(ZodRealError$1);
		const safeEncodeAsync$1 = /* @__PURE__ */ _safeEncodeAsync$1(ZodRealError$1);
		const safeDecodeAsync$1 = /* @__PURE__ */ _safeDecodeAsync$1(ZodRealError$1);
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/schemas.js
		function _ensureDefaultLocale() {
			if (!globalConfig$1.localeError) config$1(en_default());
		}
		function _ensureDefaultMemoizer() {
			if (!globalConfig$1.memoizer) config$1({ memoizer: memoizer() });
		}
		const ZodType$1 = /*@__PURE__*/ $constructor$1("ZodType", (inst, def) => {
			_ensureDefaultLocale();
			$ZodType$1.init(inst, def);
			inst.def = def;
			inst.type = def.type;
			return inst;
		}, {
			check(...chks) {
				const def = this.def;
				return this.clone(mergeDefs$1(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
					check: ch,
					def: { check: "custom" },
					onattach: []
				} } : ch)] }), { parent: true });
			},
			with(...chks) {
				return this.check(...chks);
			},
			clone(def, params) {
				return clone$1(this, def, params);
			},
			brand() {
				return this;
			},
			register(reg, meta) {
				reg.add(this, meta);
				return this;
			},
			refine(check, params) {
				return this.check(refine$1(check, params));
			},
			superRefine(refinement, params) {
				return this.check(superRefine$1(refinement, params));
			},
			overwrite(fn) {
				return this.check(/* @__PURE__ */ _overwrite$1(fn));
			},
			optional() {
				return optional$1(this);
			},
			exactOptional() {
				return exactOptional$1(this);
			},
			nullable() {
				return nullable$1(this);
			},
			nullish() {
				return optional$1(nullable$1(this));
			},
			nonoptional(params) {
				return nonoptional$1(this, params);
			},
			array() {
				return array$1(this);
			},
			or(arg) {
				return union$1([this, arg]);
			},
			and(arg) {
				return intersection$1(this, arg);
			},
			transform(tx) {
				return pipe$1(this, transform$1(tx));
			},
			default(d) {
				return _default$1(this, d);
			},
			prefault(d) {
				return prefault$1(this, d);
			},
			catch(params) {
				return _catch$1(this, params);
			},
			pipe(target) {
				return pipe$1(this, target);
			},
			readonly() {
				return readonly$1(this);
			},
			describe(description) {
				const cl = this.clone();
				globalRegistry$1.add(cl, { description });
				return cl;
			},
			meta(...args) {
				if (args.length === 0) return globalRegistry$1.get(this);
				const cl = this.clone();
				globalRegistry$1.add(cl, args[0]);
				return cl;
			},
			isOptional() {
				return this.safeParse(void 0).success;
			},
			isNullable() {
				return this.safeParse(null).success;
			},
			apply(fn, ...args) {
				return args.length === 0 ? fn(this) : fn(this, ...args);
			},
			get "~standard"() {
				return hide(this, "~standard", {
					...standardProps(this),
					jsonSchema: {
						input: createStandardJSONSchemaMethod$1(this, "input"),
						output: createStandardJSONSchemaMethod$1(this, "output")
					}
				});
			},
			set "~standard"(value) {
				own(this, "~standard", value);
			},
			parse: function _parse(data, params) {
				return parse$1(this, data, params, { callee: _parse });
			},
			parseAsync: async function _parseAsync(data, params) {
				return await parseAsync$1(this, data, params, { callee: _parseAsync });
			},
			safeParse(data, params) {
				return safeParse$3(this, data, params);
			},
			async safeParseAsync(data, params) {
				return safeParseAsync$2(this, data, params);
			},
			get spa() {
				return this?.safeParseAsync;
			},
			set spa(value) {
				own(this, "spa", value);
			},
			validate(data, params) {
				return validate(this, data, params);
			},
			validateAsync(data, params) {
				return validateAsync$1(this, data, params);
			},
			encode: function _encode(data, params) {
				return encode$1(this, data, params, { callee: _encode });
			},
			decode: function _decode(data, params) {
				return decode$1(this, data, params, { callee: _decode });
			},
			encodeAsync: async function _encodeAsync(data, params) {
				return await encodeAsync$1(this, data, params, { callee: _encodeAsync });
			},
			decodeAsync: async function _decodeAsync(data, params) {
				return await decodeAsync$1(this, data, params, { callee: _decodeAsync });
			},
			safeEncode(data, params) {
				return safeEncode$1(this, data, params);
			},
			safeDecode(data, params) {
				return safeDecode$1(this, data, params);
			},
			async safeEncodeAsync(data, params) {
				return safeEncodeAsync$1(this, data, params);
			},
			async safeDecodeAsync(data, params) {
				return safeDecodeAsync$1(this, data, params);
			},
			toJSONSchema(params) {
				return createToJSONSchemaMethod$1(this, {})(params);
			},
			get description() {
				return globalRegistry$1.get(this)?.description;
			},
			get _def() {
				return this._zod.def;
			}
		});
		/** @internal */
		const _ZodString$1 = /*@__PURE__*/ $constructor$1("_ZodString", (inst, def) => {
			$ZodString$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor$1(inst, ctx, json, params);
		}, /*@__PURE__*/ derived({
			format: (inst) => aggregateChecks(inst).format ?? null,
			minLength: (inst) => aggregateChecks(inst).minimum ?? null,
			maxLength: (inst) => aggregateChecks(inst).maximum ?? null
		}, {
			regex(...args) {
				return this.check(/* @__PURE__ */ _regex$1(...args));
			},
			includes(...args) {
				return this.check(/* @__PURE__ */ _includes$1(...args));
			},
			startsWith(...args) {
				return this.check(/* @__PURE__ */ _startsWith$1(...args));
			},
			endsWith(...args) {
				return this.check(/* @__PURE__ */ _endsWith$1(...args));
			},
			min(...args) {
				return this.check(/* @__PURE__ */ _minLength$1(...args));
			},
			max(...args) {
				return this.check(/* @__PURE__ */ _maxLength$1(...args));
			},
			length(...args) {
				return this.check(/* @__PURE__ */ _length$1(...args));
			},
			nonempty(...args) {
				return this.check(/* @__PURE__ */ _minLength$1(1, ...args));
			},
			lowercase(params) {
				return this.check(/* @__PURE__ */ _lowercase$1(params));
			},
			uppercase(params) {
				return this.check(/* @__PURE__ */ _uppercase$1(params));
			},
			trim() {
				return this.check(/* @__PURE__ */ _trim$1());
			},
			normalize(...args) {
				return this.check(/* @__PURE__ */ _normalize$1(...args));
			},
			toLowerCase() {
				return this.check(/* @__PURE__ */ _toLowerCase$1());
			},
			toUpperCase() {
				return this.check(/* @__PURE__ */ _toUpperCase$1());
			},
			slugify() {
				return this.check(/* @__PURE__ */ _slugify$1());
			}
		}));
		const ZodString$1 = /*@__PURE__*/ $constructor$1("ZodString", (inst, def) => {
			$ZodString$1.init(inst, def);
			_ZodString$1.init(inst, def);
		}, {
			email(params) {
				return this.check(/* @__PURE__ */ _email$1(ZodEmail$1, params));
			},
			url(params) {
				return this.check(/* @__PURE__ */ _url$1(ZodURL$1, params));
			},
			jwt(params) {
				return this.check(/* @__PURE__ */ _jwt$1(ZodJWT$1, params));
			},
			emoji(params) {
				return this.check(/* @__PURE__ */ _emoji$2(ZodEmoji$1, params));
			},
			guid(params) {
				return this.check(/* @__PURE__ */ _guid$1(ZodGUID$1, params));
			},
			uuid(params) {
				return this.check(/* @__PURE__ */ _uuid$1(ZodUUID$1, params));
			},
			uuidv4(params) {
				return this.check(/* @__PURE__ */ _uuidv4$1(ZodUUID$1, params));
			},
			uuidv6(params) {
				return this.check(/* @__PURE__ */ _uuidv6$1(ZodUUID$1, params));
			},
			uuidv7(params) {
				return this.check(/* @__PURE__ */ _uuidv7$1(ZodUUID$1, params));
			},
			nanoid(params) {
				return this.check(/* @__PURE__ */ _nanoid$1(ZodNanoID$1, params));
			},
			cuid(params) {
				return this.check(/* @__PURE__ */ _cuid$1(ZodCUID$1, params));
			},
			cuid2(params) {
				return this.check(/* @__PURE__ */ _cuid2$1(ZodCUID2$1, params));
			},
			ulid(params) {
				return this.check(/* @__PURE__ */ _ulid$1(ZodULID$1, params));
			},
			base64(params) {
				return this.check(/* @__PURE__ */ _base64$1(ZodBase64$1, params));
			},
			base64url(params) {
				return this.check(/* @__PURE__ */ _base64url$1(ZodBase64URL$1, params));
			},
			xid(params) {
				return this.check(/* @__PURE__ */ _xid$1(ZodXID$1, params));
			},
			ksuid(params) {
				return this.check(/* @__PURE__ */ _ksuid$1(ZodKSUID$1, params));
			},
			ipv4(params) {
				return this.check(/* @__PURE__ */ _ipv4$1(ZodIPv4$1, params));
			},
			ipv6(params) {
				return this.check(/* @__PURE__ */ _ipv6$1(ZodIPv6$1, params));
			},
			cidrv4(params) {
				return this.check(/* @__PURE__ */ _cidrv4$1(ZodCIDRv4$1, params));
			},
			cidrv6(params) {
				return this.check(/* @__PURE__ */ _cidrv6$1(ZodCIDRv6$1, params));
			},
			e164(params) {
				return this.check(/* @__PURE__ */ _e164$1(ZodE164$1, params));
			},
			datetime(params) {
				return this.check(/* @__PURE__ */ _isoDateTime$1(ZodISODateTime$1, params));
			},
			date(params) {
				return this.check(/* @__PURE__ */ _isoDate$1(ZodISODate$1, params));
			},
			time(params) {
				return this.check(/* @__PURE__ */ _isoTime$1(ZodISOTime$1, params));
			},
			duration(params) {
				return this.check(/* @__PURE__ */ _isoDuration$1(ZodISODuration$1, params));
			}
		});
		function string$2(params) {
			return /* @__PURE__ */ _string$1(ZodString$1, params);
		}
		const ZodStringFormat$1 = /*@__PURE__*/ $constructor$1("ZodStringFormat", (inst, def) => {
			$ZodStringFormat$1.init(inst, def);
			_ZodString$1.init(inst, def);
		});
		const ZodISODateTime$1 = /*@__PURE__*/ $constructor$1("ZodISODateTime", (inst, def) => {
			$ZodISODateTime$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodISODate$1 = /*@__PURE__*/ $constructor$1("ZodISODate", (inst, def) => {
			$ZodISODate$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodISOTime$1 = /*@__PURE__*/ $constructor$1("ZodISOTime", (inst, def) => {
			$ZodISOTime$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodISODuration$1 = /*@__PURE__*/ $constructor$1("ZodISODuration", (inst, def) => {
			$ZodISODuration$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodEmail$1 = /*@__PURE__*/ $constructor$1("ZodEmail", (inst, def) => {
			$ZodEmail$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodGUID$1 = /*@__PURE__*/ $constructor$1("ZodGUID", (inst, def) => {
			$ZodGUID$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodUUID$1 = /*@__PURE__*/ $constructor$1("ZodUUID", (inst, def) => {
			$ZodUUID$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodURL$1 = /*@__PURE__*/ $constructor$1("ZodURL", (inst, def) => {
			$ZodURL$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodEmoji$1 = /*@__PURE__*/ $constructor$1("ZodEmoji", (inst, def) => {
			$ZodEmoji$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodNanoID$1 = /*@__PURE__*/ $constructor$1("ZodNanoID", (inst, def) => {
			$ZodNanoID$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID$1 = /*@__PURE__*/ $constructor$1("ZodCUID", (inst, def) => {
			$ZodCUID$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodCUID2$1 = /*@__PURE__*/ $constructor$1("ZodCUID2", (inst, def) => {
			$ZodCUID2$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodULID$1 = /*@__PURE__*/ $constructor$1("ZodULID", (inst, def) => {
			$ZodULID$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodXID$1 = /*@__PURE__*/ $constructor$1("ZodXID", (inst, def) => {
			$ZodXID$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodKSUID$1 = /*@__PURE__*/ $constructor$1("ZodKSUID", (inst, def) => {
			$ZodKSUID$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodIPv4$1 = /*@__PURE__*/ $constructor$1("ZodIPv4", (inst, def) => {
			$ZodIPv4$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodIPv6$1 = /*@__PURE__*/ $constructor$1("ZodIPv6", (inst, def) => {
			$ZodIPv6$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodCIDRv4$1 = /*@__PURE__*/ $constructor$1("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodCIDRv6$1 = /*@__PURE__*/ $constructor$1("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodBase64$1 = /*@__PURE__*/ $constructor$1("ZodBase64", (inst, def) => {
			$ZodBase64$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodBase64URL$1 = /*@__PURE__*/ $constructor$1("ZodBase64URL", (inst, def) => {
			$ZodBase64URL$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodE164$1 = /*@__PURE__*/ $constructor$1("ZodE164", (inst, def) => {
			$ZodE164$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodJWT$1 = /*@__PURE__*/ $constructor$1("ZodJWT", (inst, def) => {
			$ZodJWT$1.init(inst, def);
			ZodStringFormat$1.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor$1("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			inst.isFinite = true;
		}, /*@__PURE__*/ derived({
			minValue: (inst) => {
				const { minimum, exclusiveMinimum } = aggregateChecks(inst);
				return Math.max(minimum ?? Number.NEGATIVE_INFINITY, exclusiveMinimum ?? Number.NEGATIVE_INFINITY);
			},
			maxValue: (inst) => {
				const { maximum, exclusiveMaximum } = aggregateChecks(inst);
				return Math.min(maximum ?? Number.POSITIVE_INFINITY, exclusiveMaximum ?? Number.POSITIVE_INFINITY);
			},
			isInt: (inst) => {
				const { isInt, multipleOf } = aggregateChecks(inst);
				return !!isInt || !!multipleOf?.some(Number.isSafeInteger);
			},
			format: (inst) => aggregateChecks(inst).format ?? null
		}, {
			gt(value, params) {
				return this.check(/* @__PURE__ */ _gt(value, params));
			},
			gte(value, params) {
				return this.check(/* @__PURE__ */ _gte(value, params));
			},
			min(value, params) {
				return this.check(/* @__PURE__ */ _gte(value, params));
			},
			lt(value, params) {
				return this.check(/* @__PURE__ */ _lt(value, params));
			},
			lte(value, params) {
				return this.check(/* @__PURE__ */ _lte(value, params));
			},
			max(value, params) {
				return this.check(/* @__PURE__ */ _lte(value, params));
			},
			int(params) {
				return this.check(int(params));
			},
			safe(params) {
				return this.check(int(params));
			},
			positive(params) {
				return this.check(/* @__PURE__ */ _gt(0, params));
			},
			nonnegative(params) {
				return this.check(/* @__PURE__ */ _gte(0, params));
			},
			negative(params) {
				return this.check(/* @__PURE__ */ _lt(0, params));
			},
			nonpositive(params) {
				return this.check(/* @__PURE__ */ _lte(0, params));
			},
			multipleOf(value, params) {
				return this.check(/* @__PURE__ */ _multipleOf(value, params));
			},
			step(value, params) {
				return this.check(/* @__PURE__ */ _multipleOf(value, params));
			},
			finite() {
				return this;
			}
		}));
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor$1("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodBoolean = /*@__PURE__*/ $constructor$1("ZodBoolean", (inst, def) => {
			$ZodBoolean.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
		});
		function boolean(params) {
			return /* @__PURE__ */ _boolean(ZodBoolean, params);
		}
		const ZodUndefined = /*@__PURE__*/ $constructor$1("ZodUndefined", (inst, def) => {
			$ZodUndefined.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => undefinedProcessor(inst, ctx, json, params);
		});
		function _undefined(params) {
			return /* @__PURE__ */ _undefined$1(ZodUndefined, params);
		}
		const ZodNull = /*@__PURE__*/ $constructor$1("ZodNull", (inst, def) => {
			$ZodNull.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullProcessor(inst, ctx, json, params);
		});
		function _null(params) {
			return /* @__PURE__ */ _null$1(ZodNull, params);
		}
		const ZodAny = /*@__PURE__*/ $constructor$1("ZodAny", (inst, def) => {
			$ZodAny.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function any() {
			return /* @__PURE__ */ _any(ZodAny);
		}
		const ZodUnknown$1 = /*@__PURE__*/ $constructor$1("ZodUnknown", (inst, def) => {
			$ZodUnknown$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown$1() {
			return /* @__PURE__ */ _unknown$1(ZodUnknown$1);
		}
		const ZodNever$1 = /*@__PURE__*/ $constructor$1("ZodNever", (inst, def) => {
			$ZodNever$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor$1(inst, ctx, json, params);
		});
		function never$1(params) {
			return /* @__PURE__ */ _never$1(ZodNever$1, params);
		}
		const ZodArray$1 = /*@__PURE__*/ $constructor$1("ZodArray", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodArray$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor$1(inst, ctx, json, params);
			inst.element = def.element;
		}, {
			min(n, params) {
				return this.check(/* @__PURE__ */ _minLength$1(n, params));
			},
			nonempty(params) {
				return this.check(/* @__PURE__ */ _minLength$1(1, params));
			},
			max(n, params) {
				return this.check(/* @__PURE__ */ _maxLength$1(n, params));
			},
			length(n, params) {
				return this.check(/* @__PURE__ */ _length$1(n, params));
			},
			unwrap() {
				return this.element;
			}
		});
		function array$1(element, params) {
			return /* @__PURE__ */ _array$1(ZodArray$1, element, params);
		}
		const ZodObject$1 = /*@__PURE__*/ $constructor$1("ZodObject", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodObjectJIT$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor$1(inst, ctx, json, params);
			installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
		}, {
			keyof() {
				return _enum$1(Object.keys(this._zod.def.shape));
			},
			catchall(catchall) {
				return this.clone(mergeDefs$1(this._zod.def, { catchall }));
			},
			passthrough() {
				return this.clone(mergeDefs$1(this._zod.def, { catchall: unknown$1() }));
			},
			loose() {
				return this.clone(mergeDefs$1(this._zod.def, { catchall: unknown$1() }));
			},
			strict() {
				return this.clone(mergeDefs$1(this._zod.def, { catchall: never$1() }));
			},
			strip() {
				return this.clone(mergeDefs$1(this._zod.def, { catchall: void 0 }));
			},
			extend(incoming) {
				return extend$1(this, incoming);
			},
			safeExtend(incoming) {
				return safeExtend$1(this, incoming);
			},
			merge(other) {
				return merge$1(this, other);
			},
			pick(mask) {
				return pick$1(this, mask);
			},
			omit(mask) {
				return omit$1(this, mask);
			},
			partial(...args) {
				return partial$1(ZodOptional$1, this, args[0]);
			},
			exactPartial(...args) {
				return partial$1(ZodExactOptional$1, this, args[0], "exactPartial");
			},
			required(...args) {
				return required$1(ZodNonOptional$1, this, args[0]);
			}
		});
		function object$1(shape, params) {
			const def = {
				type: "object",
				shape: shape ?? {},
				...normalizeParams$1(params)
			};
			return new ZodObject$1(def);
		}
		function looseObject(shape, params) {
			return new ZodObject$1({
				type: "object",
				shape,
				catchall: unknown$1(),
				...normalizeParams$1(params)
			});
		}
		const ZodUnion$1 = /*@__PURE__*/ $constructor$1("ZodUnion", (inst, def) => {
			$ZodUnion$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor$1(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union$1(options, params) {
			return new ZodUnion$1({
				type: "union",
				options,
				...normalizeParams$1(params)
			});
		}
		const ZodDiscriminatedUnion = /*@__PURE__*/ $constructor$1("ZodDiscriminatedUnion", (inst, def) => {
			ZodUnion$1.init(inst, def);
			$ZodDiscriminatedUnion.init(inst, def);
		});
		function discriminatedUnion(discriminator, options, params) {
			return new ZodDiscriminatedUnion({
				type: "union",
				options,
				discriminator,
				...normalizeParams$1(params)
			});
		}
		const ZodIntersection$1 = /*@__PURE__*/ $constructor$1("ZodIntersection", (inst, def) => {
			$ZodIntersection$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor$1(inst, ctx, json, params);
		});
		function intersection$1(left, right) {
			return new ZodIntersection$1({
				type: "intersection",
				left,
				right
			});
		}
		const ZodRecord = /*@__PURE__*/ $constructor$1("ZodRecord", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodRecord.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
			inst.keyType = def.keyType;
			inst.valueType = def.valueType;
		});
		function record(keyType, valueType, params) {
			if (!valueType || !valueType._zod) return new ZodRecord({
				type: "record",
				keyType: string$2(),
				valueType: keyType,
				...normalizeParams$1(valueType)
			});
			return new ZodRecord({
				type: "record",
				keyType,
				valueType,
				...normalizeParams$1(params)
			});
		}
		const ZodEnum$1 = /*@__PURE__*/ $constructor$1("ZodEnum", (inst, def) => {
			$ZodEnum$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor$1(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = [...inst._zod.values];
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum$1({
					...def,
					checks: [],
					...normalizeParams$1(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum$1({
					...def,
					checks: [],
					...normalizeParams$1(params),
					entries: newEntries
				});
			};
		});
		function _enum$1(values, params) {
			const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
			return new ZodEnum$1({
				type: "enum",
				entries,
				...normalizeParams$1(params)
			});
		}
		const ZodLiteral = /*@__PURE__*/ $constructor$1("ZodLiteral", (inst, def) => {
			$ZodLiteral.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
			inst.values = new Set(def.values);
			Object.defineProperty(inst, "value", { get() {
				if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
				return def.values[0];
			} });
		});
		function literal(value, params) {
			return new ZodLiteral({
				type: "literal",
				values: Array.isArray(value) ? value : [value],
				...normalizeParams$1(params)
			});
		}
		const ZodTransform$1 = /*@__PURE__*/ $constructor$1("ZodTransform", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodTransform$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor$1(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError$1(inst.constructor.name);
				payload.addIssue = (issue) => {
					if (typeof issue === "string") payload.issues.push(issue$1(issue, payload.value, def));
					else {
						const _issue = issue;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						if (!("input" in _issue)) _issue.input = payload.value;
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue$1(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					return payload;
				});
				payload.value = output;
				return payload;
			};
		});
		function transform$1(fn) {
			return new ZodTransform$1({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional$1 = /*@__PURE__*/ $constructor$1("ZodOptional", (inst, def) => {
			$ZodOptional$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor$1(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional$1(innerType) {
			return new ZodOptional$1({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional$1 = /*@__PURE__*/ $constructor$1("ZodExactOptional", (inst, def) => {
			$ZodExactOptional$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor$1(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional$1(innerType) {
			return new ZodExactOptional$1({
				type: "optional",
				innerType
			});
		}
		const ZodNullable$1 = /*@__PURE__*/ $constructor$1("ZodNullable", (inst, def) => {
			$ZodNullable$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor$1(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable$1(innerType) {
			return new ZodNullable$1({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault$1 = /*@__PURE__*/ $constructor$1("ZodDefault", (inst, def) => {
			$ZodDefault$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor$1(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default$1(innerType, defaultValue) {
			return new ZodDefault$1({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone$1(defaultValue);
				}
			});
		}
		const ZodPrefault$1 = /*@__PURE__*/ $constructor$1("ZodPrefault", (inst, def) => {
			$ZodPrefault$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor$1(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault$1(innerType, defaultValue) {
			return new ZodPrefault$1({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone$1(defaultValue);
				}
			});
		}
		const ZodNonOptional$1 = /*@__PURE__*/ $constructor$1("ZodNonOptional", (inst, def) => {
			$ZodNonOptional$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor$1(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional$1(innerType, params) {
			return new ZodNonOptional$1({
				type: "nonoptional",
				innerType,
				...normalizeParams$1(params)
			});
		}
		const ZodCatch$1 = /*@__PURE__*/ $constructor$1("ZodCatch", (inst, def) => {
			$ZodCatch$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor$1(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch$1(innerType, catchValue) {
			return new ZodCatch$1({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
			});
		}
		const ZodPipe$1 = /*@__PURE__*/ $constructor$1("ZodPipe", (inst, def) => {
			$ZodPipe$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor$1(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe$1(in_, out) {
			return new ZodPipe$1({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodPreprocess = /*@__PURE__*/ $constructor$1("ZodPreprocess", (inst, def) => {
			ZodPipe$1.init(inst, def);
			$ZodPreprocess.init(inst, def);
		});
		const ZodReadonly$1 = /*@__PURE__*/ $constructor$1("ZodReadonly", (inst, def) => {
			$ZodReadonly$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor$1(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly$1(innerType) {
			return new ZodReadonly$1({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom$1 = /*@__PURE__*/ $constructor$1("ZodCustom", (inst, def) => {
			$ZodCustom$1.init(inst, def);
			ZodType$1.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor$1(inst, ctx, json, params);
		});
		function custom(fn, _params) {
			return /* @__PURE__ */ _custom(ZodCustom$1, fn ?? (() => true), _params);
		}
		function refine$1(fn, _params = {}) {
			return /* @__PURE__ */ _refine$1(ZodCustom$1, fn, _params);
		}
		function superRefine$1(fn, params) {
			return /* @__PURE__ */ _superRefine$1(fn, params);
		}
		function preprocess(fn, schema) {
			return new ZodPreprocess({
				type: "pipe",
				in: transform$1(fn),
				out: schema
			});
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/iso.js
		function datetime$2(params) {
			return /* @__PURE__ */ _isoDateTime$1(ZodISODateTime$1, params);
		}
		//#endregion
		//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.6.5/node_modules/@modelcontextprotocol/sdk/dist/esm/types.js
		const RELATED_TASK_META_KEY = "io.modelcontextprotocol/related-task";
		/**
		* Assert 'object' type schema.
		*
		* @internal
		*/
		const AssertObjectSchema = custom((v) => v !== null && (typeof v === "object" || typeof v === "function"));
		/**
		* A progress token, used to associate progress notifications with the original request.
		*/
		const ProgressTokenSchema = union$1([string$2(), number().int()]);
		/**
		* An opaque token used to represent a cursor for pagination.
		*/
		const CursorSchema = string$2();
		looseObject({
			/**
			* Requested duration in milliseconds to retain task from creation.
			*/
			ttl: number().optional(),
			/**
			* Time in milliseconds to wait between task status requests.
			*/
			pollInterval: number().optional()
		});
		const TaskMetadataSchema = object$1({ ttl: number().optional() });
		/**
		* Metadata for associating messages with a task.
		* Include this in the `_meta` field under the key `io.modelcontextprotocol/related-task`.
		*/
		const RelatedTaskMetadataSchema = object$1({ taskId: string$2() });
		const RequestMetaSchema = looseObject({
			/**
			* If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
			*/
			progressToken: ProgressTokenSchema.optional(),
			/**
			* If specified, this request is related to the provided task.
			*/
			[RELATED_TASK_META_KEY]: RelatedTaskMetadataSchema.optional()
		});
		/**
		* Common params for any request.
		*/
		const BaseRequestParamsSchema = object$1({ 
		/**
		* See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		*/
_meta: RequestMetaSchema.optional() });
		/**
		* Common params for any task-augmented request.
		*/
		const TaskAugmentedRequestParamsSchema = BaseRequestParamsSchema.extend({ 
		/**
		* If specified, the caller is requesting task-augmented execution for this request.
		* The request will return a CreateTaskResult immediately, and the actual result can be
		* retrieved later via tasks/result.
		*
		* Task augmentation is subject to capability negotiation - receivers MUST declare support
		* for task augmentation of specific request types in their capabilities.
		*/
task: TaskMetadataSchema.optional() });
		/**
		* Checks if a value is a valid TaskAugmentedRequestParams.
		* @param value - The value to check.
		*
		* @returns True if the value is a valid TaskAugmentedRequestParams, false otherwise.
		*/
		const isTaskAugmentedRequestParams = (value) => TaskAugmentedRequestParamsSchema.safeParse(value).success;
		const RequestSchema = object$1({
			method: string$2(),
			params: BaseRequestParamsSchema.loose().optional()
		});
		const NotificationsParamsSchema = object$1({ 
		/**
		* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
		* for notes on _meta usage.
		*/
_meta: RequestMetaSchema.optional() });
		const NotificationSchema = object$1({
			method: string$2(),
			params: NotificationsParamsSchema.loose().optional()
		});
		const ResultSchema = looseObject({ 
		/**
		* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
		* for notes on _meta usage.
		*/
_meta: RequestMetaSchema.optional() });
		/**
		* A uniquely identifying ID for a request in JSON-RPC.
		*/
		const RequestIdSchema = union$1([string$2(), number().int()]);
		/**
		* A request that expects a response.
		*/
		const JSONRPCRequestSchema = object$1({
			jsonrpc: literal("2.0"),
			id: RequestIdSchema,
			...RequestSchema.shape
		}).strict();
		const isJSONRPCRequest = (value) => JSONRPCRequestSchema.safeParse(value).success;
		/**
		* A notification which does not expect a response.
		*/
		const JSONRPCNotificationSchema = object$1({
			jsonrpc: literal("2.0"),
			...NotificationSchema.shape
		}).strict();
		const isJSONRPCNotification = (value) => JSONRPCNotificationSchema.safeParse(value).success;
		/**
		* A successful (non-error) response to a request.
		*/
		const JSONRPCResultResponseSchema = object$1({
			jsonrpc: literal("2.0"),
			id: RequestIdSchema,
			result: ResultSchema
		}).strict();
		/**
		* Checks if a value is a valid JSONRPCResultResponse.
		* @param value - The value to check.
		*
		* @returns True if the value is a valid JSONRPCResultResponse, false otherwise.
		*/
		const isJSONRPCResultResponse = (value) => JSONRPCResultResponseSchema.safeParse(value).success;
		/**
		* Error codes defined by the JSON-RPC specification.
		*/
		var ErrorCode;
		(function(ErrorCode) {
			ErrorCode[ErrorCode["ConnectionClosed"] = -32e3] = "ConnectionClosed";
			ErrorCode[ErrorCode["RequestTimeout"] = -32001] = "RequestTimeout";
			ErrorCode[ErrorCode["ParseError"] = -32700] = "ParseError";
			ErrorCode[ErrorCode["InvalidRequest"] = -32600] = "InvalidRequest";
			ErrorCode[ErrorCode["MethodNotFound"] = -32601] = "MethodNotFound";
			ErrorCode[ErrorCode["InvalidParams"] = -32602] = "InvalidParams";
			ErrorCode[ErrorCode["InternalError"] = -32603] = "InternalError";
			ErrorCode[ErrorCode["UrlElicitationRequired"] = -32042] = "UrlElicitationRequired";
		})(ErrorCode || (ErrorCode = {}));
		/**
		* A response to a request that indicates an error occurred.
		*/
		const JSONRPCErrorResponseSchema = object$1({
			jsonrpc: literal("2.0"),
			id: RequestIdSchema.optional(),
			error: object$1({
				/**
				* The error type that occurred.
				*/
				code: number().int(),
				/**
				* A short description of the error. The message SHOULD be limited to a concise single sentence.
				*/
				message: string$2(),
				/**
				* Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
				*/
				data: unknown$1().optional()
			})
		}).strict();
		/**
		* Checks if a value is a valid JSONRPCErrorResponse.
		* @param value - The value to check.
		*
		* @returns True if the value is a valid JSONRPCErrorResponse, false otherwise.
		*/
		const isJSONRPCErrorResponse = (value) => JSONRPCErrorResponseSchema.safeParse(value).success;
		const JSONRPCMessageSchema = union$1([
			JSONRPCRequestSchema,
			JSONRPCNotificationSchema,
			JSONRPCResultResponseSchema,
			JSONRPCErrorResponseSchema
		]);
		union$1([JSONRPCResultResponseSchema, JSONRPCErrorResponseSchema]);
		/**
		* A response that indicates success but carries no data.
		*/
		const EmptyResultSchema = ResultSchema.strict();
		const CancelledNotificationParamsSchema = NotificationsParamsSchema.extend({
			/**
			* The ID of the request to cancel.
			*
			* This MUST correspond to the ID of a request previously issued in the same direction.
			*/
			requestId: RequestIdSchema.optional(),
			/**
			* An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
			*/
			reason: string$2().optional()
		});
		/**
		* This notification can be sent by either side to indicate that it is cancelling a previously-issued request.
		*
		* The request SHOULD still be in-flight, but due to communication latency, it is always possible that this notification MAY arrive after the request has already finished.
		*
		* This notification indicates that the result will be unused, so any associated processing SHOULD cease.
		*
		* A client MUST NOT attempt to cancel its `initialize` request.
		*/
		const CancelledNotificationSchema = NotificationSchema.extend({
			method: literal("notifications/cancelled"),
			params: CancelledNotificationParamsSchema
		});
		/**
		* Base schema to add `icons` property.
		*
		*/
		const IconsSchema = object$1({ 
		/**
		* Optional set of sized icons that the client can display in a user interface.
		*
		* Clients that support rendering icons MUST support at least the following MIME types:
		* - `image/png` - PNG images (safe, universal compatibility)
		* - `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)
		*
		* Clients that support rendering icons SHOULD also support:
		* - `image/svg+xml` - SVG images (scalable but requires security precautions)
		* - `image/webp` - WebP images (modern, efficient format)
		*/
icons: array$1(object$1({
			/**
			* URL or data URI for the icon.
			*/
			src: string$2(),
			/**
			* Optional MIME type for the icon.
			*/
			mimeType: string$2().optional(),
			/**
			* Optional array of strings that specify sizes at which the icon can be used.
			* Each string should be in WxH format (e.g., `"48x48"`, `"96x96"`) or `"any"` for scalable formats like SVG.
			*
			* If not provided, the client should assume that the icon can be used at any size.
			*/
			sizes: array$1(string$2()).optional(),
			/**
			* Optional specifier for the theme this icon is designed for. `light` indicates
			* the icon is designed to be used with a light background, and `dark` indicates
			* the icon is designed to be used with a dark background.
			*
			* If not provided, the client should assume the icon can be used with any theme.
			*/
			theme: _enum$1(["light", "dark"]).optional()
		})).optional() });
		/**
		* Base metadata interface for common properties across resources, tools, prompts, and implementations.
		*/
		const BaseMetadataSchema = object$1({
			/** Intended for programmatic or logical use, but used as a display name in past specs or fallback */
			name: string$2(),
			/**
			* Intended for UI and end-user contexts — optimized to be human-readable and easily understood,
			* even by those unfamiliar with domain-specific terminology.
			*
			* If not provided, the name should be used for display (except for Tool,
			* where `annotations.title` should be given precedence over using `name`,
			* if present).
			*/
			title: string$2().optional()
		});
		/**
		* Describes the name and version of an MCP implementation.
		*/
		const ImplementationSchema = BaseMetadataSchema.extend({
			...BaseMetadataSchema.shape,
			...IconsSchema.shape,
			version: string$2(),
			/**
			* An optional URL of the website for this implementation.
			*/
			websiteUrl: string$2().optional(),
			/**
			* An optional human-readable description of what this implementation does.
			*
			* This can be used by clients or servers to provide context about their purpose
			* and capabilities. For example, a server might describe the types of resources
			* or tools it provides, while a client might describe its intended use case.
			*/
			description: string$2().optional()
		});
		const ElicitationCapabilitySchema = preprocess((value) => {
			if (value && typeof value === "object" && !Array.isArray(value)) {
				if (Object.keys(value).length === 0) return { form: {} };
			}
			return value;
		}, intersection$1(object$1({
			form: intersection$1(object$1({ applyDefaults: boolean().optional() }), record(string$2(), unknown$1())).optional(),
			url: AssertObjectSchema.optional()
		}), record(string$2(), unknown$1()).optional()));
		/**
		* Task capabilities for clients, indicating which request types support task creation.
		*/
		const ClientTasksCapabilitySchema = looseObject({
			/**
			* Present if the client supports listing tasks.
			*/
			list: AssertObjectSchema.optional(),
			/**
			* Present if the client supports cancelling tasks.
			*/
			cancel: AssertObjectSchema.optional(),
			/**
			* Capabilities for task creation on specific request types.
			*/
			requests: looseObject({
				/**
				* Task support for sampling requests.
				*/
				sampling: looseObject({ createMessage: AssertObjectSchema.optional() }).optional(),
				/**
				* Task support for elicitation requests.
				*/
				elicitation: looseObject({ create: AssertObjectSchema.optional() }).optional()
			}).optional()
		});
		/**
		* Task capabilities for servers, indicating which request types support task creation.
		*/
		const ServerTasksCapabilitySchema = looseObject({
			/**
			* Present if the server supports listing tasks.
			*/
			list: AssertObjectSchema.optional(),
			/**
			* Present if the server supports cancelling tasks.
			*/
			cancel: AssertObjectSchema.optional(),
			/**
			* Capabilities for task creation on specific request types.
			*/
			requests: looseObject({ 
			/**
			* Task support for tool requests.
			*/
tools: looseObject({ call: AssertObjectSchema.optional() }).optional() }).optional()
		});
		/**
		* Capabilities a client may support. Known capabilities are defined here, in this schema, but this is not a closed set: any client can define its own, additional capabilities.
		*/
		const ClientCapabilitiesSchema = object$1({
			/**
			* Experimental, non-standard capabilities that the client supports.
			*/
			experimental: record(string$2(), AssertObjectSchema).optional(),
			/**
			* Present if the client supports sampling from an LLM.
			*/
			sampling: object$1({
				/**
				* Present if the client supports context inclusion via includeContext parameter.
				* If not declared, servers SHOULD only use `includeContext: "none"` (or omit it).
				*/
				context: AssertObjectSchema.optional(),
				/**
				* Present if the client supports tool use via tools and toolChoice parameters.
				*/
				tools: AssertObjectSchema.optional()
			}).optional(),
			/**
			* Present if the client supports eliciting user input.
			*/
			elicitation: ElicitationCapabilitySchema.optional(),
			/**
			* Present if the client supports listing roots.
			*/
			roots: object$1({ 
			/**
			* Whether the client supports issuing notifications for changes to the roots list.
			*/
listChanged: boolean().optional() }).optional(),
			/**
			* Present if the client supports task creation.
			*/
			tasks: ClientTasksCapabilitySchema.optional(),
			/**
			* Extensions that the client supports. Keys are extension identifiers (vendor-prefix/extension-name).
			*/
			extensions: record(string$2(), AssertObjectSchema).optional()
		});
		const InitializeRequestParamsSchema = BaseRequestParamsSchema.extend({
			/**
			* The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
			*/
			protocolVersion: string$2(),
			capabilities: ClientCapabilitiesSchema,
			clientInfo: ImplementationSchema
		});
		/**
		* This request is sent from the client to the server when it first connects, asking it to begin initialization.
		*/
		const InitializeRequestSchema = RequestSchema.extend({
			method: literal("initialize"),
			params: InitializeRequestParamsSchema
		});
		/**
		* Capabilities that a server may support. Known capabilities are defined here, in this schema, but this is not a closed set: any server can define its own, additional capabilities.
		*/
		const ServerCapabilitiesSchema = object$1({
			/**
			* Experimental, non-standard capabilities that the server supports.
			*/
			experimental: record(string$2(), AssertObjectSchema).optional(),
			/**
			* Present if the server supports sending log messages to the client.
			*/
			logging: AssertObjectSchema.optional(),
			/**
			* Present if the server supports sending completions to the client.
			*/
			completions: AssertObjectSchema.optional(),
			/**
			* Present if the server offers any prompt templates.
			*/
			prompts: object$1({ 
			/**
			* Whether this server supports issuing notifications for changes to the prompt list.
			*/
listChanged: boolean().optional() }).optional(),
			/**
			* Present if the server offers any resources to read.
			*/
			resources: object$1({
				/**
				* Whether this server supports clients subscribing to resource updates.
				*/
				subscribe: boolean().optional(),
				/**
				* Whether this server supports issuing notifications for changes to the resource list.
				*/
				listChanged: boolean().optional()
			}).optional(),
			/**
			* Present if the server offers any tools to call.
			*/
			tools: object$1({ 
			/**
			* Whether this server supports issuing notifications for changes to the tool list.
			*/
listChanged: boolean().optional() }).optional(),
			/**
			* Present if the server supports task creation.
			*/
			tasks: ServerTasksCapabilitySchema.optional(),
			/**
			* Extensions that the server supports. Keys are extension identifiers (vendor-prefix/extension-name).
			*/
			extensions: record(string$2(), AssertObjectSchema).optional()
		});
		/**
		* After receiving an initialize request from the client, the server sends this response.
		*/
		const InitializeResultSchema = ResultSchema.extend({
			/**
			* The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
			*/
			protocolVersion: string$2(),
			capabilities: ServerCapabilitiesSchema,
			serverInfo: ImplementationSchema,
			/**
			* Instructions describing how to use the server and its features.
			*
			* This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
			*/
			instructions: string$2().optional()
		});
		/**
		* This notification is sent from the client to the server after initialization has finished.
		*/
		const InitializedNotificationSchema = NotificationSchema.extend({
			method: literal("notifications/initialized"),
			params: NotificationsParamsSchema.optional()
		});
		/**
		* A ping, issued by either the server or the client, to check that the other party is still alive. The receiver must promptly respond, or else may be disconnected.
		*/
		const PingRequestSchema = RequestSchema.extend({
			method: literal("ping"),
			params: BaseRequestParamsSchema.optional()
		});
		const ProgressSchema = object$1({
			/**
			* The progress thus far. This should increase every time progress is made, even if the total is unknown.
			*/
			progress: number(),
			/**
			* Total number of items to process (or total progress required), if known.
			*/
			total: optional$1(number()),
			/**
			* An optional message describing the current progress.
			*/
			message: optional$1(string$2())
		});
		const ProgressNotificationParamsSchema = object$1({
			...NotificationsParamsSchema.shape,
			...ProgressSchema.shape,
			/**
			* The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
			*/
			progressToken: ProgressTokenSchema
		});
		/**
		* An out-of-band notification used to inform the receiver of a progress update for a long-running request.
		*
		* @category notifications/progress
		*/
		const ProgressNotificationSchema = NotificationSchema.extend({
			method: literal("notifications/progress"),
			params: ProgressNotificationParamsSchema
		});
		const PaginatedRequestParamsSchema = BaseRequestParamsSchema.extend({ 
		/**
		* An opaque token representing the current pagination position.
		* If provided, the server should return results starting after this cursor.
		*/
cursor: CursorSchema.optional() });
		const PaginatedRequestSchema = RequestSchema.extend({ params: PaginatedRequestParamsSchema.optional() });
		const PaginatedResultSchema = ResultSchema.extend({ 
		/**
		* An opaque token representing the pagination position after the last returned result.
		* If present, there may be more results available.
		*/
nextCursor: CursorSchema.optional() });
		/**
		* The status of a task.
		* */
		const TaskStatusSchema = _enum$1([
			"working",
			"input_required",
			"completed",
			"failed",
			"cancelled"
		]);
		/**
		* A pollable state object associated with a request.
		*/
		const TaskSchema = object$1({
			taskId: string$2(),
			status: TaskStatusSchema,
			/**
			* Time in milliseconds to keep task results available after completion.
			* If null, the task has unlimited lifetime until manually cleaned up.
			*/
			ttl: union$1([number(), _null()]),
			/**
			* ISO 8601 timestamp when the task was created.
			*/
			createdAt: string$2(),
			/**
			* ISO 8601 timestamp when the task was last updated.
			*/
			lastUpdatedAt: string$2(),
			pollInterval: optional$1(number()),
			/**
			* Optional diagnostic message for failed tasks or other status information.
			*/
			statusMessage: optional$1(string$2())
		});
		/**
		* Result returned when a task is created, containing the task data wrapped in a task field.
		*/
		const CreateTaskResultSchema = ResultSchema.extend({ task: TaskSchema });
		/**
		* Parameters for task status notification.
		*/
		const TaskStatusNotificationParamsSchema = NotificationsParamsSchema.merge(TaskSchema);
		/**
		* A notification sent when a task's status changes.
		*/
		const TaskStatusNotificationSchema = NotificationSchema.extend({
			method: literal("notifications/tasks/status"),
			params: TaskStatusNotificationParamsSchema
		});
		/**
		* A request to get the state of a specific task.
		*/
		const GetTaskRequestSchema = RequestSchema.extend({
			method: literal("tasks/get"),
			params: BaseRequestParamsSchema.extend({ taskId: string$2() })
		});
		/**
		* The response to a tasks/get request.
		*/
		const GetTaskResultSchema = ResultSchema.merge(TaskSchema);
		/**
		* A request to get the result of a specific task.
		*/
		const GetTaskPayloadRequestSchema = RequestSchema.extend({
			method: literal("tasks/result"),
			params: BaseRequestParamsSchema.extend({ taskId: string$2() })
		});
		ResultSchema.loose();
		/**
		* A request to list tasks.
		*/
		const ListTasksRequestSchema = PaginatedRequestSchema.extend({ method: literal("tasks/list") });
		/**
		* The response to a tasks/list request.
		*/
		const ListTasksResultSchema = PaginatedResultSchema.extend({ tasks: array$1(TaskSchema) });
		/**
		* A request to cancel a specific task.
		*/
		const CancelTaskRequestSchema = RequestSchema.extend({
			method: literal("tasks/cancel"),
			params: BaseRequestParamsSchema.extend({ taskId: string$2() })
		});
		/**
		* The response to a tasks/cancel request.
		*/
		const CancelTaskResultSchema = ResultSchema.merge(TaskSchema);
		/**
		* The contents of a specific resource or sub-resource.
		*/
		const ResourceContentsSchema = object$1({
			/**
			* The URI of this resource.
			*/
			uri: string$2(),
			/**
			* The MIME type of this resource, if known.
			*/
			mimeType: optional$1(string$2()),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: record(string$2(), unknown$1()).optional()
		});
		const TextResourceContentsSchema = ResourceContentsSchema.extend({ 
		/**
		* The text of the item. This must only be set if the item can actually be represented as text (not binary data).
		*/
text: string$2() });
		/**
		* A Zod schema for validating Base64 strings that is more performant and
		* robust for very large inputs than the default regex-based check. It avoids
		* stack overflows by using the native `atob` function for validation.
		*/
		const Base64Schema = string$2().refine((val) => {
			try {
				atob(val);
				return true;
			} catch {
				return false;
			}
		}, { message: "Invalid Base64 string" });
		const BlobResourceContentsSchema = ResourceContentsSchema.extend({ 
		/**
		* A base64-encoded string representing the binary data of the item.
		*/
blob: Base64Schema });
		/**
		* The sender or recipient of messages and data in a conversation.
		*/
		const RoleSchema = _enum$1(["user", "assistant"]);
		/**
		* Optional annotations providing clients additional context about a resource.
		*/
		const AnnotationsSchema = object$1({
			/**
			* Intended audience(s) for the resource.
			*/
			audience: array$1(RoleSchema).optional(),
			/**
			* Importance hint for the resource, from 0 (least) to 1 (most).
			*/
			priority: number().min(0).max(1).optional(),
			/**
			* ISO 8601 timestamp for the most recent modification.
			*/
			lastModified: datetime$2({ offset: true }).optional()
		});
		/**
		* A known resource that the server is capable of reading.
		*/
		const ResourceSchema = object$1({
			...BaseMetadataSchema.shape,
			...IconsSchema.shape,
			/**
			* The URI of this resource.
			*/
			uri: string$2(),
			/**
			* A description of what this resource represents.
			*
			* This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
			*/
			description: optional$1(string$2()),
			/**
			* The MIME type of this resource, if known.
			*/
			mimeType: optional$1(string$2()),
			/**
			* The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.
			*
			* This can be used by Hosts to display file sizes and estimate context window usage.
			*/
			size: optional$1(number()),
			/**
			* Optional annotations for the client.
			*/
			annotations: AnnotationsSchema.optional(),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: optional$1(looseObject({}))
		});
		/**
		* A template description for resources available on the server.
		*/
		const ResourceTemplateSchema = object$1({
			...BaseMetadataSchema.shape,
			...IconsSchema.shape,
			/**
			* A URI template (according to RFC 6570) that can be used to construct resource URIs.
			*/
			uriTemplate: string$2(),
			/**
			* A description of what this template is for.
			*
			* This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
			*/
			description: optional$1(string$2()),
			/**
			* The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
			*/
			mimeType: optional$1(string$2()),
			/**
			* Optional annotations for the client.
			*/
			annotations: AnnotationsSchema.optional(),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: optional$1(looseObject({}))
		});
		/**
		* Sent from the client to request a list of resources the server has.
		*/
		const ListResourcesRequestSchema = PaginatedRequestSchema.extend({ method: literal("resources/list") });
		/**
		* The server's response to a resources/list request from the client.
		*/
		const ListResourcesResultSchema = PaginatedResultSchema.extend({ resources: array$1(ResourceSchema) });
		/**
		* Sent from the client to request a list of resource templates the server has.
		*/
		const ListResourceTemplatesRequestSchema = PaginatedRequestSchema.extend({ method: literal("resources/templates/list") });
		/**
		* The server's response to a resources/templates/list request from the client.
		*/
		const ListResourceTemplatesResultSchema = PaginatedResultSchema.extend({ resourceTemplates: array$1(ResourceTemplateSchema) });
		const ResourceRequestParamsSchema = BaseRequestParamsSchema.extend({ 
		/**
		* The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
		*
		* @format uri
		*/
uri: string$2() });
		/**
		* Parameters for a `resources/read` request.
		*/
		const ReadResourceRequestParamsSchema = ResourceRequestParamsSchema;
		/**
		* Sent from the client to the server, to read a specific resource URI.
		*/
		const ReadResourceRequestSchema = RequestSchema.extend({
			method: literal("resources/read"),
			params: ReadResourceRequestParamsSchema
		});
		/**
		* The server's response to a resources/read request from the client.
		*/
		const ReadResourceResultSchema = ResultSchema.extend({ contents: array$1(union$1([TextResourceContentsSchema, BlobResourceContentsSchema])) });
		/**
		* An optional notification from the server to the client, informing it that the list of resources it can read from has changed. This may be issued by servers without any previous subscription from the client.
		*/
		const ResourceListChangedNotificationSchema = NotificationSchema.extend({
			method: literal("notifications/resources/list_changed"),
			params: NotificationsParamsSchema.optional()
		});
		const SubscribeRequestParamsSchema = ResourceRequestParamsSchema;
		/**
		* Sent from the client to request resources/updated notifications from the server whenever a particular resource changes.
		*/
		const SubscribeRequestSchema = RequestSchema.extend({
			method: literal("resources/subscribe"),
			params: SubscribeRequestParamsSchema
		});
		const UnsubscribeRequestParamsSchema = ResourceRequestParamsSchema;
		/**
		* Sent from the client to request cancellation of resources/updated notifications from the server. This should follow a previous resources/subscribe request.
		*/
		const UnsubscribeRequestSchema = RequestSchema.extend({
			method: literal("resources/unsubscribe"),
			params: UnsubscribeRequestParamsSchema
		});
		/**
		* Parameters for a `notifications/resources/updated` notification.
		*/
		const ResourceUpdatedNotificationParamsSchema = NotificationsParamsSchema.extend({ 
		/**
		* The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
		*/
uri: string$2() });
		/**
		* A notification from the server to the client, informing it that a resource has changed and may need to be read again. This should only be sent if the client previously sent a resources/subscribe request.
		*/
		const ResourceUpdatedNotificationSchema = NotificationSchema.extend({
			method: literal("notifications/resources/updated"),
			params: ResourceUpdatedNotificationParamsSchema
		});
		/**
		* Describes an argument that a prompt can accept.
		*/
		const PromptArgumentSchema = object$1({
			/**
			* The name of the argument.
			*/
			name: string$2(),
			/**
			* A human-readable description of the argument.
			*/
			description: optional$1(string$2()),
			/**
			* Whether this argument must be provided.
			*/
			required: optional$1(boolean())
		});
		/**
		* A prompt or prompt template that the server offers.
		*/
		const PromptSchema = object$1({
			...BaseMetadataSchema.shape,
			...IconsSchema.shape,
			/**
			* An optional description of what this prompt provides
			*/
			description: optional$1(string$2()),
			/**
			* A list of arguments to use for templating the prompt.
			*/
			arguments: optional$1(array$1(PromptArgumentSchema)),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: optional$1(looseObject({}))
		});
		/**
		* Sent from the client to request a list of prompts and prompt templates the server has.
		*/
		const ListPromptsRequestSchema = PaginatedRequestSchema.extend({ method: literal("prompts/list") });
		/**
		* The server's response to a prompts/list request from the client.
		*/
		const ListPromptsResultSchema = PaginatedResultSchema.extend({ prompts: array$1(PromptSchema) });
		/**
		* Parameters for a `prompts/get` request.
		*/
		const GetPromptRequestParamsSchema = BaseRequestParamsSchema.extend({
			/**
			* The name of the prompt or prompt template.
			*/
			name: string$2(),
			/**
			* Arguments to use for templating the prompt.
			*/
			arguments: record(string$2(), string$2()).optional()
		});
		/**
		* Used by the client to get a prompt provided by the server.
		*/
		const GetPromptRequestSchema = RequestSchema.extend({
			method: literal("prompts/get"),
			params: GetPromptRequestParamsSchema
		});
		/**
		* Text provided to or from an LLM.
		*/
		const TextContentSchema = object$1({
			type: literal("text"),
			/**
			* The text content of the message.
			*/
			text: string$2(),
			/**
			* Optional annotations for the client.
			*/
			annotations: AnnotationsSchema.optional(),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: record(string$2(), unknown$1()).optional()
		});
		/**
		* An image provided to or from an LLM.
		*/
		const ImageContentSchema = object$1({
			type: literal("image"),
			/**
			* The base64-encoded image data.
			*/
			data: Base64Schema,
			/**
			* The MIME type of the image. Different providers may support different image types.
			*/
			mimeType: string$2(),
			/**
			* Optional annotations for the client.
			*/
			annotations: AnnotationsSchema.optional(),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: record(string$2(), unknown$1()).optional()
		});
		/**
		* An Audio provided to or from an LLM.
		*/
		const AudioContentSchema = object$1({
			type: literal("audio"),
			/**
			* The base64-encoded audio data.
			*/
			data: Base64Schema,
			/**
			* The MIME type of the audio. Different providers may support different audio types.
			*/
			mimeType: string$2(),
			/**
			* Optional annotations for the client.
			*/
			annotations: AnnotationsSchema.optional(),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: record(string$2(), unknown$1()).optional()
		});
		/**
		* A tool call request from an assistant (LLM).
		* Represents the assistant's request to use a tool.
		*/
		const ToolUseContentSchema = object$1({
			type: literal("tool_use"),
			/**
			* The name of the tool to invoke.
			* Must match a tool name from the request's tools array.
			*/
			name: string$2(),
			/**
			* Unique identifier for this tool call.
			* Used to correlate with ToolResultContent in subsequent messages.
			*/
			id: string$2(),
			/**
			* Arguments to pass to the tool.
			* Must conform to the tool's inputSchema.
			*/
			input: record(string$2(), unknown$1()),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: record(string$2(), unknown$1()).optional()
		});
		/**
		* The contents of a resource, embedded into a prompt or tool call result.
		*/
		const EmbeddedResourceSchema = object$1({
			type: literal("resource"),
			resource: union$1([TextResourceContentsSchema, BlobResourceContentsSchema]),
			/**
			* Optional annotations for the client.
			*/
			annotations: AnnotationsSchema.optional(),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: record(string$2(), unknown$1()).optional()
		});
		/**
		* A resource that the server is capable of reading, included in a prompt or tool call result.
		*
		* Note: resource links returned by tools are not guaranteed to appear in the results of `resources/list` requests.
		*/
		const ResourceLinkSchema = ResourceSchema.extend({ type: literal("resource_link") });
		/**
		* A content block that can be used in prompts and tool results.
		*/
		const ContentBlockSchema = union$1([
			TextContentSchema,
			ImageContentSchema,
			AudioContentSchema,
			ResourceLinkSchema,
			EmbeddedResourceSchema
		]);
		/**
		* Describes a message returned as part of a prompt.
		*/
		const PromptMessageSchema = object$1({
			role: RoleSchema,
			content: ContentBlockSchema
		});
		/**
		* The server's response to a prompts/get request from the client.
		*/
		const GetPromptResultSchema = ResultSchema.extend({
			/**
			* An optional description for the prompt.
			*/
			description: string$2().optional(),
			messages: array$1(PromptMessageSchema)
		});
		/**
		* An optional notification from the server to the client, informing it that the list of prompts it offers has changed. This may be issued by servers without any previous subscription from the client.
		*/
		const PromptListChangedNotificationSchema = NotificationSchema.extend({
			method: literal("notifications/prompts/list_changed"),
			params: NotificationsParamsSchema.optional()
		});
		/**
		* Additional properties describing a Tool to clients.
		*
		* NOTE: all properties in ToolAnnotations are **hints**.
		* They are not guaranteed to provide a faithful description of
		* tool behavior (including descriptive properties like `title`).
		*
		* Clients should never make tool use decisions based on ToolAnnotations
		* received from untrusted servers.
		*/
		const ToolAnnotationsSchema = object$1({
			/**
			* A human-readable title for the tool.
			*/
			title: string$2().optional(),
			/**
			* If true, the tool does not modify its environment.
			*
			* Default: false
			*/
			readOnlyHint: boolean().optional(),
			/**
			* If true, the tool may perform destructive updates to its environment.
			* If false, the tool performs only additive updates.
			*
			* (This property is meaningful only when `readOnlyHint == false`)
			*
			* Default: true
			*/
			destructiveHint: boolean().optional(),
			/**
			* If true, calling the tool repeatedly with the same arguments
			* will have no additional effect on the its environment.
			*
			* (This property is meaningful only when `readOnlyHint == false`)
			*
			* Default: false
			*/
			idempotentHint: boolean().optional(),
			/**
			* If true, this tool may interact with an "open world" of external
			* entities. If false, the tool's domain of interaction is closed.
			* For example, the world of a web search tool is open, whereas that
			* of a memory tool is not.
			*
			* Default: true
			*/
			openWorldHint: boolean().optional()
		});
		/**
		* Execution-related properties for a tool.
		*/
		const ToolExecutionSchema = object$1({ 
		/**
		* Indicates the tool's preference for task-augmented execution.
		* - "required": Clients MUST invoke the tool as a task
		* - "optional": Clients MAY invoke the tool as a task or normal request
		* - "forbidden": Clients MUST NOT attempt to invoke the tool as a task
		*
		* If not present, defaults to "forbidden".
		*/
taskSupport: _enum$1([
			"required",
			"optional",
			"forbidden"
		]).optional() });
		/**
		* Definition for a tool the client can call.
		*/
		const ToolSchema = object$1({
			...BaseMetadataSchema.shape,
			...IconsSchema.shape,
			/**
			* A human-readable description of the tool.
			*/
			description: string$2().optional(),
			/**
			* A JSON Schema 2020-12 object defining the expected parameters for the tool.
			* Must have type: 'object' at the root level per MCP spec.
			*/
			inputSchema: object$1({
				type: literal("object"),
				properties: record(string$2(), AssertObjectSchema).optional(),
				required: array$1(string$2()).optional()
			}).catchall(unknown$1()),
			/**
			* An optional JSON Schema 2020-12 object defining the structure of the tool's output
			* returned in the structuredContent field of a CallToolResult.
			* Must have type: 'object' at the root level per MCP spec.
			*/
			outputSchema: object$1({
				type: literal("object"),
				properties: record(string$2(), AssertObjectSchema).optional(),
				required: array$1(string$2()).optional()
			}).catchall(unknown$1()).optional(),
			/**
			* Optional additional tool information.
			*/
			annotations: ToolAnnotationsSchema.optional(),
			/**
			* Execution-related properties for this tool.
			*/
			execution: ToolExecutionSchema.optional(),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: record(string$2(), unknown$1()).optional()
		});
		/**
		* Sent from the client to request a list of tools the server has.
		*/
		const ListToolsRequestSchema = PaginatedRequestSchema.extend({ method: literal("tools/list") });
		/**
		* The server's response to a tools/list request from the client.
		*/
		const ListToolsResultSchema = PaginatedResultSchema.extend({ tools: array$1(ToolSchema) });
		/**
		* The server's response to a tool call.
		*/
		const CallToolResultSchema = ResultSchema.extend({
			/**
			* A list of content objects that represent the result of the tool call.
			*
			* If the Tool does not define an outputSchema, this field MUST be present in the result.
			* For backwards compatibility, this field is always present, but it may be empty.
			*/
			content: array$1(ContentBlockSchema).default([]),
			/**
			* An object containing structured tool output.
			*
			* If the Tool defines an outputSchema, this field MUST be present in the result, and contain a JSON object that matches the schema.
			*/
			structuredContent: record(string$2(), unknown$1()).optional(),
			/**
			* Whether the tool call ended in an error.
			*
			* If not set, this is assumed to be false (the call was successful).
			*
			* Any errors that originate from the tool SHOULD be reported inside the result
			* object, with `isError` set to true, _not_ as an MCP protocol-level error
			* response. Otherwise, the LLM would not be able to see that an error occurred
			* and self-correct.
			*
			* However, any errors in _finding_ the tool, an error indicating that the
			* server does not support tool calls, or any other exceptional conditions,
			* should be reported as an MCP error response.
			*/
			isError: boolean().optional()
		});
		CallToolResultSchema.or(ResultSchema.extend({ toolResult: unknown$1() }));
		/**
		* Parameters for a `tools/call` request.
		*/
		const CallToolRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
			/**
			* The name of the tool to call.
			*/
			name: string$2(),
			/**
			* Arguments to pass to the tool.
			*/
			arguments: record(string$2(), unknown$1()).optional()
		});
		/**
		* Used by the client to invoke a tool provided by the server.
		*/
		const CallToolRequestSchema = RequestSchema.extend({
			method: literal("tools/call"),
			params: CallToolRequestParamsSchema
		});
		/**
		* An optional notification from the server to the client, informing it that the list of tools it offers has changed. This may be issued by servers without any previous subscription from the client.
		*/
		const ToolListChangedNotificationSchema = NotificationSchema.extend({
			method: literal("notifications/tools/list_changed"),
			params: NotificationsParamsSchema.optional()
		});
		object$1({
			/**
			* If true, the list will be refreshed automatically when a list changed notification is received.
			* The callback will be called with the updated list.
			*
			* If false, the callback will be called with null items, allowing manual refresh.
			*
			* @default true
			*/
			autoRefresh: boolean().default(true),
			/**
			* Debounce time in milliseconds for list changed notification processing.
			*
			* Multiple notifications received within this timeframe will only trigger one refresh.
			* Set to 0 to disable debouncing.
			*
			* @default 300
			*/
			debounceMs: number().int().nonnegative().default(300)
		});
		/**
		* The severity of a log message.
		*/
		const LoggingLevelSchema = _enum$1([
			"debug",
			"info",
			"notice",
			"warning",
			"error",
			"critical",
			"alert",
			"emergency"
		]);
		/**
		* Parameters for a `logging/setLevel` request.
		*/
		const SetLevelRequestParamsSchema = BaseRequestParamsSchema.extend({ 
		/**
		* The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
		*/
level: LoggingLevelSchema });
		/**
		* A request from the client to the server, to enable or adjust logging.
		*/
		const SetLevelRequestSchema = RequestSchema.extend({
			method: literal("logging/setLevel"),
			params: SetLevelRequestParamsSchema
		});
		/**
		* Parameters for a `notifications/message` notification.
		*/
		const LoggingMessageNotificationParamsSchema = NotificationsParamsSchema.extend({
			/**
			* The severity of this log message.
			*/
			level: LoggingLevelSchema,
			/**
			* An optional name of the logger issuing this message.
			*/
			logger: string$2().optional(),
			/**
			* The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
			*/
			data: unknown$1()
		});
		/**
		* Notification of a log message passed from server to client. If no logging/setLevel request has been sent from the client, the server MAY decide which messages to send automatically.
		*/
		const LoggingMessageNotificationSchema = NotificationSchema.extend({
			method: literal("notifications/message"),
			params: LoggingMessageNotificationParamsSchema
		});
		/**
		* The server's preferences for model selection, requested of the client during sampling.
		*/
		const ModelPreferencesSchema = object$1({
			/**
			* Optional hints to use for model selection.
			*/
			hints: array$1(object$1({ 
			/**
			* A hint for a model name.
			*/
name: string$2().optional() })).optional(),
			/**
			* How much to prioritize cost when selecting a model.
			*/
			costPriority: number().min(0).max(1).optional(),
			/**
			* How much to prioritize sampling speed (latency) when selecting a model.
			*/
			speedPriority: number().min(0).max(1).optional(),
			/**
			* How much to prioritize intelligence and capabilities when selecting a model.
			*/
			intelligencePriority: number().min(0).max(1).optional()
		});
		/**
		* Controls tool usage behavior in sampling requests.
		*/
		const ToolChoiceSchema = object$1({ 
		/**
		* Controls when tools are used:
		* - "auto": Model decides whether to use tools (default)
		* - "required": Model MUST use at least one tool before completing
		* - "none": Model MUST NOT use any tools
		*/
mode: _enum$1([
			"auto",
			"required",
			"none"
		]).optional() });
		/**
		* The result of a tool execution, provided by the user (server).
		* Represents the outcome of invoking a tool requested via ToolUseContent.
		*/
		const ToolResultContentSchema = object$1({
			type: literal("tool_result"),
			toolUseId: string$2().describe("The unique identifier for the corresponding tool call."),
			content: array$1(ContentBlockSchema).default([]),
			structuredContent: object$1({}).loose().optional(),
			isError: boolean().optional(),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: record(string$2(), unknown$1()).optional()
		});
		/**
		* Basic content types for sampling responses (without tool use).
		* Used for backwards-compatible CreateMessageResult when tools are not used.
		*/
		const SamplingContentSchema = discriminatedUnion("type", [
			TextContentSchema,
			ImageContentSchema,
			AudioContentSchema
		]);
		/**
		* Content block types allowed in sampling messages.
		* This includes text, image, audio, tool use requests, and tool results.
		*/
		const SamplingMessageContentBlockSchema = discriminatedUnion("type", [
			TextContentSchema,
			ImageContentSchema,
			AudioContentSchema,
			ToolUseContentSchema,
			ToolResultContentSchema
		]);
		/**
		* Describes a message issued to or received from an LLM API.
		*/
		const SamplingMessageSchema = object$1({
			role: RoleSchema,
			content: union$1([SamplingMessageContentBlockSchema, array$1(SamplingMessageContentBlockSchema)]),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: record(string$2(), unknown$1()).optional()
		});
		/**
		* Parameters for a `sampling/createMessage` request.
		*/
		const CreateMessageRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
			messages: array$1(SamplingMessageSchema),
			/**
			* The server's preferences for which model to select. The client MAY modify or omit this request.
			*/
			modelPreferences: ModelPreferencesSchema.optional(),
			/**
			* An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
			*/
			systemPrompt: string$2().optional(),
			/**
			* A request to include context from one or more MCP servers (including the caller), to be attached to the prompt.
			* The client MAY ignore this request.
			*
			* Default is "none". Values "thisServer" and "allServers" are soft-deprecated. Servers SHOULD only use these values if the client
			* declares ClientCapabilities.sampling.context. These values may be removed in future spec releases.
			*/
			includeContext: _enum$1([
				"none",
				"thisServer",
				"allServers"
			]).optional(),
			temperature: number().optional(),
			/**
			* The requested maximum number of tokens to sample (to prevent runaway completions).
			*
			* The client MAY choose to sample fewer tokens than the requested maximum.
			*/
			maxTokens: number().int(),
			stopSequences: array$1(string$2()).optional(),
			/**
			* Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
			*/
			metadata: AssertObjectSchema.optional(),
			/**
			* Tools that the model may use during generation.
			* The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
			*/
			tools: array$1(ToolSchema).optional(),
			/**
			* Controls how the model uses tools.
			* The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
			* Default is `{ mode: "auto" }`.
			*/
			toolChoice: ToolChoiceSchema.optional()
		});
		/**
		* A request from the server to sample an LLM via the client. The client has full discretion over which model to select. The client should also inform the user before beginning sampling, to allow them to inspect the request (human in the loop) and decide whether to approve it.
		*/
		const CreateMessageRequestSchema = RequestSchema.extend({
			method: literal("sampling/createMessage"),
			params: CreateMessageRequestParamsSchema
		});
		/**
		* The client's response to a sampling/create_message request from the server.
		* This is the backwards-compatible version that returns single content (no arrays).
		* Used when the request does not include tools.
		*/
		const CreateMessageResultSchema = ResultSchema.extend({
			/**
			* The name of the model that generated the message.
			*/
			model: string$2(),
			/**
			* The reason why sampling stopped, if known.
			*
			* Standard values:
			* - "endTurn": Natural end of the assistant's turn
			* - "stopSequence": A stop sequence was encountered
			* - "maxTokens": Maximum token limit was reached
			*
			* This field is an open string to allow for provider-specific stop reasons.
			*/
			stopReason: optional$1(_enum$1([
				"endTurn",
				"stopSequence",
				"maxTokens"
			]).or(string$2())),
			role: RoleSchema,
			/**
			* Response content. Single content block (text, image, or audio).
			*/
			content: SamplingContentSchema
		});
		/**
		* The client's response to a sampling/create_message request when tools were provided.
		* This version supports array content for tool use flows.
		*/
		const CreateMessageResultWithToolsSchema = ResultSchema.extend({
			/**
			* The name of the model that generated the message.
			*/
			model: string$2(),
			/**
			* The reason why sampling stopped, if known.
			*
			* Standard values:
			* - "endTurn": Natural end of the assistant's turn
			* - "stopSequence": A stop sequence was encountered
			* - "maxTokens": Maximum token limit was reached
			* - "toolUse": The model wants to use one or more tools
			*
			* This field is an open string to allow for provider-specific stop reasons.
			*/
			stopReason: optional$1(_enum$1([
				"endTurn",
				"stopSequence",
				"maxTokens",
				"toolUse"
			]).or(string$2())),
			role: RoleSchema,
			/**
			* Response content. May be a single block or array. May include ToolUseContent if stopReason is "toolUse".
			*/
			content: union$1([SamplingMessageContentBlockSchema, array$1(SamplingMessageContentBlockSchema)])
		});
		/**
		* Primitive schema definition for boolean fields.
		*/
		const BooleanSchemaSchema = object$1({
			type: literal("boolean"),
			title: string$2().optional(),
			description: string$2().optional(),
			default: boolean().optional()
		});
		/**
		* Primitive schema definition for string fields.
		*/
		const StringSchemaSchema = object$1({
			type: literal("string"),
			title: string$2().optional(),
			description: string$2().optional(),
			minLength: number().optional(),
			maxLength: number().optional(),
			format: _enum$1([
				"email",
				"uri",
				"date",
				"date-time"
			]).optional(),
			default: string$2().optional()
		});
		/**
		* Primitive schema definition for number fields.
		*/
		const NumberSchemaSchema = object$1({
			type: _enum$1(["number", "integer"]),
			title: string$2().optional(),
			description: string$2().optional(),
			minimum: number().optional(),
			maximum: number().optional(),
			default: number().optional()
		});
		/**
		* Schema for single-selection enumeration without display titles for options.
		*/
		const UntitledSingleSelectEnumSchemaSchema = object$1({
			type: literal("string"),
			title: string$2().optional(),
			description: string$2().optional(),
			enum: array$1(string$2()),
			default: string$2().optional()
		});
		/**
		* Schema for single-selection enumeration with display titles for each option.
		*/
		const TitledSingleSelectEnumSchemaSchema = object$1({
			type: literal("string"),
			title: string$2().optional(),
			description: string$2().optional(),
			oneOf: array$1(object$1({
				const: string$2(),
				title: string$2()
			})),
			default: string$2().optional()
		});
		/**
		* Union of all primitive schema definitions.
		*/
		const PrimitiveSchemaDefinitionSchema = union$1([
			union$1([
				object$1({
					type: literal("string"),
					title: string$2().optional(),
					description: string$2().optional(),
					enum: array$1(string$2()),
					enumNames: array$1(string$2()).optional(),
					default: string$2().optional()
				}),
				union$1([UntitledSingleSelectEnumSchemaSchema, TitledSingleSelectEnumSchemaSchema]),
				union$1([object$1({
					type: literal("array"),
					title: string$2().optional(),
					description: string$2().optional(),
					minItems: number().optional(),
					maxItems: number().optional(),
					items: object$1({
						type: literal("string"),
						enum: array$1(string$2())
					}),
					default: array$1(string$2()).optional()
				}), object$1({
					type: literal("array"),
					title: string$2().optional(),
					description: string$2().optional(),
					minItems: number().optional(),
					maxItems: number().optional(),
					items: object$1({ anyOf: array$1(object$1({
						const: string$2(),
						title: string$2()
					})) }),
					default: array$1(string$2()).optional()
				})])
			]),
			BooleanSchemaSchema,
			StringSchemaSchema,
			NumberSchemaSchema
		]);
		/**
		* The parameters for a request to elicit additional information from the user via the client.
		*/
		const ElicitRequestParamsSchema = union$1([TaskAugmentedRequestParamsSchema.extend({
			/**
			* The elicitation mode.
			*
			* Optional for backward compatibility. Clients MUST treat missing mode as "form".
			*/
			mode: literal("form").optional(),
			/**
			* The message to present to the user describing what information is being requested.
			*/
			message: string$2(),
			/**
			* A restricted subset of JSON Schema.
			* Only top-level properties are allowed, without nesting.
			*/
			requestedSchema: object$1({
				type: literal("object"),
				properties: record(string$2(), PrimitiveSchemaDefinitionSchema),
				required: array$1(string$2()).optional()
			})
		}), TaskAugmentedRequestParamsSchema.extend({
			/**
			* The elicitation mode.
			*/
			mode: literal("url"),
			/**
			* The message to present to the user explaining why the interaction is needed.
			*/
			message: string$2(),
			/**
			* The ID of the elicitation, which must be unique within the context of the server.
			* The client MUST treat this ID as an opaque value.
			*/
			elicitationId: string$2(),
			/**
			* The URL that the user should navigate to.
			*/
			url: string$2().url()
		})]);
		/**
		* A request from the server to elicit user input via the client.
		* The client should present the message and form fields to the user (form mode)
		* or navigate to a URL (URL mode).
		*/
		const ElicitRequestSchema = RequestSchema.extend({
			method: literal("elicitation/create"),
			params: ElicitRequestParamsSchema
		});
		/**
		* Parameters for a `notifications/elicitation/complete` notification.
		*
		* @category notifications/elicitation/complete
		*/
		const ElicitationCompleteNotificationParamsSchema = NotificationsParamsSchema.extend({ 
		/**
		* The ID of the elicitation that completed.
		*/
elicitationId: string$2() });
		/**
		* A notification from the server to the client, informing it of a completion of an out-of-band elicitation request.
		*
		* @category notifications/elicitation/complete
		*/
		const ElicitationCompleteNotificationSchema = NotificationSchema.extend({
			method: literal("notifications/elicitation/complete"),
			params: ElicitationCompleteNotificationParamsSchema
		});
		/**
		* The client's response to an elicitation/create request from the server.
		*/
		const ElicitResultSchema = ResultSchema.extend({
			/**
			* The user action in response to the elicitation.
			* - "accept": User submitted the form/confirmed the action
			* - "decline": User explicitly decline the action
			* - "cancel": User dismissed without making an explicit choice
			*/
			action: _enum$1([
				"accept",
				"decline",
				"cancel"
			]),
			/**
			* The submitted form data, only present when action is "accept".
			* Contains values matching the requested schema.
			* Per MCP spec, content is "typically omitted" for decline/cancel actions.
			* We normalize null to undefined for leniency while maintaining type compatibility.
			*/
			content: preprocess((val) => val === null ? void 0 : val, record(string$2(), union$1([
				string$2(),
				number(),
				boolean(),
				array$1(string$2())
			])).optional())
		});
		/**
		* A reference to a resource or resource template definition.
		*/
		const ResourceTemplateReferenceSchema = object$1({
			type: literal("ref/resource"),
			/**
			* The URI or URI template of the resource.
			*/
			uri: string$2()
		});
		/**
		* Identifies a prompt.
		*/
		const PromptReferenceSchema = object$1({
			type: literal("ref/prompt"),
			/**
			* The name of the prompt or prompt template
			*/
			name: string$2()
		});
		/**
		* Parameters for a `completion/complete` request.
		*/
		const CompleteRequestParamsSchema = BaseRequestParamsSchema.extend({
			ref: union$1([PromptReferenceSchema, ResourceTemplateReferenceSchema]),
			/**
			* The argument's information
			*/
			argument: object$1({
				/**
				* The name of the argument
				*/
				name: string$2(),
				/**
				* The value of the argument to use for completion matching.
				*/
				value: string$2()
			}),
			context: object$1({ 
			/**
			* Previously-resolved variables in a URI template or prompt.
			*/
arguments: record(string$2(), string$2()).optional() }).optional()
		});
		/**
		* A request from the client to the server, to ask for completion options.
		*/
		const CompleteRequestSchema = RequestSchema.extend({
			method: literal("completion/complete"),
			params: CompleteRequestParamsSchema
		});
		/**
		* The server's response to a completion/complete request
		*/
		const CompleteResultSchema = ResultSchema.extend({ completion: looseObject({
			/**
			* An array of completion values. Must not exceed 100 items.
			*/
			values: array$1(string$2()).max(100),
			/**
			* The total number of completion options available. This can exceed the number of values actually sent in the response.
			*/
			total: optional$1(number().int()),
			/**
			* Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
			*/
			hasMore: optional$1(boolean())
		}) });
		/**
		* Represents a root directory or file that the server can operate on.
		*/
		const RootSchema = object$1({
			/**
			* The URI identifying the root. This *must* start with file:// for now.
			*/
			uri: string$2().startsWith("file://"),
			/**
			* An optional name for the root.
			*/
			name: string$2().optional(),
			/**
			* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
			* for notes on _meta usage.
			*/
			_meta: record(string$2(), unknown$1()).optional()
		});
		/**
		* Sent from the server to request a list of root URIs from the client.
		*/
		const ListRootsRequestSchema = RequestSchema.extend({
			method: literal("roots/list"),
			params: BaseRequestParamsSchema.optional()
		});
		/**
		* The client's response to a roots/list request from the server.
		*/
		const ListRootsResultSchema = ResultSchema.extend({ roots: array$1(RootSchema) });
		/**
		* A notification from the client to the server, informing it that the list of roots has changed.
		*/
		const RootsListChangedNotificationSchema = NotificationSchema.extend({
			method: literal("notifications/roots/list_changed"),
			params: NotificationsParamsSchema.optional()
		});
		union$1([
			PingRequestSchema,
			InitializeRequestSchema,
			CompleteRequestSchema,
			SetLevelRequestSchema,
			GetPromptRequestSchema,
			ListPromptsRequestSchema,
			ListResourcesRequestSchema,
			ListResourceTemplatesRequestSchema,
			ReadResourceRequestSchema,
			SubscribeRequestSchema,
			UnsubscribeRequestSchema,
			CallToolRequestSchema,
			ListToolsRequestSchema,
			GetTaskRequestSchema,
			GetTaskPayloadRequestSchema,
			ListTasksRequestSchema,
			CancelTaskRequestSchema
		]);
		union$1([
			CancelledNotificationSchema,
			ProgressNotificationSchema,
			InitializedNotificationSchema,
			RootsListChangedNotificationSchema,
			TaskStatusNotificationSchema
		]);
		union$1([
			EmptyResultSchema,
			CreateMessageResultSchema,
			CreateMessageResultWithToolsSchema,
			ElicitResultSchema,
			ListRootsResultSchema,
			GetTaskResultSchema,
			ListTasksResultSchema,
			CreateTaskResultSchema
		]);
		union$1([
			PingRequestSchema,
			CreateMessageRequestSchema,
			ElicitRequestSchema,
			ListRootsRequestSchema,
			GetTaskRequestSchema,
			GetTaskPayloadRequestSchema,
			ListTasksRequestSchema,
			CancelTaskRequestSchema
		]);
		union$1([
			CancelledNotificationSchema,
			ProgressNotificationSchema,
			LoggingMessageNotificationSchema,
			ResourceUpdatedNotificationSchema,
			ResourceListChangedNotificationSchema,
			ToolListChangedNotificationSchema,
			PromptListChangedNotificationSchema,
			TaskStatusNotificationSchema,
			ElicitationCompleteNotificationSchema
		]);
		union$1([
			EmptyResultSchema,
			InitializeResultSchema,
			CompleteResultSchema,
			GetPromptResultSchema,
			ListPromptsResultSchema,
			ListResourcesResultSchema,
			ListResourceTemplatesResultSchema,
			ReadResourceResultSchema,
			CallToolResultSchema,
			ListToolsResultSchema,
			GetTaskResultSchema,
			ListTasksResultSchema,
			CreateTaskResultSchema
		]);
		var McpError = class McpError extends Error {
			constructor(code, message, data) {
				super(`MCP error ${code}: ${message}`);
				this.code = code;
				this.data = data;
				this.name = "McpError";
			}
			/**
			* Factory method to create the appropriate error type based on the error code and data
			*/
			static fromError(code, message, data) {
				if (code === ErrorCode.UrlElicitationRequired && data) {
					const errorData = data;
					if (errorData.elicitations) return new UrlElicitationRequiredError(errorData.elicitations, message);
				}
				return new McpError(code, message, data);
			}
		};
		/**
		* Specialized error type when a tool requires a URL mode elicitation.
		* This makes it nicer for the client to handle since there is specific data to work with instead of just a code to check against.
		*/
		var UrlElicitationRequiredError = class extends McpError {
			constructor(elicitations, message = `URL elicitation${elicitations.length > 1 ? "s" : ""} required`) {
				super(ErrorCode.UrlElicitationRequired, message, { elicitations });
			}
			get elicitations() {
				return this.data?.elicitations ?? [];
			}
		};
		//#endregion
		//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.6.5/node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-compat.js
		function isZ4Schema(s) {
			return !!s._zod;
		}
		function safeParse$2(schema, data) {
			if (isZ4Schema(schema)) return safeParse$4(schema, data);
			return schema.safeParse(data);
		}
		function getObjectShape(schema) {
			if (!schema) return void 0;
			let rawShape;
			if (isZ4Schema(schema)) rawShape = schema._zod?.def?.shape;
			else rawShape = schema.shape;
			if (!rawShape) return void 0;
			if (typeof rawShape === "function") try {
				return rawShape();
			} catch {
				return;
			}
			return rawShape;
		}
		/**
		* Gets the literal value from a schema, if it's a literal schema.
		* Works with both Zod v3 and v4.
		* Returns undefined if the schema is not a literal or the value cannot be determined.
		*/
		function getLiteralValue(schema) {
			if (isZ4Schema(schema)) {
				const def = schema._zod?.def;
				if (def) {
					if (def.value !== void 0) return def.value;
					if (Array.isArray(def.values) && def.values.length > 0) return def.values[0];
				}
			}
			const def = schema._def;
			if (def) {
				if (def.value !== void 0) return def.value;
				if (Array.isArray(def.values) && def.values.length > 0) return def.values[0];
			}
			const directValue = schema.value;
			if (directValue !== void 0) return directValue;
		}
		//#endregion
		//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.6.5/node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/interfaces.js
		/**
		* Experimental task interfaces for MCP SDK.
		* WARNING: These APIs are experimental and may change without notice.
		*/
		/**
		* Checks if a task status represents a terminal state.
		* Terminal states are those where the task has finished and will not change.
		*
		* @param status - The task status to check
		* @returns True if the status is terminal (completed, failed, or cancelled)
		* @experimental
		*/
		function isTerminal(status) {
			return status === "completed" || status === "failed" || status === "cancelled";
		}
		//#endregion
		//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.6.5/node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-json-schema-compat.js
		function getMethodLiteral(schema) {
			const methodSchema = getObjectShape(schema)?.method;
			if (!methodSchema) throw new Error("Schema is missing a method literal");
			const value = getLiteralValue(methodSchema);
			if (typeof value !== "string") throw new Error("Schema method literal must be a string");
			return value;
		}
		function parseWithCompat(schema, data) {
			const result = safeParse$2(schema, data);
			if (!result.success) throw result.error;
			return result.data;
		}
		/**
		* Implements MCP protocol framing on top of a pluggable transport, including
		* features like request/response linking, notifications, and progress.
		*/
		var Protocol = class {
			constructor(_options) {
				this._options = _options;
				this._requestMessageId = 0;
				this._requestHandlers = /* @__PURE__ */ new Map();
				this._requestHandlerAbortControllers = /* @__PURE__ */ new Map();
				this._notificationHandlers = /* @__PURE__ */ new Map();
				this._responseHandlers = /* @__PURE__ */ new Map();
				this._progressHandlers = /* @__PURE__ */ new Map();
				this._timeoutInfo = /* @__PURE__ */ new Map();
				this._pendingDebouncedNotifications = /* @__PURE__ */ new Set();
				this._taskProgressTokens = /* @__PURE__ */ new Map();
				this._requestResolvers = /* @__PURE__ */ new Map();
				this.setNotificationHandler(CancelledNotificationSchema, (notification) => {
					this._oncancel(notification);
				});
				this.setNotificationHandler(ProgressNotificationSchema, (notification) => {
					this._onprogress(notification);
				});
				this.setRequestHandler(PingRequestSchema, (_request) => ({}));
				this._taskStore = _options?.taskStore;
				this._taskMessageQueue = _options?.taskMessageQueue;
				if (this._taskStore) {
					this.setRequestHandler(GetTaskRequestSchema, async (request, extra) => {
						const task = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
						if (!task) throw new McpError(ErrorCode.InvalidParams, "Failed to retrieve task: Task not found");
						return { ...task };
					});
					this.setRequestHandler(GetTaskPayloadRequestSchema, async (request, extra) => {
						const handleTaskResult = async () => {
							const taskId = request.params.taskId;
							if (this._taskMessageQueue) {
								let queuedMessage;
								while (queuedMessage = await this._taskMessageQueue.dequeue(taskId, extra.sessionId)) {
									if (queuedMessage.type === "response" || queuedMessage.type === "error") {
										const message = queuedMessage.message;
										const requestId = message.id;
										const resolver = this._requestResolvers.get(requestId);
										if (resolver) {
											this._requestResolvers.delete(requestId);
											if (queuedMessage.type === "response") resolver(message);
											else {
												const errorMessage = message;
												resolver(new McpError(errorMessage.error.code, errorMessage.error.message, errorMessage.error.data));
											}
										} else {
											const messageType = queuedMessage.type === "response" ? "Response" : "Error";
											this._onerror(/* @__PURE__ */ new Error(`${messageType} handler missing for request ${requestId}`));
										}
										continue;
									}
									await this._transport?.send(queuedMessage.message, { relatedRequestId: extra.requestId });
								}
							}
							const task = await this._taskStore.getTask(taskId, extra.sessionId);
							if (!task) throw new McpError(ErrorCode.InvalidParams, `Task not found: ${taskId}`);
							if (!isTerminal(task.status)) {
								await this._waitForTaskUpdate(taskId, extra.signal);
								return await handleTaskResult();
							}
							if (isTerminal(task.status)) {
								const result = await this._taskStore.getTaskResult(taskId, extra.sessionId);
								this._clearTaskQueue(taskId);
								return {
									...result,
									_meta: {
										...result._meta,
										[RELATED_TASK_META_KEY]: { taskId }
									}
								};
							}
							return await handleTaskResult();
						};
						return await handleTaskResult();
					});
					this.setRequestHandler(ListTasksRequestSchema, async (request, extra) => {
						try {
							const { tasks, nextCursor } = await this._taskStore.listTasks(request.params?.cursor, extra.sessionId);
							return {
								tasks,
								nextCursor,
								_meta: {}
							};
						} catch (error) {
							throw new McpError(ErrorCode.InvalidParams, `Failed to list tasks: ${error instanceof Error ? error.message : String(error)}`);
						}
					});
					this.setRequestHandler(CancelTaskRequestSchema, async (request, extra) => {
						try {
							const task = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
							if (!task) throw new McpError(ErrorCode.InvalidParams, `Task not found: ${request.params.taskId}`);
							if (isTerminal(task.status)) throw new McpError(ErrorCode.InvalidParams, `Cannot cancel task in terminal status: ${task.status}`);
							await this._taskStore.updateTaskStatus(request.params.taskId, "cancelled", "Client cancelled task execution.", extra.sessionId);
							this._clearTaskQueue(request.params.taskId);
							const cancelledTask = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
							if (!cancelledTask) throw new McpError(ErrorCode.InvalidParams, `Task not found after cancellation: ${request.params.taskId}`);
							return {
								_meta: {},
								...cancelledTask
							};
						} catch (error) {
							if (error instanceof McpError) throw error;
							throw new McpError(ErrorCode.InvalidRequest, `Failed to cancel task: ${error instanceof Error ? error.message : String(error)}`);
						}
					});
				}
			}
			async _oncancel(notification) {
				if (!notification.params.requestId) return;
				this._requestHandlerAbortControllers.get(notification.params.requestId)?.abort(notification.params.reason);
			}
			_setupTimeout(messageId, timeout, maxTotalTimeout, onTimeout, resetTimeoutOnProgress = false) {
				this._timeoutInfo.set(messageId, {
					timeoutId: setTimeout(onTimeout, timeout),
					startTime: Date.now(),
					timeout,
					maxTotalTimeout,
					resetTimeoutOnProgress,
					onTimeout
				});
			}
			_resetTimeout(messageId) {
				const info = this._timeoutInfo.get(messageId);
				if (!info) return false;
				const totalElapsed = Date.now() - info.startTime;
				if (info.maxTotalTimeout && totalElapsed >= info.maxTotalTimeout) {
					this._timeoutInfo.delete(messageId);
					throw McpError.fromError(ErrorCode.RequestTimeout, "Maximum total timeout exceeded", {
						maxTotalTimeout: info.maxTotalTimeout,
						totalElapsed
					});
				}
				clearTimeout(info.timeoutId);
				info.timeoutId = setTimeout(info.onTimeout, info.timeout);
				return true;
			}
			_cleanupTimeout(messageId) {
				const info = this._timeoutInfo.get(messageId);
				if (info) {
					clearTimeout(info.timeoutId);
					this._timeoutInfo.delete(messageId);
				}
			}
			/**
			* Attaches to the given transport, starts it, and starts listening for messages.
			*
			* The Protocol object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
			*/
			async connect(transport) {
				if (this._transport) throw new Error("Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.");
				this._transport = transport;
				const _onclose = this.transport?.onclose;
				this._transport.onclose = () => {
					_onclose?.();
					this._onclose();
				};
				const _onerror = this.transport?.onerror;
				this._transport.onerror = (error) => {
					_onerror?.(error);
					this._onerror(error);
				};
				const _onmessage = this._transport?.onmessage;
				this._transport.onmessage = (message, extra) => {
					_onmessage?.(message, extra);
					if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) this._onresponse(message);
					else if (isJSONRPCRequest(message)) this._onrequest(message, extra);
					else if (isJSONRPCNotification(message)) this._onnotification(message);
					else this._onerror(/* @__PURE__ */ new Error(`Unknown message type: ${JSON.stringify(message)}`));
				};
				await this._transport.start();
			}
			_onclose() {
				const responseHandlers = this._responseHandlers;
				this._responseHandlers = /* @__PURE__ */ new Map();
				this._progressHandlers.clear();
				this._taskProgressTokens.clear();
				this._pendingDebouncedNotifications.clear();
				for (const info of this._timeoutInfo.values()) clearTimeout(info.timeoutId);
				this._timeoutInfo.clear();
				for (const controller of this._requestHandlerAbortControllers.values()) controller.abort();
				this._requestHandlerAbortControllers.clear();
				const error = McpError.fromError(ErrorCode.ConnectionClosed, "Connection closed");
				this._transport = void 0;
				this.onclose?.();
				for (const handler of responseHandlers.values()) handler(error);
			}
			_onerror(error) {
				this.onerror?.(error);
			}
			_onnotification(notification) {
				const handler = this._notificationHandlers.get(notification.method) ?? this.fallbackNotificationHandler;
				if (handler === void 0) return;
				Promise.resolve().then(() => handler(notification)).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Uncaught error in notification handler: ${error}`)));
			}
			_onrequest(request, extra) {
				const handler = this._requestHandlers.get(request.method) ?? this.fallbackRequestHandler;
				const capturedTransport = this._transport;
				const relatedTaskId = request.params?._meta?.[RELATED_TASK_META_KEY]?.taskId;
				if (handler === void 0) {
					const errorResponse = {
						jsonrpc: "2.0",
						id: request.id,
						error: {
							code: ErrorCode.MethodNotFound,
							message: "Method not found"
						}
					};
					if (relatedTaskId && this._taskMessageQueue) this._enqueueTaskMessage(relatedTaskId, {
						type: "error",
						message: errorResponse,
						timestamp: Date.now()
					}, capturedTransport?.sessionId).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Failed to enqueue error response: ${error}`)));
					else capturedTransport?.send(errorResponse).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Failed to send an error response: ${error}`)));
					return;
				}
				const abortController = new AbortController();
				this._requestHandlerAbortControllers.set(request.id, abortController);
				const taskCreationParams = isTaskAugmentedRequestParams(request.params) ? request.params.task : void 0;
				const taskStore = this._taskStore ? this.requestTaskStore(request, capturedTransport?.sessionId) : void 0;
				const fullExtra = {
					signal: abortController.signal,
					sessionId: capturedTransport?.sessionId,
					_meta: request.params?._meta,
					sendNotification: async (notification) => {
						if (abortController.signal.aborted) return;
						const notificationOptions = { relatedRequestId: request.id };
						if (relatedTaskId) notificationOptions.relatedTask = { taskId: relatedTaskId };
						await this.notification(notification, notificationOptions);
					},
					sendRequest: async (r, resultSchema, options) => {
						if (abortController.signal.aborted) throw new McpError(ErrorCode.ConnectionClosed, "Request was cancelled");
						const requestOptions = {
							...options,
							relatedRequestId: request.id
						};
						if (relatedTaskId && !requestOptions.relatedTask) requestOptions.relatedTask = { taskId: relatedTaskId };
						const effectiveTaskId = requestOptions.relatedTask?.taskId ?? relatedTaskId;
						if (effectiveTaskId && taskStore) await taskStore.updateTaskStatus(effectiveTaskId, "input_required");
						return await this.request(r, resultSchema, requestOptions);
					},
					authInfo: extra?.authInfo,
					requestId: request.id,
					requestInfo: extra?.requestInfo,
					taskId: relatedTaskId,
					taskStore,
					taskRequestedTtl: taskCreationParams?.ttl,
					closeSSEStream: extra?.closeSSEStream,
					closeStandaloneSSEStream: extra?.closeStandaloneSSEStream
				};
				Promise.resolve().then(() => {
					if (taskCreationParams) this.assertTaskHandlerCapability(request.method);
				}).then(() => handler(request, fullExtra)).then(async (result) => {
					if (abortController.signal.aborted) return;
					const response = {
						result,
						jsonrpc: "2.0",
						id: request.id
					};
					if (relatedTaskId && this._taskMessageQueue) await this._enqueueTaskMessage(relatedTaskId, {
						type: "response",
						message: response,
						timestamp: Date.now()
					}, capturedTransport?.sessionId);
					else await capturedTransport?.send(response);
				}, async (error) => {
					if (abortController.signal.aborted) return;
					const errorResponse = {
						jsonrpc: "2.0",
						id: request.id,
						error: {
							code: Number.isSafeInteger(error["code"]) ? error["code"] : ErrorCode.InternalError,
							message: error.message ?? "Internal error",
							...error["data"] !== void 0 && { data: error["data"] }
						}
					};
					if (relatedTaskId && this._taskMessageQueue) await this._enqueueTaskMessage(relatedTaskId, {
						type: "error",
						message: errorResponse,
						timestamp: Date.now()
					}, capturedTransport?.sessionId);
					else await capturedTransport?.send(errorResponse);
				}).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Failed to send response: ${error}`))).finally(() => {
					if (this._requestHandlerAbortControllers.get(request.id) === abortController) this._requestHandlerAbortControllers.delete(request.id);
				});
			}
			_onprogress(notification) {
				const { progressToken, ...params } = notification.params;
				const messageId = Number(progressToken);
				const handler = this._progressHandlers.get(messageId);
				if (!handler) {
					this._onerror(/* @__PURE__ */ new Error(`Received a progress notification for an unknown token: ${JSON.stringify(notification)}`));
					return;
				}
				const responseHandler = this._responseHandlers.get(messageId);
				const timeoutInfo = this._timeoutInfo.get(messageId);
				if (timeoutInfo && responseHandler && timeoutInfo.resetTimeoutOnProgress) try {
					this._resetTimeout(messageId);
				} catch (error) {
					this._responseHandlers.delete(messageId);
					this._progressHandlers.delete(messageId);
					this._cleanupTimeout(messageId);
					responseHandler(error);
					return;
				}
				handler(params);
			}
			_onresponse(response) {
				const messageId = Number(response.id);
				const resolver = this._requestResolvers.get(messageId);
				if (resolver) {
					this._requestResolvers.delete(messageId);
					if (isJSONRPCResultResponse(response)) resolver(response);
					else resolver(new McpError(response.error.code, response.error.message, response.error.data));
					return;
				}
				const handler = this._responseHandlers.get(messageId);
				if (handler === void 0) {
					this._onerror(/* @__PURE__ */ new Error(`Received a response for an unknown message ID: ${JSON.stringify(response)}`));
					return;
				}
				this._responseHandlers.delete(messageId);
				this._cleanupTimeout(messageId);
				let isTaskResponse = false;
				if (isJSONRPCResultResponse(response) && response.result && typeof response.result === "object") {
					const result = response.result;
					if (result.task && typeof result.task === "object") {
						const task = result.task;
						if (typeof task.taskId === "string") {
							isTaskResponse = true;
							this._taskProgressTokens.set(task.taskId, messageId);
						}
					}
				}
				if (!isTaskResponse) this._progressHandlers.delete(messageId);
				if (isJSONRPCResultResponse(response)) handler(response);
				else handler(McpError.fromError(response.error.code, response.error.message, response.error.data));
			}
			get transport() {
				return this._transport;
			}
			/**
			* Closes the connection.
			*/
			async close() {
				await this._transport?.close();
			}
			/**
			* Sends a request and returns an AsyncGenerator that yields response messages.
			* The generator is guaranteed to end with either a 'result' or 'error' message.
			*
			* @example
			* ```typescript
			* const stream = protocol.requestStream(request, resultSchema, options);
			* for await (const message of stream) {
			*   switch (message.type) {
			*     case 'taskCreated':
			*       console.log('Task created:', message.task.taskId);
			*       break;
			*     case 'taskStatus':
			*       console.log('Task status:', message.task.status);
			*       break;
			*     case 'result':
			*       console.log('Final result:', message.result);
			*       break;
			*     case 'error':
			*       console.error('Error:', message.error);
			*       break;
			*   }
			* }
			* ```
			*
			* @experimental Use `client.experimental.tasks.requestStream()` to access this method.
			*/
			async *requestStream(request, resultSchema, options) {
				const { task } = options ?? {};
				if (!task) {
					try {
						yield {
							type: "result",
							result: await this.request(request, resultSchema, options)
						};
					} catch (error) {
						yield {
							type: "error",
							error: error instanceof McpError ? error : new McpError(ErrorCode.InternalError, String(error))
						};
					}
					return;
				}
				let taskId;
				try {
					const createResult = await this.request(request, CreateTaskResultSchema, options);
					if (createResult.task) {
						taskId = createResult.task.taskId;
						yield {
							type: "taskCreated",
							task: createResult.task
						};
					} else throw new McpError(ErrorCode.InternalError, "Task creation did not return a task");
					while (true) {
						const task = await this.getTask({ taskId }, options);
						yield {
							type: "taskStatus",
							task
						};
						if (isTerminal(task.status)) {
							if (task.status === "completed") yield {
								type: "result",
								result: await this.getTaskResult({ taskId }, resultSchema, options)
							};
							else if (task.status === "failed") yield {
								type: "error",
								error: new McpError(ErrorCode.InternalError, `Task ${taskId} failed`)
							};
							else if (task.status === "cancelled") yield {
								type: "error",
								error: new McpError(ErrorCode.InternalError, `Task ${taskId} was cancelled`)
							};
							return;
						}
						if (task.status === "input_required") {
							yield {
								type: "result",
								result: await this.getTaskResult({ taskId }, resultSchema, options)
							};
							return;
						}
						const pollInterval = task.pollInterval ?? this._options?.defaultTaskPollInterval ?? 1e3;
						await new Promise((resolve) => setTimeout(resolve, pollInterval));
						options?.signal?.throwIfAborted();
					}
				} catch (error) {
					yield {
						type: "error",
						error: error instanceof McpError ? error : new McpError(ErrorCode.InternalError, String(error))
					};
				}
			}
			/**
			* Sends a request and waits for a response.
			*
			* Do not use this method to emit notifications! Use notification() instead.
			*/
			request(request, resultSchema, options) {
				const { relatedRequestId, resumptionToken, onresumptiontoken, task, relatedTask } = options ?? {};
				return new Promise((resolve, reject) => {
					const earlyReject = (error) => {
						reject(error);
					};
					if (!this._transport) {
						earlyReject(/* @__PURE__ */ new Error("Not connected"));
						return;
					}
					if (this._options?.enforceStrictCapabilities === true) try {
						this.assertCapabilityForMethod(request.method);
						if (task) this.assertTaskCapability(request.method);
					} catch (e) {
						earlyReject(e);
						return;
					}
					options?.signal?.throwIfAborted();
					const messageId = this._requestMessageId++;
					const jsonrpcRequest = {
						...request,
						jsonrpc: "2.0",
						id: messageId
					};
					if (options?.onprogress) {
						this._progressHandlers.set(messageId, options.onprogress);
						jsonrpcRequest.params = {
							...request.params,
							_meta: {
								...request.params?._meta || {},
								progressToken: messageId
							}
						};
					}
					if (task) jsonrpcRequest.params = {
						...jsonrpcRequest.params,
						task
					};
					if (relatedTask) jsonrpcRequest.params = {
						...jsonrpcRequest.params,
						_meta: {
							...jsonrpcRequest.params?._meta || {},
							[RELATED_TASK_META_KEY]: relatedTask
						}
					};
					const cancel = (reason) => {
						this._responseHandlers.delete(messageId);
						this._progressHandlers.delete(messageId);
						this._cleanupTimeout(messageId);
						this._transport?.send({
							jsonrpc: "2.0",
							method: "notifications/cancelled",
							params: {
								requestId: messageId,
								reason: String(reason)
							}
						}, {
							relatedRequestId,
							resumptionToken,
							onresumptiontoken
						}).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Failed to send cancellation: ${error}`)));
						reject(reason instanceof McpError ? reason : new McpError(ErrorCode.RequestTimeout, String(reason)));
					};
					this._responseHandlers.set(messageId, (response) => {
						if (options?.signal?.aborted) return;
						if (response instanceof Error) return reject(response);
						try {
							const parseResult = safeParse$2(resultSchema, response.result);
							if (!parseResult.success) reject(parseResult.error);
							else resolve(parseResult.data);
						} catch (error) {
							reject(error);
						}
					});
					options?.signal?.addEventListener("abort", () => {
						cancel(options?.signal?.reason);
					});
					const timeout = options?.timeout ?? 6e4;
					const timeoutHandler = () => cancel(McpError.fromError(ErrorCode.RequestTimeout, "Request timed out", { timeout }));
					this._setupTimeout(messageId, timeout, options?.maxTotalTimeout, timeoutHandler, options?.resetTimeoutOnProgress ?? false);
					const relatedTaskId = relatedTask?.taskId;
					if (relatedTaskId) {
						const responseResolver = (response) => {
							const handler = this._responseHandlers.get(messageId);
							if (handler) handler(response);
							else this._onerror(/* @__PURE__ */ new Error(`Response handler missing for side-channeled request ${messageId}`));
						};
						this._requestResolvers.set(messageId, responseResolver);
						this._enqueueTaskMessage(relatedTaskId, {
							type: "request",
							message: jsonrpcRequest,
							timestamp: Date.now()
						}).catch((error) => {
							this._cleanupTimeout(messageId);
							reject(error);
						});
					} else this._transport.send(jsonrpcRequest, {
						relatedRequestId,
						resumptionToken,
						onresumptiontoken
					}).catch((error) => {
						this._cleanupTimeout(messageId);
						reject(error);
					});
				});
			}
			/**
			* Gets the current status of a task.
			*
			* @experimental Use `client.experimental.tasks.getTask()` to access this method.
			*/
			async getTask(params, options) {
				return this.request({
					method: "tasks/get",
					params
				}, GetTaskResultSchema, options);
			}
			/**
			* Retrieves the result of a completed task.
			*
			* @experimental Use `client.experimental.tasks.getTaskResult()` to access this method.
			*/
			async getTaskResult(params, resultSchema, options) {
				return this.request({
					method: "tasks/result",
					params
				}, resultSchema, options);
			}
			/**
			* Lists tasks, optionally starting from a pagination cursor.
			*
			* @experimental Use `client.experimental.tasks.listTasks()` to access this method.
			*/
			async listTasks(params, options) {
				return this.request({
					method: "tasks/list",
					params
				}, ListTasksResultSchema, options);
			}
			/**
			* Cancels a specific task.
			*
			* @experimental Use `client.experimental.tasks.cancelTask()` to access this method.
			*/
			async cancelTask(params, options) {
				return this.request({
					method: "tasks/cancel",
					params
				}, CancelTaskResultSchema, options);
			}
			/**
			* Emits a notification, which is a one-way message that does not expect a response.
			*/
			async notification(notification, options) {
				if (!this._transport) throw new Error("Not connected");
				this.assertNotificationCapability(notification.method);
				const relatedTaskId = options?.relatedTask?.taskId;
				if (relatedTaskId) {
					const jsonrpcNotification = {
						...notification,
						jsonrpc: "2.0",
						params: {
							...notification.params,
							_meta: {
								...notification.params?._meta || {},
								[RELATED_TASK_META_KEY]: options.relatedTask
							}
						}
					};
					await this._enqueueTaskMessage(relatedTaskId, {
						type: "notification",
						message: jsonrpcNotification,
						timestamp: Date.now()
					});
					return;
				}
				if ((this._options?.debouncedNotificationMethods ?? []).includes(notification.method) && !notification.params && !options?.relatedRequestId && !options?.relatedTask) {
					if (this._pendingDebouncedNotifications.has(notification.method)) return;
					this._pendingDebouncedNotifications.add(notification.method);
					Promise.resolve().then(() => {
						this._pendingDebouncedNotifications.delete(notification.method);
						if (!this._transport) return;
						let jsonrpcNotification = {
							...notification,
							jsonrpc: "2.0"
						};
						if (options?.relatedTask) jsonrpcNotification = {
							...jsonrpcNotification,
							params: {
								...jsonrpcNotification.params,
								_meta: {
									...jsonrpcNotification.params?._meta || {},
									[RELATED_TASK_META_KEY]: options.relatedTask
								}
							}
						};
						this._transport?.send(jsonrpcNotification, options).catch((error) => this._onerror(error));
					});
					return;
				}
				let jsonrpcNotification = {
					...notification,
					jsonrpc: "2.0"
				};
				if (options?.relatedTask) jsonrpcNotification = {
					...jsonrpcNotification,
					params: {
						...jsonrpcNotification.params,
						_meta: {
							...jsonrpcNotification.params?._meta || {},
							[RELATED_TASK_META_KEY]: options.relatedTask
						}
					}
				};
				await this._transport.send(jsonrpcNotification, options);
			}
			/**
			* Registers a handler to invoke when this protocol object receives a request with the given method.
			*
			* Note that this will replace any previous request handler for the same method.
			*/
			setRequestHandler(requestSchema, handler) {
				const method = getMethodLiteral(requestSchema);
				this.assertRequestHandlerCapability(method);
				this._requestHandlers.set(method, (request, extra) => {
					const parsed = parseWithCompat(requestSchema, request);
					return Promise.resolve(handler(parsed, extra));
				});
			}
			/**
			* Removes the request handler for the given method.
			*/
			removeRequestHandler(method) {
				this._requestHandlers.delete(method);
			}
			/**
			* Asserts that a request handler has not already been set for the given method, in preparation for a new one being automatically installed.
			*/
			assertCanSetRequestHandler(method) {
				if (this._requestHandlers.has(method)) throw new Error(`A request handler for ${method} already exists, which would be overridden`);
			}
			/**
			* Registers a handler to invoke when this protocol object receives a notification with the given method.
			*
			* Note that this will replace any previous notification handler for the same method.
			*/
			setNotificationHandler(notificationSchema, handler) {
				const method = getMethodLiteral(notificationSchema);
				this._notificationHandlers.set(method, (notification) => {
					const parsed = parseWithCompat(notificationSchema, notification);
					return Promise.resolve(handler(parsed));
				});
			}
			/**
			* Removes the notification handler for the given method.
			*/
			removeNotificationHandler(method) {
				this._notificationHandlers.delete(method);
			}
			/**
			* Cleans up the progress handler associated with a task.
			* This should be called when a task reaches a terminal status.
			*/
			_cleanupTaskProgressHandler(taskId) {
				const progressToken = this._taskProgressTokens.get(taskId);
				if (progressToken !== void 0) {
					this._progressHandlers.delete(progressToken);
					this._taskProgressTokens.delete(taskId);
				}
			}
			/**
			* Enqueues a task-related message for side-channel delivery via tasks/result.
			* @param taskId The task ID to associate the message with
			* @param message The message to enqueue
			* @param sessionId Optional session ID for binding the operation to a specific session
			* @throws Error if taskStore is not configured or if enqueue fails (e.g., queue overflow)
			*
			* Note: If enqueue fails, it's the TaskMessageQueue implementation's responsibility to handle
			* the error appropriately (e.g., by failing the task, logging, etc.). The Protocol layer
			* simply propagates the error.
			*/
			async _enqueueTaskMessage(taskId, message, sessionId) {
				if (!this._taskStore || !this._taskMessageQueue) throw new Error("Cannot enqueue task message: taskStore and taskMessageQueue are not configured");
				const maxQueueSize = this._options?.maxTaskQueueSize;
				await this._taskMessageQueue.enqueue(taskId, message, sessionId, maxQueueSize);
			}
			/**
			* Clears the message queue for a task and rejects any pending request resolvers.
			* @param taskId The task ID whose queue should be cleared
			* @param sessionId Optional session ID for binding the operation to a specific session
			*/
			async _clearTaskQueue(taskId, sessionId) {
				if (this._taskMessageQueue) {
					const messages = await this._taskMessageQueue.dequeueAll(taskId, sessionId);
					for (const message of messages) if (message.type === "request" && isJSONRPCRequest(message.message)) {
						const requestId = message.message.id;
						const resolver = this._requestResolvers.get(requestId);
						if (resolver) {
							resolver(new McpError(ErrorCode.InternalError, "Task cancelled or completed"));
							this._requestResolvers.delete(requestId);
						} else this._onerror(/* @__PURE__ */ new Error(`Resolver missing for request ${requestId} during task ${taskId} cleanup`));
					}
				}
			}
			/**
			* Waits for a task update (new messages or status change) with abort signal support.
			* Uses polling to check for updates at the task's configured poll interval.
			* @param taskId The task ID to wait for
			* @param signal Abort signal to cancel the wait
			* @returns Promise that resolves when an update occurs or rejects if aborted
			*/
			async _waitForTaskUpdate(taskId, signal) {
				let interval = this._options?.defaultTaskPollInterval ?? 1e3;
				try {
					const task = await this._taskStore?.getTask(taskId);
					if (task?.pollInterval) interval = task.pollInterval;
				} catch {}
				return new Promise((resolve, reject) => {
					if (signal.aborted) {
						reject(new McpError(ErrorCode.InvalidRequest, "Request cancelled"));
						return;
					}
					const timeoutId = setTimeout(resolve, interval);
					signal.addEventListener("abort", () => {
						clearTimeout(timeoutId);
						reject(new McpError(ErrorCode.InvalidRequest, "Request cancelled"));
					}, { once: true });
				});
			}
			requestTaskStore(request, sessionId) {
				const taskStore = this._taskStore;
				if (!taskStore) throw new Error("No task store configured");
				return {
					createTask: async (taskParams) => {
						if (!request) throw new Error("No request provided");
						return await taskStore.createTask(taskParams, request.id, {
							method: request.method,
							params: request.params
						}, sessionId);
					},
					getTask: async (taskId) => {
						const task = await taskStore.getTask(taskId, sessionId);
						if (!task) throw new McpError(ErrorCode.InvalidParams, "Failed to retrieve task: Task not found");
						return task;
					},
					storeTaskResult: async (taskId, status, result) => {
						await taskStore.storeTaskResult(taskId, status, result, sessionId);
						const task = await taskStore.getTask(taskId, sessionId);
						if (task) {
							const notification = TaskStatusNotificationSchema.parse({
								method: "notifications/tasks/status",
								params: task
							});
							await this.notification(notification);
							if (isTerminal(task.status)) this._cleanupTaskProgressHandler(taskId);
						}
					},
					getTaskResult: (taskId) => {
						return taskStore.getTaskResult(taskId, sessionId);
					},
					updateTaskStatus: async (taskId, status, statusMessage) => {
						const task = await taskStore.getTask(taskId, sessionId);
						if (!task) throw new McpError(ErrorCode.InvalidParams, `Task "${taskId}" not found - it may have been cleaned up`);
						if (isTerminal(task.status)) throw new McpError(ErrorCode.InvalidParams, `Cannot update task "${taskId}" from terminal status "${task.status}" to "${status}". Terminal states (completed, failed, cancelled) cannot transition to other states.`);
						await taskStore.updateTaskStatus(taskId, status, statusMessage, sessionId);
						const updatedTask = await taskStore.getTask(taskId, sessionId);
						if (updatedTask) {
							const notification = TaskStatusNotificationSchema.parse({
								method: "notifications/tasks/status",
								params: updatedTask
							});
							await this.notification(notification);
							if (isTerminal(updatedTask.status)) this._cleanupTaskProgressHandler(taskId);
						}
					},
					listTasks: (cursor) => {
						return taskStore.listTasks(cursor, sessionId);
					}
				};
			}
		};
		//#endregion
		//#region node_modules/.pnpm/@modelcontextprotocol+ext-apps@1.7.5_@modelcontextprotocol+sdk@1.30.0_zod@4.6.5__react@18.2.0_zod@4.6.5/node_modules/@modelcontextprotocol/ext-apps/dist/src/app-bridge.js
		((X) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(X, { get: (Y, Z) => (typeof require < "u" ? require : Y)[Z] }) : X)(function(X) {
			if (typeof require < "u") return require.apply(this, arguments);
			throw Error("Dynamic require of \"" + X + "\" is not supported");
		});
		var _ = class extends Protocol {
			_registeredMethods = /* @__PURE__ */ new Set();
			_eventSlots = /* @__PURE__ */ new Map();
			onEventDispatch(X, Y) {}
			_ensureEventSlot(X) {
				let Y = this._eventSlots.get(X);
				if (!Y) {
					let Z = this.eventSchemas[X];
					if (!Z) throw Error(`Unknown event: ${String(X)}`);
					Y = { listeners: [] }, this._eventSlots.set(X, Y);
					let $ = Z.shape.method.value;
					this._registeredMethods.add($);
					let J = Y;
					super.setNotificationHandler(Z, (K) => {
						let D = K.params;
						this.onEventDispatch(X, D), J.onHandler?.(D);
						for (let G of [...J.listeners]) G(D);
					});
				}
				return Y;
			}
			setEventHandler(X, Y) {
				let Z = this._ensureEventSlot(X);
				if (Z.onHandler && Y) console.warn(`[MCP Apps] on${String(X)} handler replaced. Use addEventListener("${String(X)}", …) to add multiple listeners without replacing.`);
				Z.onHandler = Y;
			}
			getEventHandler(X) {
				return this._eventSlots.get(X)?.onHandler;
			}
			addEventListener(X, Y) {
				this._ensureEventSlot(X).listeners.push(Y);
			}
			removeEventListener(X, Y) {
				let Z = this._eventSlots.get(X);
				if (!Z) return;
				let $ = Z.listeners.indexOf(Y);
				if ($ !== -1) Z.listeners.splice($, 1);
			}
			setRequestHandler = (X, Y) => {
				this._assertMethodNotRegistered(X, "setRequestHandler"), super.setRequestHandler(X, Y);
			};
			setNotificationHandler = (X, Y) => {
				this._assertMethodNotRegistered(X, "setNotificationHandler"), super.setNotificationHandler(X, Y);
			};
			warnIfRequestHandlerReplaced(X, Y, Z) {
				if (Y && Z) console.warn(`[MCP Apps] ${X} handler replaced. Previous handler will no longer be called.`);
			}
			replaceRequestHandler = (X, Y) => {
				let Z = X.shape.method.value;
				this._registeredMethods.add(Z), super.setRequestHandler(X, Y);
			};
			_assertMethodNotRegistered(X, Y) {
				let Z = X.shape.method.value;
				if (this._registeredMethods.has(Z)) throw Error(`Handler for "${Z}" already registered (via ${Y}). Use addEventListener() to attach multiple listeners, or the on* setter for replace semantics.`);
				this._registeredMethods.add(Z);
			}
		};
		var j = "2026-01-26";
		var r = union$1([literal("light"), literal("dark")]).describe("Color theme preference for the host environment.");
		var B = union$1([
			literal("inline"),
			literal("fullscreen"),
			literal("pip")
		]).describe("Display mode for UI presentation.");
		var RQ = record(union$1([
			literal("--color-background-primary"),
			literal("--color-background-secondary"),
			literal("--color-background-tertiary"),
			literal("--color-background-inverse"),
			literal("--color-background-ghost"),
			literal("--color-background-info"),
			literal("--color-background-danger"),
			literal("--color-background-success"),
			literal("--color-background-warning"),
			literal("--color-background-disabled"),
			literal("--color-text-primary"),
			literal("--color-text-secondary"),
			literal("--color-text-tertiary"),
			literal("--color-text-inverse"),
			literal("--color-text-ghost"),
			literal("--color-text-info"),
			literal("--color-text-danger"),
			literal("--color-text-success"),
			literal("--color-text-warning"),
			literal("--color-text-disabled"),
			literal("--color-border-primary"),
			literal("--color-border-secondary"),
			literal("--color-border-tertiary"),
			literal("--color-border-inverse"),
			literal("--color-border-ghost"),
			literal("--color-border-info"),
			literal("--color-border-danger"),
			literal("--color-border-success"),
			literal("--color-border-warning"),
			literal("--color-border-disabled"),
			literal("--color-ring-primary"),
			literal("--color-ring-secondary"),
			literal("--color-ring-inverse"),
			literal("--color-ring-info"),
			literal("--color-ring-danger"),
			literal("--color-ring-success"),
			literal("--color-ring-warning"),
			literal("--font-sans"),
			literal("--font-mono"),
			literal("--font-weight-normal"),
			literal("--font-weight-medium"),
			literal("--font-weight-semibold"),
			literal("--font-weight-bold"),
			literal("--font-text-xs-size"),
			literal("--font-text-sm-size"),
			literal("--font-text-md-size"),
			literal("--font-text-lg-size"),
			literal("--font-heading-xs-size"),
			literal("--font-heading-sm-size"),
			literal("--font-heading-md-size"),
			literal("--font-heading-lg-size"),
			literal("--font-heading-xl-size"),
			literal("--font-heading-2xl-size"),
			literal("--font-heading-3xl-size"),
			literal("--font-text-xs-line-height"),
			literal("--font-text-sm-line-height"),
			literal("--font-text-md-line-height"),
			literal("--font-text-lg-line-height"),
			literal("--font-heading-xs-line-height"),
			literal("--font-heading-sm-line-height"),
			literal("--font-heading-md-line-height"),
			literal("--font-heading-lg-line-height"),
			literal("--font-heading-xl-line-height"),
			literal("--font-heading-2xl-line-height"),
			literal("--font-heading-3xl-line-height"),
			literal("--border-radius-xs"),
			literal("--border-radius-sm"),
			literal("--border-radius-md"),
			literal("--border-radius-lg"),
			literal("--border-radius-xl"),
			literal("--border-radius-full"),
			literal("--border-width-regular"),
			literal("--shadow-hairline"),
			literal("--shadow-sm"),
			literal("--shadow-md"),
			literal("--shadow-lg")
		]).describe("CSS variable keys available to MCP apps for theming.").describe(`Style variables for theming MCP apps.

Individual style keys are optional - hosts may provide any subset of these values.
Values are strings containing CSS values (colors, sizes, font stacks, etc.).

Note: This type uses \`Record<K, string | undefined>\` rather than \`Partial<Record<K, string>>\`
for compatibility with Zod schema generation. Both are functionally equivalent for validation.`), union$1([string$2(), _undefined()]).describe(`Style variables for theming MCP apps.

Individual style keys are optional - hosts may provide any subset of these values.
Values are strings containing CSS values (colors, sizes, font stacks, etc.).

Note: This type uses \`Record<K, string | undefined>\` rather than \`Partial<Record<K, string>>\`
for compatibility with Zod schema generation. Both are functionally equivalent for validation.`)).describe(`Style variables for theming MCP apps.

Individual style keys are optional - hosts may provide any subset of these values.
Values are strings containing CSS values (colors, sizes, font stacks, etc.).

Note: This type uses \`Record<K, string | undefined>\` rather than \`Partial<Record<K, string>>\`
for compatibility with Zod schema generation. Both are functionally equivalent for validation.`);
		var L = object$1({
			method: literal("ui/open-link"),
			params: object$1({ url: string$2().describe("URL to open in the host's browser") })
		});
		object$1({ isError: boolean().optional().describe("True if the host failed to open the URL (e.g., due to security policy).") }).passthrough();
		object$1({ isError: boolean().optional().describe("True if the download failed (e.g., user cancelled or host denied).") }).passthrough();
		object$1({ isError: boolean().optional().describe("True if the host rejected or failed to deliver the message.") }).passthrough();
		var w = object$1({
			method: literal("ui/notifications/sandbox-proxy-ready"),
			params: object$1({})
		});
		var O = object$1({
			connectDomains: array$1(string$2()).optional().describe(`Origins for network requests (fetch/XHR/WebSocket).

- Maps to CSP \`connect-src\` directive
- Empty or omitted → no network connections (secure default)`),
			resourceDomains: array$1(string$2()).optional().describe("Origins for static resources (images, scripts, stylesheets, fonts, media).\n\n- Maps to CSP `img-src`, `script-src`, `style-src`, `font-src`, `media-src` directives\n- Wildcard subdomains supported: `https://*.example.com`\n- Empty or omitted → no network resources (secure default)"),
			frameDomains: array$1(string$2()).optional().describe("Origins for nested iframes.\n\n- Maps to CSP `frame-src` directive\n- Empty or omitted → no nested iframes allowed (`frame-src 'none'`)"),
			baseUriDomains: array$1(string$2()).optional().describe("Allowed base URIs for the document.\n\n- Maps to CSP `base-uri` directive\n- Empty or omitted → only same origin allowed (`base-uri 'self'`)")
		});
		var z = object$1({
			camera: object$1({}).optional().describe("Request camera access.\n\nMaps to Permission Policy `camera` feature."),
			microphone: object$1({}).optional().describe("Request microphone access.\n\nMaps to Permission Policy `microphone` feature."),
			geolocation: object$1({}).optional().describe("Request geolocation access.\n\nMaps to Permission Policy `geolocation` feature."),
			clipboardWrite: object$1({}).optional().describe("Request clipboard write access.\n\nMaps to Permission Policy `clipboard-write` feature.")
		});
		var H = object$1({
			method: literal("ui/notifications/size-changed"),
			params: object$1({
				width: number().optional().describe("New width in pixels."),
				height: number().optional().describe("New height in pixels.")
			})
		});
		object$1({
			method: literal("ui/notifications/tool-input"),
			params: object$1({ arguments: record(string$2(), unknown$1().describe("Complete tool call arguments as key-value pairs.")).optional().describe("Complete tool call arguments as key-value pairs.") })
		});
		object$1({
			method: literal("ui/notifications/tool-input-partial"),
			params: object$1({ arguments: record(string$2(), unknown$1().describe("Partial tool call arguments (incomplete, may change).")).optional().describe("Partial tool call arguments (incomplete, may change).") })
		});
		object$1({
			method: literal("ui/notifications/tool-cancelled"),
			params: object$1({ reason: string$2().optional().describe("Optional reason for the cancellation (e.g., \"user action\", \"timeout\").") })
		});
		var o = object$1({ fonts: string$2().optional() });
		var s = object$1({
			variables: RQ.optional().describe("CSS variables for theming the app."),
			css: o.optional().describe("CSS blocks that apps can inject.")
		});
		object$1({
			method: literal("ui/resource-teardown"),
			params: object$1({})
		});
		var S = record(string$2(), unknown$1());
		var F = object$1({
			text: object$1({}).optional().describe("Host supports text content blocks."),
			image: object$1({}).optional().describe("Host supports image content blocks."),
			audio: object$1({}).optional().describe("Host supports audio content blocks."),
			resource: object$1({}).optional().describe("Host supports resource content blocks."),
			resourceLink: object$1({}).optional().describe("Host supports resource link content blocks."),
			structuredContent: object$1({}).optional().describe("Host supports structured content.")
		});
		var q = object$1({
			method: literal("ui/notifications/request-teardown"),
			params: object$1({}).optional()
		});
		var t = object$1({
			experimental: record(string$2(), record(string$2(), any()).describe("Experimental features keyed by identifier.")).optional().describe("Experimental features keyed by identifier."),
			openLinks: object$1({}).optional().describe("Host supports opening external URLs."),
			downloadFile: object$1({}).optional().describe("Host supports file downloads via ui/download-file."),
			serverTools: object$1({ listChanged: boolean().optional().describe("Host supports tools/list_changed notifications.") }).optional().describe("Host can proxy tool calls to the MCP server."),
			serverResources: object$1({ listChanged: boolean().optional().describe("Host supports resources/list_changed notifications.") }).optional().describe("Host can proxy resource reads to the MCP server."),
			logging: object$1({}).optional().describe("Host accepts log messages."),
			sandbox: object$1({
				permissions: z.optional().describe("Permissions granted by the host (camera, microphone, geolocation)."),
				csp: O.optional().describe("CSP domains approved by the host.")
			}).optional().describe("Sandbox configuration applied by the host."),
			updateModelContext: F.optional().describe("Host accepts context updates (ui/update-model-context) to be included in the model's context for future turns."),
			message: F.optional().describe("Host supports receiving content messages (ui/message) from the view."),
			sampling: object$1({ tools: object$1({}).optional().describe("Host supports tool use via `tools` and `toolChoice` parameters.") }).optional().describe("Host supports LLM sampling (sampling/createMessage) from the view.\nMirrors the MCP `ClientCapabilities.sampling` shape so hosts can pass it through.")
		});
		var a = object$1({
			experimental: record(string$2(), record(string$2(), any()).describe("Experimental features keyed by identifier.")).optional().describe("Experimental features keyed by identifier."),
			tools: object$1({ listChanged: boolean().optional().describe("App supports tools/list_changed notifications.") }).optional().describe("App exposes MCP-style tools that the host can call."),
			availableDisplayModes: array$1(B).optional().describe("Display modes the app supports.")
		});
		var y = object$1({
			method: literal("ui/notifications/initialized"),
			params: object$1({}).optional()
		});
		object$1({
			csp: O.optional().describe("Content Security Policy configuration for UI resources."),
			permissions: z.optional().describe("Sandbox permissions requested by the UI resource."),
			domain: string$2().optional().describe(`Dedicated origin for view sandbox.

Useful when views need stable, dedicated origins for OAuth callbacks, CORS policies, or API key allowlists.

**Host-dependent:** The format and validation rules for this field are determined by each host. Servers MUST consult host-specific documentation for the expected domain format. Common patterns include:
- Hash-based subdomains (e.g., \`{hash}.claudemcpcontent.com\`)
- URL-derived subdomains (e.g., \`www-example-com.oaiusercontent.com\`)

If omitted, host uses default sandbox origin (typically per-conversation).`),
			prefersBorder: boolean().optional().describe(`Visual boundary preference - true if view prefers a visible border.

Boolean requesting whether a visible border and background is provided by the host. Specifying an explicit value for this is recommended because hosts' defaults may vary.

- \`true\`: request visible border + background
- \`false\`: request no visible border + background
- omitted: host decides border`)
		});
		var I = object$1({
			method: literal("ui/request-display-mode"),
			params: object$1({ mode: B.describe("The display mode being requested.") })
		});
		object$1({ mode: B.describe("The display mode that was actually set. May differ from requested if not supported.") }).passthrough();
		var e = union$1([literal("model"), literal("app")]).describe("Tool visibility scope - who can access the tool.");
		object$1({
			resourceUri: string$2().optional(),
			visibility: array$1(e).optional().describe(`Who can access this tool. Default: ["model", "app"]
- "model": Tool visible to and callable by the agent
- "app": Tool callable by the app from this server only`),
			csp: never$1().optional(),
			permissions: never$1().optional()
		});
		object$1({ mimeTypes: array$1(string$2()).optional().describe("Array of supported MIME types for UI resources.\nMust include `\"text/html;profile=mcp-app\"` for MCP Apps support.") });
		var f = object$1({
			method: literal("ui/download-file"),
			params: object$1({ contents: array$1(union$1([EmbeddedResourceSchema, ResourceLinkSchema])).describe("Resource contents to download — embedded (inline data) or linked (host fetches). Uses standard MCP resource types.") })
		});
		var k = object$1({
			method: literal("ui/message"),
			params: object$1({
				role: literal("user").describe("Message role, currently only \"user\" is supported."),
				content: array$1(ContentBlockSchema).describe("Message content blocks (text, image, etc.).")
			})
		});
		object$1({
			method: literal("ui/notifications/sandbox-resource-ready"),
			params: object$1({
				html: string$2().describe("HTML content to load into the inner iframe."),
				sandbox: string$2().optional().describe("Optional override for the inner iframe's sandbox attribute."),
				csp: O.optional().describe("CSP configuration from resource metadata."),
				permissions: z.optional().describe("Sandbox permissions from resource metadata.")
			})
		});
		object$1({
			method: literal("ui/notifications/tool-result"),
			params: CallToolResultSchema.describe("Standard MCP tool execution result.")
		});
		var x = object$1({
			toolInfo: object$1({
				id: RequestIdSchema.optional().describe("JSON-RPC id of the tools/call request."),
				tool: ToolSchema.describe("Tool definition including name, inputSchema, etc.")
			}).optional().describe("Metadata of the tool call that instantiated this App."),
			theme: r.optional().describe("Current color theme preference."),
			styles: s.optional().describe("Style configuration for theming the app."),
			displayMode: B.optional().describe("How the UI is currently displayed."),
			availableDisplayModes: array$1(B).optional().describe("Display modes the host supports."),
			containerDimensions: union$1([object$1({ height: number().describe("Fixed container height in pixels.") }), object$1({ maxHeight: union$1([number(), _undefined()]).optional().describe("Maximum container height in pixels.") })]).and(union$1([object$1({ width: number().describe("Fixed container width in pixels.") }), object$1({ maxWidth: union$1([number(), _undefined()]).optional().describe("Maximum container width in pixels.") })])).optional().describe(`Container dimensions. Represents the dimensions of the iframe or other
container holding the app. Specify either width or maxWidth, and either height or maxHeight.`),
			locale: string$2().optional().describe("User's language and region preference in BCP 47 format."),
			timeZone: string$2().optional().describe("User's timezone in IANA format."),
			userAgent: string$2().optional().describe("Host application identifier."),
			platform: union$1([
				literal("web"),
				literal("desktop"),
				literal("mobile")
			]).optional().describe("Platform type for responsive design decisions."),
			deviceCapabilities: object$1({
				touch: boolean().optional().describe("Whether the device supports touch input."),
				hover: boolean().optional().describe("Whether the device supports hover interactions.")
			}).optional().describe("Device input capabilities."),
			safeAreaInsets: object$1({
				top: number().describe("Top safe area inset in pixels."),
				right: number().describe("Right safe area inset in pixels."),
				bottom: number().describe("Bottom safe area inset in pixels."),
				left: number().describe("Left safe area inset in pixels.")
			}).optional().describe("Mobile safe area boundaries in pixels.")
		}).passthrough();
		object$1({
			method: literal("ui/notifications/host-context-changed"),
			params: x.describe("Partial context update containing only changed fields.")
		});
		var d = object$1({
			method: literal("ui/update-model-context"),
			params: object$1({
				content: array$1(ContentBlockSchema).optional().describe("Context content blocks (text, image, etc.)."),
				structuredContent: record(string$2(), unknown$1().describe("Structured content for machine-readable context data.")).optional().describe("Structured content for machine-readable context data.")
			})
		});
		var u = object$1({
			method: literal("ui/initialize"),
			params: object$1({
				appInfo: ImplementationSchema.describe("App identification (name and version)."),
				appCapabilities: a.describe("Features and capabilities this app provides."),
				protocolVersion: string$2().describe("Protocol version this app supports.")
			})
		});
		object$1({
			protocolVersion: string$2().describe("Negotiated protocol version string (e.g., \"2025-11-21\")."),
			hostInfo: ImplementationSchema.describe("Host application identification and version."),
			hostCapabilities: t.describe("Features and capabilities provided by the host."),
			hostContext: x.describe("Rich context about the host environment.")
		}).passthrough();
		var E = class {
			eventTarget;
			eventSource;
			messageListener;
			constructor(X = window.parent, Y) {
				this.eventTarget = X;
				this.eventSource = Y;
				this.messageListener = (Z) => {
					if (Y && Z.source !== this.eventSource) {
						console.debug("Ignoring message from unknown source", Z);
						return;
					}
					let $ = JSONRPCMessageSchema.safeParse(Z.data);
					if ($.success) console.debug("Parsed message", $.data), this.onmessage?.($.data);
					else if (Z.data?.jsonrpc !== "2.0") console.debug("Ignoring non-JSON-RPC message", $.error.message, Z);
					else console.error("Failed to parse message", $.error.message, Z), this.onerror?.(Error("Invalid JSON-RPC message received: " + $.error.message));
				};
			}
			async start() {
				window.addEventListener("message", this.messageListener);
			}
			async send(X, Y) {
				if (X.method !== "ui/notifications/tool-input-partial") console.debug("Sending message", X);
				this.eventTarget.postMessage(X, "*");
			}
			async close() {
				window.removeEventListener("message", this.messageListener), this.onclose?.();
			}
			onclose;
			onerror;
			onmessage;
			sessionId;
			setProtocolVersion;
		};
		function AZ(X) {
			if (!X) return "";
			let Y = [];
			if (X.camera) Y.push("camera");
			if (X.microphone) Y.push("microphone");
			if (X.geolocation) Y.push("geolocation");
			if (X.clipboardWrite) Y.push("clipboard-write");
			return Y.join("; ");
		}
		var KX = [j];
		var DX = class extends _ {
			_client;
			_hostInfo;
			_capabilities;
			_appCapabilities;
			_hostContext = {};
			_appInfo;
			_initializedReceived = !1;
			_baseReplaceRequestHandler = this.replaceRequestHandler;
			replaceRequestHandler = (X, Y) => {
				this._baseReplaceRequestHandler(X, (Z, $) => {
					if (!this._initializedReceived) console.warn(`[ext-apps] AppBridge received '${Z.method}' before ui/notifications/initialized. The View is calling host methods before completing the handshake; it should await app.connect() first.`);
					return Y(Z, $);
				});
			};
			eventSchemas = {
				sizechange: H,
				sandboxready: w,
				initialized: y,
				requestteardown: q,
				loggingmessage: LoggingMessageNotificationSchema
			};
			constructor(X, Y, Z, $) {
				super($);
				this._client = X;
				this._hostInfo = Y;
				this._capabilities = Z;
				this.addEventListener("initialized", () => {
					this._initializedReceived = !0;
				}), this._hostContext = $?.hostContext || {}, this.setRequestHandler(u, (J) => this._oninitialize(J)), this.setRequestHandler(PingRequestSchema, (J, K) => {
					return this.onping?.(J.params, K), {};
				}), this.replaceRequestHandler(I, (J) => {
					return { mode: this._hostContext.displayMode ?? "inline" };
				});
			}
			getAppCapabilities() {
				return this._appCapabilities;
			}
			getAppVersion() {
				return this._appInfo;
			}
			onping;
			get onsizechange() {
				return this.getEventHandler("sizechange");
			}
			set onsizechange(X) {
				this.setEventHandler("sizechange", X);
			}
			get onsandboxready() {
				return this.getEventHandler("sandboxready");
			}
			set onsandboxready(X) {
				this.setEventHandler("sandboxready", X);
			}
			get oninitialized() {
				return this.getEventHandler("initialized");
			}
			set oninitialized(X) {
				this.setEventHandler("initialized", X);
			}
			_onmessage;
			get onmessage() {
				return this._onmessage;
			}
			set onmessage(X) {
				this.warnIfRequestHandlerReplaced("onmessage", this._onmessage, X), this._onmessage = X, this.replaceRequestHandler(k, async (Y, Z) => {
					if (!this._onmessage) throw Error("No onmessage handler set");
					return this._onmessage(Y.params, Z);
				});
			}
			_onopenlink;
			get onopenlink() {
				return this._onopenlink;
			}
			set onopenlink(X) {
				this.warnIfRequestHandlerReplaced("onopenlink", this._onopenlink, X), this._onopenlink = X, this.replaceRequestHandler(L, async (Y, Z) => {
					if (!this._onopenlink) throw Error("No onopenlink handler set");
					return this._onopenlink(Y.params, Z);
				});
			}
			_ondownloadfile;
			get ondownloadfile() {
				return this._ondownloadfile;
			}
			set ondownloadfile(X) {
				this.warnIfRequestHandlerReplaced("ondownloadfile", this._ondownloadfile, X), this._ondownloadfile = X, this.replaceRequestHandler(f, async (Y, Z) => {
					if (!this._ondownloadfile) throw Error("No ondownloadfile handler set");
					return this._ondownloadfile(Y.params, Z);
				});
			}
			get onrequestteardown() {
				return this.getEventHandler("requestteardown");
			}
			set onrequestteardown(X) {
				this.setEventHandler("requestteardown", X);
			}
			_onrequestdisplaymode;
			get onrequestdisplaymode() {
				return this._onrequestdisplaymode;
			}
			set onrequestdisplaymode(X) {
				this.warnIfRequestHandlerReplaced("onrequestdisplaymode", this._onrequestdisplaymode, X), this._onrequestdisplaymode = X, this.replaceRequestHandler(I, async (Y, Z) => {
					if (!this._onrequestdisplaymode) throw Error("No onrequestdisplaymode handler set");
					return this._onrequestdisplaymode(Y.params, Z);
				});
			}
			get onloggingmessage() {
				return this.getEventHandler("loggingmessage");
			}
			set onloggingmessage(X) {
				this.setEventHandler("loggingmessage", X);
			}
			_onupdatemodelcontext;
			get onupdatemodelcontext() {
				return this._onupdatemodelcontext;
			}
			set onupdatemodelcontext(X) {
				this.warnIfRequestHandlerReplaced("onupdatemodelcontext", this._onupdatemodelcontext, X), this._onupdatemodelcontext = X, this.replaceRequestHandler(d, async (Y, Z) => {
					if (!this._onupdatemodelcontext) throw Error("No onupdatemodelcontext handler set");
					return this._onupdatemodelcontext(Y.params, Z);
				});
			}
			_oncalltool;
			get oncalltool() {
				return this._oncalltool;
			}
			set oncalltool(X) {
				this.warnIfRequestHandlerReplaced("oncalltool", this._oncalltool, X), this._oncalltool = X, this.replaceRequestHandler(CallToolRequestSchema, async (Y, Z) => {
					if (!this._oncalltool) throw Error("No oncalltool handler set");
					return this._oncalltool(Y.params, Z);
				});
			}
			set oncreatesamplingmessage(X) {
				this.setRequestHandler(CreateMessageRequestSchema, async (Y, Z) => {
					return X(Y.params, Z);
				});
			}
			sendToolListChanged(X = {}) {
				return this.notification({
					method: "notifications/tools/list_changed",
					params: X
				});
			}
			_onlistresources;
			get onlistresources() {
				return this._onlistresources;
			}
			set onlistresources(X) {
				this.warnIfRequestHandlerReplaced("onlistresources", this._onlistresources, X), this._onlistresources = X, this.replaceRequestHandler(ListResourcesRequestSchema, async (Y, Z) => {
					if (!this._onlistresources) throw Error("No onlistresources handler set");
					return this._onlistresources(Y.params, Z);
				});
			}
			_onlistresourcetemplates;
			get onlistresourcetemplates() {
				return this._onlistresourcetemplates;
			}
			set onlistresourcetemplates(X) {
				this.warnIfRequestHandlerReplaced("onlistresourcetemplates", this._onlistresourcetemplates, X), this._onlistresourcetemplates = X, this.replaceRequestHandler(ListResourceTemplatesRequestSchema, async (Y, Z) => {
					if (!this._onlistresourcetemplates) throw Error("No onlistresourcetemplates handler set");
					return this._onlistresourcetemplates(Y.params, Z);
				});
			}
			_onreadresource;
			get onreadresource() {
				return this._onreadresource;
			}
			set onreadresource(X) {
				this.warnIfRequestHandlerReplaced("onreadresource", this._onreadresource, X), this._onreadresource = X, this.replaceRequestHandler(ReadResourceRequestSchema, async (Y, Z) => {
					if (!this._onreadresource) throw Error("No onreadresource handler set");
					return this._onreadresource(Y.params, Z);
				});
			}
			sendResourceListChanged(X = {}) {
				return this.notification({
					method: "notifications/resources/list_changed",
					params: X
				});
			}
			_onlistprompts;
			get onlistprompts() {
				return this._onlistprompts;
			}
			set onlistprompts(X) {
				this.warnIfRequestHandlerReplaced("onlistprompts", this._onlistprompts, X), this._onlistprompts = X, this.replaceRequestHandler(ListPromptsRequestSchema, async (Y, Z) => {
					if (!this._onlistprompts) throw Error("No onlistprompts handler set");
					return this._onlistprompts(Y.params, Z);
				});
			}
			sendPromptListChanged(X = {}) {
				return this.notification({
					method: "notifications/prompts/list_changed",
					params: X
				});
			}
			assertCapabilityForMethod(X) {}
			assertRequestHandlerCapability(X) {}
			assertNotificationCapability(X) {}
			assertTaskCapability(X) {
				throw Error("Tasks are not supported in MCP Apps");
			}
			assertTaskHandlerCapability(X) {
				throw Error("Task handlers are not supported in MCP Apps");
			}
			getCapabilities() {
				return this._capabilities;
			}
			async _oninitialize(X) {
				let Y = X.params.protocolVersion;
				if (this._appInfo !== void 0) console.warn("[ext-apps] AppBridge received a second ui/initialize. The View may be double-mounting (e.g. React StrictMode in dev) without closing the previous App instance. Responding normally; the latest appInfo/appCapabilities replace the previous values.");
				return this._appCapabilities = X.params.appCapabilities, this._appInfo = X.params.appInfo, {
					protocolVersion: KX.includes(Y) ? Y : j,
					hostCapabilities: this.getCapabilities(),
					hostInfo: this._hostInfo,
					hostContext: this._hostContext
				};
			}
			setHostContext(X) {
				let Y = {}, Z = !1;
				for (let $ of Object.keys(X)) {
					let J = this._hostContext[$], K = X[$];
					if (GX(J, K)) continue;
					Y[$] = K, Z = !0;
				}
				if (Z) this._hostContext = X, this.sendHostContextChange(Y);
			}
			sendHostContextChange(X) {
				return this.notification({
					method: "ui/notifications/host-context-changed",
					params: X
				});
			}
			sendToolInput(X) {
				return this.notification({
					method: "ui/notifications/tool-input",
					params: X
				});
			}
			sendToolInputPartial(X) {
				return this.notification({
					method: "ui/notifications/tool-input-partial",
					params: X
				});
			}
			sendToolResult(X) {
				return this.notification({
					method: "ui/notifications/tool-result",
					params: X
				});
			}
			sendToolCancelled(X) {
				return this.notification({
					method: "ui/notifications/tool-cancelled",
					params: X
				});
			}
			sendSandboxResourceReady(X) {
				return this.notification({
					method: "ui/notifications/sandbox-resource-ready",
					params: X
				});
			}
			teardownResource(X, Y) {
				return this.request({
					method: "ui/resource-teardown",
					params: X
				}, S, Y);
			}
			sendResourceTeardown = this.teardownResource;
			callTool(X, Y) {
				return this.request({
					method: "tools/call",
					params: X
				}, CallToolResultSchema, Y);
			}
			listTools(X, Y) {
				return this.request({
					method: "tools/list",
					params: X
				}, ListToolsResultSchema, Y);
			}
			async connect(X) {
				if (this.transport) throw Error("AppBridge is already connected. Call close() before connecting again.");
				if (this._initializedReceived = !1, this._client) {
					let Y = this._client.getServerCapabilities();
					if (!Y) throw Error("Client server capabilities not available");
					if (Y.tools) {
						if (this.oncalltool = async (Z, $) => {
							return this._client.request({
								method: "tools/call",
								params: Z
							}, CallToolResultSchema, { signal: $.signal });
						}, Y.tools.listChanged) this._client.setNotificationHandler(ToolListChangedNotificationSchema, (Z) => this.sendToolListChanged(Z.params));
					}
					if (Y.resources) {
						if (this.onlistresources = async (Z, $) => {
							return this._client.request({
								method: "resources/list",
								params: Z
							}, ListResourcesResultSchema, { signal: $.signal });
						}, this.onlistresourcetemplates = async (Z, $) => {
							return this._client.request({
								method: "resources/templates/list",
								params: Z
							}, ListResourceTemplatesResultSchema, { signal: $.signal });
						}, this.onreadresource = async (Z, $) => {
							return this._client.request({
								method: "resources/read",
								params: Z
							}, ReadResourceResultSchema, { signal: $.signal });
						}, Y.resources.listChanged) this._client.setNotificationHandler(ResourceListChangedNotificationSchema, (Z) => this.sendResourceListChanged(Z.params));
					}
					if (Y.prompts) {
						if (this.onlistprompts = async (Z, $) => {
							return this._client.request({
								method: "prompts/list",
								params: Z
							}, ListPromptsResultSchema, { signal: $.signal });
						}, Y.prompts.listChanged) this._client.setNotificationHandler(PromptListChangedNotificationSchema, (Z) => this.sendPromptListChanged(Z.params));
					}
				}
				return super.connect(X);
			}
		};
		function GX(X, Y) {
			return JSON.stringify(X) === JSON.stringify(Y);
		}
		//#endregion
		//#region src/client/McpAppRow.tsx
		/**
		* One MCP App tool row: loads the tool's `ui://` resource through the host RPC,
		* mounts the separate-origin sandbox proxy iframe, and drives the official
		* `AppBridge` handshake (proxy-ready -> resource-ready -> initialized ->
		* tool input/result). Tool-call passthrough from the App forwards over the same
		* RPC to the host-side MCP connection.
		* @module dsh-mcp-apps/client/McpAppRow
		*/
		const IMPLEMENTATION = {
			name: "dsh-mcp-apps",
			version: "0.1.0"
		};
		const PROXY_READY = "ui/notifications/sandbox-proxy-ready";
		/**
		* Parent-side transport that stamps every outgoing message with the per-boot
		* sandbox embed key. The sandbox proxy validates it and — where the embedding
		* page sends no Referer header (the desktop app's `dsh-app://` origin) — pins
		* the parent origin from the first keyed message instead of the referrer.
		*/
		var KeyedPostMessageTransport = class extends E {
			embedKey;
			constructor(embedKey, target, source) {
				super(target, source);
				this.embedKey = embedKey;
			}
			send(message, options) {
				const stamped = message !== null && typeof message === "object" ? {
					...message,
					__sandboxKey: this.embedKey
				} : message;
				return super.send(stamped, options);
			}
		};
		function unwrap(response) {
			if (response !== null && typeof response === "object" && "ok" in response) {
				const env = response;
				if (!env.ok) throw new Error(env.error.message);
				return env.value;
			}
			return response;
		}
		function parseArgs(block) {
			const raw = block.kind === "tool-result" ? block.call?.argsRaw : block.argsRaw;
			if (typeof raw !== "string" || raw.length === 0) return {};
			try {
				const parsed = JSON.parse(raw);
				return parsed !== null && typeof parsed === "object" ? parsed : {};
			} catch {
				return {};
			}
		}
		function McpAppRow(props) {
			const { toolName, block, rpc } = props;
			const [phase, setPhase] = (0, react.useState)("loading");
			const [height, setHeight] = (0, react.useState)(void 0);
			const [message, setMessage] = (0, react.useState)("");
			const iframeRef = (0, react.useRef)(null);
			const bridgeRef = (0, react.useRef)(null);
			const sentResult = (0, react.useRef)(false);
			(0, react.useEffect)(() => {
				let cancelled = false;
				const iframe = () => iframeRef.current;
				let windowListener = null;
				let bridge = null;
				const run = async () => {
					try {
						const resource = unwrap(await rpc.call("resource", { toolName }));
						if (cancelled) return;
						const csp = resource.cspJson === null ? void 0 : JSON.parse(resource.cspJson);
						const permissions = resource.permissionsJson === null ? void 0 : JSON.parse(resource.permissionsJson);
						const frame = iframe();
						if (frame === null) return;
						const proxyReady = new Promise((resolve) => {
							windowListener = ({ source, data }) => {
								if (source === frame.contentWindow && data !== null && typeof data === "object" && data.method === PROXY_READY) resolve();
							};
							window.addEventListener("message", windowListener);
						});
						frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms");
						const allow = AZ(permissions);
						if (allow) frame.setAttribute("allow", allow);
						const url = new URL(`${resource.sandboxOrigin}/sandbox.html`);
						if (csp !== void 0) url.searchParams.set("csp", JSON.stringify(csp));
						frame.src = url.href;
						await proxyReady;
						if (cancelled) return;
						const dark = typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;
						bridge = new DX(null, IMPLEMENTATION, { openLinks: {} }, { hostContext: {
							theme: dark ? "dark" : "light",
							platform: "web",
							containerDimensions: { maxHeight: 6e3 },
							displayMode: "inline",
							availableDisplayModes: ["inline"]
						} });
						bridgeRef.current = bridge;
						bridge.oncalltool = async (params) => unwrap(await rpc.call("call-tool", {
							serverName: toolName.split("__")[1] ?? "",
							name: params.name,
							arguments: params.arguments
						}));
						bridge.onreadresource = async (params) => unwrap(await rpc.call("read-resource", {
							serverName: toolName.split("__")[1] ?? "",
							uri: params.uri
						}));
						bridge.onlistresources = async () => unwrap(await rpc.call("list-resources", { serverName: toolName.split("__")[1] ?? "" }));
						bridge.onopenlink = async ({ url }) => {
							window.open(url, "_blank", "noopener,noreferrer");
							return {};
						};
						bridge.onloggingmessage = () => {};
						bridge.onsizechange = ({ width, height: h }) => {
							if (h !== void 0) setHeight(h);
							if (width !== void 0) {
								const frame2 = iframe();
								if (frame2 !== null) frame2.style.minWidth = `min(${width}px, 100%)`;
							}
						};
						const initialized = new Promise((resolve) => {
							if (bridge === null) return;
							const previous = bridge.oninitialized;
							bridge.oninitialized = (...args) => {
								resolve();
								if (bridge !== null) bridge.oninitialized = previous;
								previous?.(...args);
							};
						});
						if (frame.contentWindow === null) return;
						await bridge.connect(new KeyedPostMessageTransport(resource.sandboxKey, frame.contentWindow, frame.contentWindow));
						await bridge.sendSandboxResourceReady({
							html: resource.html,
							csp,
							permissions
						});
						await initialized;
						if (cancelled) return;
						await bridge.sendToolInput({ arguments: parseArgs(block) });
						setPhase("ready");
					} catch (error) {
						if (!cancelled) {
							setMessage(error instanceof Error ? error.message : String(error));
							setPhase("error");
						}
					}
				};
				run();
				return () => {
					cancelled = true;
					if (windowListener !== null) window.removeEventListener("message", windowListener);
					const current = bridgeRef.current;
					bridgeRef.current = null;
					if (current !== null) {
						current.teardownResource({}).catch(() => {});
						current.close().catch(() => {});
					}
				};
			}, [toolName]);
			(0, react.useEffect)(() => {
				if (phase !== "ready" || sentResult.current) return;
				if (block.kind !== "tool-result") return;
				sentResult.current = true;
				const bridge = bridgeRef.current;
				if (bridge === null) return;
				bridge.sendToolResult({
					content: [...block.content ?? []],
					isError: block.isError === true
				}).catch(() => {});
			}, [phase, block]);
			return (0, react.createElement)("div", { style: { width: "100%" } }, phase !== "ready" ? (0, react.createElement)("div", { "data-mcp-app": phase }, phase === "loading" ? "正在加载 MCP 应用…" : `MCP 应用加载失败：${message}`) : null, (0, react.createElement)("iframe", {
				ref: iframeRef,
				title: `MCP 应用 ${toolName}`,
				style: {
					width: "100%",
					height: height !== void 0 ? `${height}px` : "240px",
					border: "none",
					display: "block"
				}
			}));
		}
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/core.js
		var _a$1;
		function $constructor(name, initializer, params) {
			function init(inst, def) {
				if (!inst._zod) Object.defineProperty(inst, "_zod", {
					value: {
						def,
						constr: _,
						traits: /* @__PURE__ */ new Set()
					},
					enumerable: false
				});
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				const proto = _.prototype;
				const keys = Object.keys(proto);
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i];
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				var _a;
				const inst = params?.Parent ? new Definition() : this;
				init(inst, def);
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				for (const fn of inst._zod.deferred) fn();
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
		const globalConfig = globalThis.__zod_globalConfig;
		function config(newConfig) {
			if (newConfig) Object.assign(globalConfig, newConfig);
			return globalConfig;
		}
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
			} };
		}
		function nullish(input) {
			return input === null || input === void 0;
		}
		function cleanRegex(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
		function defineLazy(object, key, getter) {
			let value = void 0;
			Object.defineProperty(object, key, {
				get() {
					if (value === EVALUATING) return;
					if (value === void 0) {
						value = EVALUATING;
						value = getter();
					}
					return value;
				},
				set(v) {
					Object.defineProperty(object, key, { value: v });
				},
				configurable: true
			});
		}
		function assignProp(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		function mergeDefs(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) {
				const descriptors = Object.getOwnPropertyDescriptors(def);
				Object.assign(mergedDescriptors, descriptors);
			}
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc(str) {
			return JSON.stringify(str);
		}
		function slugify(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject(o) {
			if (isObject(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone(o) {
			if (isPlainObject(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
			});
		}
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						newShape[key] = currDef.shape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone(a, mergeDefs(a._zod.def, {
				get shape() {
					const _shape = {
						...a._zod.def.shape,
						...b._zod.def.shape
					};
					assignProp(this, "shape", _shape);
					return _shape;
				},
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial(Class, schema, mask) {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key in mask) {
						if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key in oldShape) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key in mask) {
					if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key in oldShape) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
		}
		function aborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function finalizeIssue(iss, ctx, config) {
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function issue(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/errors.js
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			Object.defineProperty(inst, "_zod", {
				value: inst._zod,
				enumerable: false
			});
			Object.defineProperty(inst, "issues", {
				value: def,
				enumerable: false
			});
			inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
			Object.defineProperty(inst, "toString", {
				value: () => inst.message,
				enumerable: false
			});
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) {
				fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
				fieldErrors[sub.path[0]].push(mapper(sub));
			} else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
							else {
								curr[el] = curr[el] || { _errors: [] };
								curr[el]._errors.push(mapper(issue));
							}
							curr = curr[el];
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/parse.js
		const _parse = (_Err) => (schema, value, _ctx, _params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			if (result.issues.length) {
				const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, _params?.callee);
				throw e;
			}
			return result.value;
		};
		const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			if (result.issues.length) {
				const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, params?.callee);
				throw e;
			}
			return result.value;
		};
		const _safeParse = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			return result.issues.length ? {
				success: false,
				error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
		const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parse(_Err)(schema, value, ctx);
		};
		const _decode = (_Err) => (schema, value, _ctx) => {
			return _parse(_Err)(schema, value, _ctx);
		};
		const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parseAsync(_Err)(schema, value, ctx);
		};
		const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _parseAsync(_Err)(schema, value, _ctx);
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time$1(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime$1(args) {
			const time = timeSource({ precision: args.precision });
			const opts = ["Z"];
			if (args.local) opts.push("");
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const timeRegex = `${time}(?:${opts.join("|")})`;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length <= def.maximum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length >= def.minimum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const length = input.length;
				if (length === def.length) return;
				const origin = getLengthableOrigin(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = []) {
				this.content = [];
				this.indent = 0;
				if (this) this.args = args;
			}
			indented(fn) {
				this.indent += 1;
				fn(this);
				this.indent -= 1;
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const args = this?.args;
				const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
				return new F(...args, lines.join("\n"));
			}
		};
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 4,
			patch: 3
		};
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const checks = [...inst._zod.def.checks ?? []];
			if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							if (!isAborted) isAborted = aborted(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
			defineLazy(inst, "~standard", () => ({
				validate: (value) => {
					try {
						const r = safeParse$1(inst, value);
						return r.success ? { value: r.data } : { issues: r.error?.issues };
					} catch (_) {
						return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
					}
				},
				vendor: "zod",
				version: 1
			}));
		});
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid(v));
			} else def.pattern ?? (def.pattern = uuid());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					if (!def.normalize && def.protocol?.source === httpProtocol.source) {
						if (!/^https?:\/\//i.test(trimmed)) {
							payload.issues.push({
								code: "invalid_format",
								format: "url",
								note: "Invalid URL format",
								input: payload.value,
								inst,
								continue: !def.abort
							});
							return;
						}
					}
					const url = new URL(trimmed);
					if (def.hostname) {
						def.hostname.lastIndex = 0;
						if (!def.hostname.test(url.hostname)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid hostname",
							pattern: def.hostname.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.protocol) {
						def.protocol.lastIndex = 0;
						if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid protocol",
							pattern: def.protocol.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.normalize) payload.value = url.href;
					else payload.value = trimmed;
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			def.pattern ?? (def.pattern = nanoid);
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				try {
					new URL(`http://[${payload.value}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "ipv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				const parts = payload.value.split("/");
				try {
					if (parts.length !== 2) throw new Error();
					const [address, prefix] = parts;
					if (!prefix) throw new Error();
					const prefixNum = Number(prefix);
					if (`${prefixNum}` !== prefix) throw new Error();
					if (prefixNum < 0 || prefixNum > 128) throw new Error();
					new URL(`http://[${address}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "cidrv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		function isValidBase64(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64";
			inst._zod.check = (payload) => {
				if (isValidBase64(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64URL(data) {
			if (!base64url.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64url);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64url";
			inst._zod.check = (payload) => {
				if (isValidBase64URL(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164);
			$ZodStringFormat.init(inst, def);
		});
		function isValidJWT(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
			const isPresent = key in input;
			if (result.issues.length) {
				if (isOptionalIn && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && !isOptionalIn) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				keys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall(proms, input, payload, ctx, def, inst) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const isOptionalIn = _catchall.optin === "optional";
			const isOptionalOut = _catchall.optout === "optional";
			for (const key in input) {
				if (key === "__proto__") continue;
				if (keySet.has(key)) continue;
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazy(inst._zod, "propValues", () => {
				const shape = def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
					}
				}
				return propValues;
			});
			const isObject$2 = isObject;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.keys) {
					const el = shape[key];
					const isOptionalIn = el._zod.optin === "optional";
					const isOptionalOut = el._zod.optout === "optional";
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
					else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const generateFastpass = (shape) => {
				const doc = new Doc([
					"shape",
					"payload",
					"ctx"
				]);
				const normalized = _normalized.value;
				const parseStr = (key) => {
					const k = esc(key);
					return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				};
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.keys) ids[key] = `key_${counter++}`;
				doc.write(`const newResult = {};`);
				for (const key of normalized.keys) {
					const id = ids[key];
					const k = esc(key);
					const schema = shape[key];
					const isOptionalIn = schema?._zod?.optin === "optional";
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(key)};`);
					if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
					else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				const fn = doc.compile();
				return (payload, ctx) => fn(shape, payload, ctx);
			};
			let fastpass;
			const isObject$3 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$3(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall([], input, payload, ctx, value, inst);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			});
			return final;
		}
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "values", () => {
				if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazy(inst._zod, "pattern", () => {
				if (def.options.every((o) => o._zod.pattern)) {
					const patterns = def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
				});
				return handleIntersectionResults(payload, left, right);
			};
		});
		function mergeValues(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject(a) && isPlainObject(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				for (const key of sharedKeys) {
					const sharedValue = mergeValues(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
				unrecIssue ?? (unrecIssue = iss);
				for (const k of iss.keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k).l = true;
				}
			} else result.issues.push(iss);
			for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
				if (!unrecKeys.has(k)) unrecKeys.set(k, {});
				unrecKeys.get(k).r = true;
			}
			else result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length && unrecIssue) result.issues.push({
				...unrecIssue,
				keys: bothKeys
			});
			if (aborted(result)) return result;
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			result.value = merged.data;
			return result;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				payload.fallback = true;
				return payload;
			};
		});
		function handleOptionalResult(result, input) {
			if (input === void 0 && (result.issues.length || result.fallback)) return {
				issues: [],
				value: void 0
			};
			return result;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.optout = "optional";
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
			});
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (def.innerType._zod.optin === "optional") {
					const input = payload.value;
					const result = def.innerType._zod.run(payload, ctx);
					if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
					return handleOptionalResult(result, input);
				}
				if (payload.value === void 0) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => {
				const v = def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
				return handleNonOptionalResult(result, inst);
			};
		});
		function handleNonOptionalResult(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => {
					payload.value = result.value;
					if (result.issues.length) {
						payload.value = def.catchValue({
							...payload,
							error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
							input: payload.value
						});
						payload.issues = [];
						payload.fallback = true;
					}
					return payload;
				});
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue({
						...payload,
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
						input: payload.value
					});
					payload.issues = [];
					payload.fallback = true;
				}
				return payload;
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => def.in._zod.values);
			defineLazy(inst._zod, "optin", () => def.in._zod.optin);
			defineLazy(inst._zod, "optout", () => def.out._zod.optout);
			defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.length) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues,
				fallback: left.fallback
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
			defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
			};
		});
		function handleRefineResult(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue(_iss));
			}
		}
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry() {
			return new $ZodRegistry();
		}
		(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
		const globalRegistry = globalThis.__zod_globalRegistry;
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$3) => {
					if (typeof issue$3 === "string") payload.issues.push(issue(issue$3, payload.value, ch._zod.def));
					else {
						const _issue = issue$3;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/to-json-schema.js
		function initializeContext(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				external: params?.external ?? void 0
			};
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					process(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) Object.assign(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
					};
				}
				if (entry[1] === root) return { ref: "#" };
				const defUriPrefix = `#/${defsSegment}/`;
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + defId
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") {
						extractToDef(entry);
						continue;
					}
				}
			}
		}
		function finalize(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else Object.assign(schema, refSchema);
					Object.assign(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			Object.assign(result, root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					defs[seen.defId] = seen.def;
				}
			}
			if (ctx.external) {} else if (Object.keys(defs).length > 0) {
				if (ctx.target === "draft-2020-12") result.$defs = defs;
				else result.definitions = defs;
			}
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming(item, ctx)) return true;
				if (def.rest && isTransforming(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
			const ctx = initializeContext({
				...params,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/core/json-schema-processors.js
		const formatMap = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const stringProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time") delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const regexes = [...patterns];
				if (regexes.length === 1) json.pattern = regexes[0].source;
				else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const customProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = process(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			json.properties = {};
			const shape = def.shape;
			for (const key in shape) json.properties[key] = process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			});
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const v = def.shape[key]._zod;
				if (ctx.io === "input") return v.optin === void 0;
				else return v.optout === void 0;
			}));
			if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = process(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = process(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
		};
		const nullableProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.default = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const catchProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				throw new Error("Dynamic catch values are not supported in JSON Schema");
			}
			json.default = catchValue;
		};
		const pipeProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			process(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/classic/iso.js
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function datetime(params) {
			return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
		}
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function date(params) {
			return /* @__PURE__ */ _isoDate(ZodISODate, params);
		}
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function time(params) {
			return /* @__PURE__ */ _isoTime(ZodISOTime, params);
		}
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function duration(params) {
			return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
		}
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/classic/errors.js
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			Object.defineProperties(inst, {
				format: { value: (mapper) => formatError(inst, mapper) },
				flatten: { value: (mapper) => flattenError(inst, mapper) },
				addIssue: { value: (issue) => {
					inst.issues.push(issue);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				addIssues: { value: (issues) => {
					inst.issues.push(...issues);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				isEmpty: { get() {
					return inst.issues.length === 0;
				} }
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/classic/parse.js
		const parse = /* @__PURE__ */ _parse(ZodRealError);
		const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
		const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
		const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
		const encode = /* @__PURE__ */ _encode(ZodRealError);
		const decode = /* @__PURE__ */ _decode(ZodRealError);
		const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
		const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
		const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
		const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
		const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
		const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
		//#endregion
		//#region ../../../../../../node_modules/zod/v4/classic/schemas.js
		const _installedGroups = /* @__PURE__ */ new WeakMap();
		function _installLazyMethods(inst, group, methods) {
			const proto = Object.getPrototypeOf(inst);
			let installed = _installedGroups.get(proto);
			if (!installed) {
				installed = /* @__PURE__ */ new Set();
				_installedGroups.set(proto, installed);
			}
			if (installed.has(group)) return;
			installed.add(group);
			for (const key in methods) {
				const fn = methods[key];
				Object.defineProperty(proto, key, {
					configurable: true,
					enumerable: false,
					get() {
						const bound = fn.bind(this);
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: bound
						});
						return bound;
					},
					set(v) {
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: v
						});
					}
				});
			}
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			$ZodType.init(inst, def);
			Object.assign(inst["~standard"], { jsonSchema: {
				input: createStandardJSONSchemaMethod(inst, "input"),
				output: createStandardJSONSchemaMethod(inst, "output")
			} });
			inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
			inst.def = def;
			inst.type = def.type;
			Object.defineProperty(inst, "_def", { value: def });
			inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
			inst.safeParse = (data, params) => safeParse(inst, data, params);
			inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
			inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
			inst.spa = inst.safeParseAsync;
			inst.encode = (data, params) => encode(inst, data, params);
			inst.decode = (data, params) => decode(inst, data, params);
			inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
			inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
			inst.safeEncode = (data, params) => safeEncode(inst, data, params);
			inst.safeDecode = (data, params) => safeDecode(inst, data, params);
			inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
			inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
			_installLazyMethods(inst, "ZodType", {
				check(...chks) {
					const def = this.def;
					return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
						check: ch,
						def: { check: "custom" },
						onattach: []
					} } : ch)] }), { parent: true });
				},
				with(...chks) {
					return this.check(...chks);
				},
				clone(def, params) {
					return clone(this, def, params);
				},
				brand() {
					return this;
				},
				register(reg, meta) {
					reg.add(this, meta);
					return this;
				},
				refine(check, params) {
					return this.check(refine(check, params));
				},
				superRefine(refinement, params) {
					return this.check(superRefine(refinement, params));
				},
				overwrite(fn) {
					return this.check(/* @__PURE__ */ _overwrite(fn));
				},
				optional() {
					return optional(this);
				},
				exactOptional() {
					return exactOptional(this);
				},
				nullable() {
					return nullable(this);
				},
				nullish() {
					return optional(nullable(this));
				},
				nonoptional(params) {
					return nonoptional(this, params);
				},
				array() {
					return array(this);
				},
				or(arg) {
					return union([this, arg]);
				},
				and(arg) {
					return intersection(this, arg);
				},
				transform(tx) {
					return pipe(this, transform(tx));
				},
				default(d) {
					return _default(this, d);
				},
				prefault(d) {
					return prefault(this, d);
				},
				catch(params) {
					return _catch(this, params);
				},
				pipe(target) {
					return pipe(this, target);
				},
				readonly() {
					return readonly(this);
				},
				describe(description) {
					const cl = this.clone();
					globalRegistry.add(cl, { description });
					return cl;
				},
				meta(...args) {
					if (args.length === 0) return globalRegistry.get(this);
					const cl = this.clone();
					globalRegistry.add(cl, args[0]);
					return cl;
				},
				isOptional() {
					return this.safeParse(void 0).success;
				},
				isNullable() {
					return this.safeParse(null).success;
				},
				apply(fn) {
					return fn(this);
				}
			});
			Object.defineProperty(inst, "description", {
				get() {
					return globalRegistry.get(inst)?.description;
				},
				configurable: true
			});
			return inst;
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
			_installLazyMethods(inst, "_ZodString", {
				regex(...args) {
					return this.check(/* @__PURE__ */ _regex(...args));
				},
				includes(...args) {
					return this.check(/* @__PURE__ */ _includes(...args));
				},
				startsWith(...args) {
					return this.check(/* @__PURE__ */ _startsWith(...args));
				},
				endsWith(...args) {
					return this.check(/* @__PURE__ */ _endsWith(...args));
				},
				min(...args) {
					return this.check(/* @__PURE__ */ _minLength(...args));
				},
				max(...args) {
					return this.check(/* @__PURE__ */ _maxLength(...args));
				},
				length(...args) {
					return this.check(/* @__PURE__ */ _length(...args));
				},
				nonempty(...args) {
					return this.check(/* @__PURE__ */ _minLength(1, ...args));
				},
				lowercase(params) {
					return this.check(/* @__PURE__ */ _lowercase(params));
				},
				uppercase(params) {
					return this.check(/* @__PURE__ */ _uppercase(params));
				},
				trim() {
					return this.check(/* @__PURE__ */ _trim());
				},
				normalize(...args) {
					return this.check(/* @__PURE__ */ _normalize(...args));
				},
				toLowerCase() {
					return this.check(/* @__PURE__ */ _toLowerCase());
				},
				toUpperCase() {
					return this.check(/* @__PURE__ */ _toUpperCase());
				},
				slugify() {
					return this.check(/* @__PURE__ */ _slugify());
				}
			});
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
			inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
			inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
			inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
			inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
			inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
			inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
			inst.datetime = (params) => inst.check(datetime(params));
			inst.date = (params) => inst.check(date(params));
			inst.time = (params) => inst.check(time(params));
			inst.duration = (params) => inst.check(duration(params));
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
			_installLazyMethods(inst, "ZodArray", {
				min(n, params) {
					return this.check(/* @__PURE__ */ _minLength(n, params));
				},
				nonempty(params) {
					return this.check(/* @__PURE__ */ _minLength(1, params));
				},
				max(n, params) {
					return this.check(/* @__PURE__ */ _maxLength(n, params));
				},
				length(n, params) {
					return this.check(/* @__PURE__ */ _length(n, params));
				},
				unwrap() {
					return this.element;
				}
			});
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			defineLazy(inst, "shape", () => {
				return def.shape;
			});
			_installLazyMethods(inst, "ZodObject", {
				keyof() {
					return _enum(Object.keys(this._zod.def.shape));
				},
				catchall(catchall) {
					return this.clone({
						...this._zod.def,
						catchall
					});
				},
				passthrough() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				loose() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				strict() {
					return this.clone({
						...this._zod.def,
						catchall: never()
					});
				},
				strip() {
					return this.clone({
						...this._zod.def,
						catchall: void 0
					});
				},
				extend(incoming) {
					return extend(this, incoming);
				},
				safeExtend(incoming) {
					return safeExtend(this, incoming);
				},
				merge(other) {
					return merge(this, other);
				},
				pick(mask) {
					return pick(this, mask);
				},
				omit(mask) {
					return omit(this, mask);
				},
				partial(...args) {
					return partial(ZodOptional, this, args[0]);
				},
				required(...args) {
					return required(ZodNonOptional, this, args[0]);
				}
			});
		});
		function object(shape, params) {
			const def = {
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			};
			return new ZodObject(def);
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
			$ZodUnion.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union(options, params) {
			return new ZodUnion({
				type: "union",
				options,
				...normalizeParams(params)
			});
		}
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
			$ZodIntersection.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
		});
		function intersection(left, right) {
			return new ZodIntersection({
				type: "intersection",
				left,
				right
			});
		}
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
			$ZodEnum.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = Object.values(def.entries);
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
		});
		function _enum(values, params) {
			const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
			return new ZodEnum({
				type: "enum",
				entries,
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			$ZodTransform.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				payload.value = output;
				payload.fallback = true;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional(innerType) {
			return new ZodOptional({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
			$ZodExactOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional(innerType) {
			return new ZodExactOptional({
				type: "optional",
				innerType
			});
		}
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
			$ZodNullable.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable(innerType) {
			return new ZodNullable({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
			$ZodDefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default(innerType, defaultValue) {
			return new ZodDefault({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
			$ZodPrefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault(innerType, defaultValue) {
			return new ZodPrefault({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
			$ZodNonOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional(innerType, params) {
			return new ZodNonOptional({
				type: "nonoptional",
				innerType,
				...normalizeParams(params)
			});
		}
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
			$ZodCatch.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch(innerType, catchValue) {
			return new ZodCatch({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
			$ZodPipe.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe(in_, out) {
			return new ZodPipe({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
			$ZodReadonly.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly(innerType) {
			return new ZodReadonly({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region src/typert.remote-client.manual.js
		const _McpAppsListResult_schema = () => object({
			"apps": array(object({
				"toolName": string(),
				"serverName": string(),
				"resourceUri": string()
			})),
			"sandboxOrigin": string()
		});
		const _McpAppsResourceRequest_schema = () => object({ "toolName": string() });
		const _McpAppsResourceResult_schema = () => object({
			"html": string(),
			"cspJson": string().nullable(),
			"permissionsJson": string().nullable(),
			"sandboxOrigin": string(),
			"sandboxKey": string()
		});
		const _McpAppsCallToolRequest_schema = () => object({
			"serverName": string(),
			"name": string(),
			"argsJson": string()
		});
		const _McpAppsCallToolResult_schema = () => object({ "resultJson": string() });
		const _McpAppsReadResourceRequest_schema = () => object({
			"serverName": string(),
			"uri": string()
		});
		const _McpAppsReadResourceResult_schema = () => object({ "resultJson": string() });
		const _McpAppsListResourcesRequest_schema = () => object({ "serverName": string() });
		const _McpAppsListResourcesResult_schema = () => object({ "resultJson": string() });
		const TYPERT_REMOTE = {
			package: "@z-y-q/dsh-mcp-apps",
			descriptors: [
				{
					id: "@z-y-q/dsh-mcp-apps#mcp-apps/list",
					service: "mcp-apps",
					namespace: "mcp-apps",
					method: "list",
					invocation: { kind: "direct" },
					parameters: [],
					result: {
						mode: "strict",
						typeSymbol: "dsh-mcp-apps/client#McpAppsListResult",
						create: _McpAppsListResult_schema
					}
				},
				{
					id: "@z-y-q/dsh-mcp-apps#mcp-apps/resource",
					service: "mcp-apps",
					namespace: "mcp-apps",
					method: "resource",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-mcp-apps/client#McpAppsResourceRequest",
							create: _McpAppsResourceRequest_schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "dsh-mcp-apps/client#McpAppsResourceResult",
						create: _McpAppsResourceResult_schema
					}
				},
				{
					id: "@z-y-q/dsh-mcp-apps#mcp-apps/call-tool",
					service: "mcp-apps",
					namespace: "mcp-apps",
					method: "call-tool",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-mcp-apps/client#McpAppsCallToolRequest",
							create: _McpAppsCallToolRequest_schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "dsh-mcp-apps/client#McpAppsCallToolResult",
						create: _McpAppsCallToolResult_schema
					}
				},
				{
					id: "@z-y-q/dsh-mcp-apps#mcp-apps/read-resource",
					service: "mcp-apps",
					namespace: "mcp-apps",
					method: "read-resource",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-mcp-apps/client#McpAppsReadResourceRequest",
							create: _McpAppsReadResourceRequest_schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "dsh-mcp-apps/client#McpAppsReadResourceResult",
						create: _McpAppsReadResourceResult_schema
					}
				},
				{
					id: "@z-y-q/dsh-mcp-apps#mcp-apps/list-resources",
					service: "mcp-apps",
					namespace: "mcp-apps",
					method: "list-resources",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-mcp-apps/client#McpAppsListResourcesRequest",
							create: _McpAppsListResourcesRequest_schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "dsh-mcp-apps/client#McpAppsListResourcesResult",
						create: _McpAppsListResourcesResult_schema
					}
				}
			]
		};
		//#endregion
		//#region src/client/index.ts
		/**
		* dsh-mcp-apps browser half: mounts this package's hand-maintained Typert
		* Remote contribution on the gateway connection (`ctx.remote.$mount`), then
		* activates the toolviews inside `ctx.inject` — the mounted namespace
		* materializes as the `remote.mcp-apps` service, reached through the traced
		* `remote` service's namespace property (the official voice-input pattern).
		* Each App-bearing MCP tool gets one keyed `tool.call.toolview` row; the App's
		* `ui://` resource renders inside the separate-origin sandbox through the
		* official `AppBridge`.
		* @module dsh-mcp-apps/client
		*/
		const inject = ["remote", "slots"];
		async function apply(ctx) {
			const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE);
			const handle = ctx.inject(["remote.mcp-apps", "slots"], (inner) => {
				const ns = inner.remote["mcp-apps"];
				const unwrap = (result) => {
					if (!result.ok) throw result.error;
					return result.value;
				};
				const rpc = { async call(endpoint, payload) {
					if (endpoint === "list") return unwrap(await ns.list());
					if (endpoint === "resource") return unwrap(await ns.resource(payload));
					if (endpoint === "call-tool") {
						const body = payload ?? {};
						return unwrap(await ns["call-tool"]({
							serverName: String(body.serverName ?? ""),
							name: String(body.name ?? ""),
							argsJson: JSON.stringify(body.arguments ?? {})
						}));
					}
					if (endpoint === "read-resource") {
						const body = payload ?? {};
						return unwrap(await ns["read-resource"]({
							serverName: String(body.serverName ?? ""),
							uri: String(body.uri ?? "")
						}));
					}
					if (endpoint === "list-resources") {
						const body = payload ?? {};
						return unwrap(await ns["list-resources"]({ serverName: String(body.serverName ?? "") }));
					}
					throw new Error(`mcp-apps: unknown endpoint ${JSON.stringify(endpoint)}`);
				} };
				let disposeRows;
				const registerApps = () => {
					Promise.resolve(rpc.call("list", {})).then((list) => {
						const apps = list?.apps ?? [];
						console.info(`[dsh-mcp-apps] registering ${apps.length} App toolview(s): ${apps.map((app) => app.toolName).join(", ") || "(none)"}`);
						disposeRows?.();
						disposeRows = inner.slots.inject("tool.call.toolview", () => {
							const disposers = apps.map((app) => inner.slots.register({
								name: "tool.call.toolview",
								key: app.toolName,
								inject: () => ({ rpc })
							}, McpAppRow));
							return () => {
								for (const dispose of disposers) dispose();
							};
						});
					}).catch((error) => {
						console.warn("[dsh-mcp-apps] list failed:", error);
					});
				};
				registerApps();
				ctx.on?.("connection/reset", registerApps);
			});
			return async () => {
				try {
					await handle.dispose?.();
				} catch {}
				await disposeRemote();
			};
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map