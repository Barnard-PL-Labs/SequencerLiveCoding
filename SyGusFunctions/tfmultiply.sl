(set-logic ALL_SUPPORTED) 

(synth-fun loudnessPatternGen ((i Int)) Int
  ((I Int)) 
(  (I Int (i 0 1 2 3 4 5 6 
   (+ I I) (- I I) (* I I) (mod I I)
   ))
))
(synth-fun durationPatternGen ((i Int)) Int
  ((I Int)) 
(  (I Int (i 0 1 2 3 4 5 6 
   (+ I I) (- I I) (* I I) (mod I I)
   ))
))
(declare-var i Int)
; index, duration -> volume
; index - > volume
(constraint (= (loudnessPatternGen 1 ) 3)) 
(constraint (= (loudnessPatternGen 2 ) 5)) 
(constraint (= (loudnessPatternGen 3 ) 7)) 
(constraint (= (loudnessPatternGen 4 ) 9))
(constraint (= (loudnessPatternGen 5 ) 11))
(constraint (= (loudnessPatternGen 6 ) 13))
(constraint (= (loudnessPatternGen 7 ) 15))
(constraint (= (loudnessPatternGen 8 ) 17))
(constraint (= (loudnessPatternGen 9 ) 19))
(constraint (= (loudnessPatternGen 10 ) 21))
; index -> duration
(constraint (= (durationPatternGen 1 ) 5)) ; map the sound output to the same drum index 
(constraint (= (durationPatternGen 2 ) 10)) 
(constraint (= (durationPatternGen 3 ) 15)) 
(constraint (= (durationPatternGen 4 ) 20))
(constraint (= (durationPatternGen 5 ) 25))
(constraint (= (durationPatternGen 6 ) 30))
(constraint (= (durationPatternGen 7 ) 35))
(constraint (= (durationPatternGen 8 ) 40))
(constraint (= (durationPatternGen 9 ) 45))
(constraint (= (durationPatternGen 10 ) 50))

(check-synth)
