import re, json, wave, sys
from pocketsphinx import Decoder

raw = open('/home/claude/great-whites-prehistoric-oceans/source/script.txt').read()
lines = [l.strip() for l in raw.split('\n') if l.strip()]
# drop title, subtitle, chapter headings
skip = re.compile(r'(Million Years Ago$|^Would Great Whites|^Present Prehistoric)')
paras = [l for l in lines if not skip.search(l)]
rep = [("370 million","three hundred seventy million"),("2023","twenty twenty three"),("four-and-a-half-meter","four and a half meter"),
("120 million","one hundred twenty million"),("80 and 90","eighty and ninety"),("40°C — 104°F","forty degrees celsius one hundred four degrees fahrenheit"),
("5 million","five million"),("100 million","one hundred million"),("12 meters","twelve meters"),("65 million","sixty five million"),
("30 million","thirty million"),("50 million","fifty million"),("15 to 18","fifteen to eighteen"),("33 million","thirty three million"),
("16 meters","sixteen meters"),("3.6 million","three point six million")]
def norm(p):
    for a,b in rep: p=p.replace(a,b)
    p = p.replace('’',"'").replace('—',' ').replace('-',' ')
    p = re.sub(r"[^A-Za-z' ]"," ",p).lower()
    return p.split()
words=[]; para_idx=[]
for i,p in enumerate(paras):
    w=norm(p); words+=w; para_idx+=[i]*len(w)
extra = {
 'dunkleosteus':'D AH NG K L IY AA S T IY AH S','pliosaurus':'P L AY AH S AO R AH S','pliosaurs':'P L AY AH S AO R Z',
 'ichthyosaur':'IH K TH IY AH S AO R','ichthyosaurs':'IH K TH IY AH S AO R Z','plesiosaurs':'P L IY S IY AH S AO R Z','plesiosaur':'P L IY S IY AH S AO R',
 'cretoxyrhina':'K R IY T AA K S IH R AY N AH','tylosaurus':'T AY L AH S AO R AH S','mosasaur':'M OW Z AH S AO R','mosasaurs':'M OW Z AH S AO R Z',
 'dorudon':'D AO R UW D AA N','basilosaurus':'B AE S AH L OW S AO R AH S','megalodon':'M EH G AH L AH D AA N','megalodon\'s':'M EH G AH L AH D AA N Z',
 'shallows':'SH AE L OW Z','tethys':'T IY TH IH S','devonian':'D IH V OW N IY AH N','triassic':'T R AY AE S IH K','jurassic':'JH UH R AE S IH K','cretaceous':'K R IH T EY SH AH S',
 'eocene':'IY AH S IY N','pliocene':'P L AY AH S IY N','celsius':'S EH L S IY AH S','fahrenheit':'F EH R AH N HH AY T',
}
d = Decoder(samprate=16000, bestpath=False, loglevel='ERROR')
oov=set()
for w in set(words):
    if d.lookup_word(w) is None:
        if w in extra: d.add_word(w, extra[w], True)
        elif w.endswith("'s") and d.lookup_word(w[:-2]): d.add_word(w, d.lookup_word(w[:-2])+' Z', True)
        else: oov.add(w)
print('OOV:',oov, file=sys.stderr)
words=[w for w in words if w not in oov] if oov else words
json.dump({'paras':paras},open('paras.json','w'),indent=1)
d.set_align_text(' '.join(words))
wv=wave.open('vo16.wav','rb'); data=wv.readframes(wv.getnframes())
d.start_utt(); d.process_raw(data, full_utt=True); d.end_utt()
segs=[(s.word,s.start_frame/100.0,(s.end_frame+1)/100.0) for s in d.seg()]
json.dump(segs,open('words.json','w'))
print(len(segs), segs[:10], segs[-5:])
