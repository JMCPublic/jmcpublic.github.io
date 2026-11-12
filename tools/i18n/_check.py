#!/usr/bin/env python3
"""Check a language file against the German one: same number of strings, and every ${...}, <tag>, quote and
backtick in the right place. python3 tools/i18n/_check.py tr"""
import importlib, re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
de = importlib.import_module('de')

def shape(s):
    return (sorted(re.findall(r'\$\{[^}]*\}', s)), re.findall(r'</?[a-z0-9]+', s), s[:1] if s[:1] in '\'"`<>/' else '',
            s[-1:] if s[-1:] in '\'"`<>/' else '', s.count('`'))

def check(lang):
    T = importlib.import_module(lang)
    bad = 0
    keys = [e for e, _ in de.UI]
    mine = dict(T.UI)
    for i, (e, d) in enumerate(de.UI):
        if e not in mine: print(f'  missing {i}: {e[:70]}'); bad += 1; continue
        if shape(mine[e]) != shape(d):
            print(f'  shape {i}: {e[:60]}\n     de: {d[:110]}\n     {lang}: {mine[e][:110]}'); bad += 1
    for k in ('LM', 'AP'):
        if hasattr(T, k):
            ref = getattr(de, k)
            miss = set(ref) - set(getattr(T, k))
            if miss: print(f'  {k} missing: {sorted(miss)}'); bad += 1
            for name, v in getattr(T, k).items():
                ans = v[-1]
                if any(a != a.lower() or ' ' in a for a in ans): print(f'  {k} answer not lowercase single words: {name} {ans}'); bad += 1
    for k in ('LM_OTD', 'AP_OTD'):
        if hasattr(T, k):
            miss = set(getattr(de, k)) - set(getattr(T, k))
            if miss: print(f'  {k} missing days: {sorted(miss)}'); bad += 1
    for k in ('LM_Q', 'AP_Q'):
        if hasattr(T, k):
            for part in ('open', 'close', 'star'):
                if len(getattr(T, k)[part]) != len(getattr(de, k)[part]): print(f'  {k}.{part} count differs'); bad += 1
    print(lang, 'OK' if not bad else f'{bad} problems')

for l in sys.argv[1:]: check(l)
