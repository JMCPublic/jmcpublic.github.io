/* Fictional a→z quizzes (17 Nov 2026). One quiz per fiction type a day, picked in turn from each list.
   Each clue: q = clue, a = answer, pos = which letter to take (counting letters only), ch = three wrong choices,
   alt = other accepted spellings when typed, b = [book, author] for the audiobook card, f = optional fact shown after.
   Popular Medium plays the Popular quiz without the choices on show. */
window.FICTIONAL_QUIZZES = {
popular: [
 { word: "POISON", hint: "Agatha's weapon of choice",
   end: "Christie worked in a hospital dispensary in both World Wars, which is why so many of her victims never see the final chapter.",
   clues: [
  { q: "The boy wizard's surname", a: "Potter", pos: 1, ch: ["Weasley", "Granger", "Malfoy"], b: ["Harry Potter and the Philosopher's Stone", "J.K. Rowling"], f: "Several publishers turned the first book down before Bloomsbury said yes." },
  { q: "Jane Eyre's brooding employer", a: "Rochester", pos: 2, ch: ["Heathcliff", "Darcy", "Rivers"], b: ["Jane Eyre", "Charlotte Brontë"], f: "Jane Eyre first came out under the pen name Currer Bell." },
  { q: "The Hunger Games heroine", a: "Katniss", pos: 5, ch: ["Tris", "Lyra", "Hermione"], b: ["The Hunger Games", "Suzanne Collins"], f: "She is named after an edible water plant." },
  { q: "Holmes's first name", a: "Sherlock", pos: 1, ch: ["Mycroft", "John", "Arthur"], b: ["The Adventures of Sherlock Holmes", "Arthur Conan Doyle"], f: "Conan Doyle killed Holmes off in 1893; readers were so upset he brought him back." },
  { q: "Diana Gabaldon's time-travel saga", a: "Outlander", pos: 1, ch: ["Rebecca", "Circe", "Dune"], b: ["Outlander", "Diana Gabaldon"] },
  { q: "Christie's Death on the ___", a: "Nile", pos: 1, ch: ["Thames", "Rhine", "Seine"], b: ["Death on the Nile", "Agatha Christie"], f: "Christie knew Egypt well and took a Nile cruise herself." }
 ]},
 { word: "ALIBI", hint: "Proof you were somewhere else",
   clues: [
  { q: "Christie's first name", a: "Agatha", pos: 1, ch: ["Alice", "Ada", "Anne"], b: ["Murder on the Orient Express", "Agatha Christie"] },
  { q: "Holmes's Scotland Yard inspector", a: "Lestrade", pos: 1, ch: ["Japp", "Morse", "Rebus"], b: ["The Hound of the Baskervilles", "Arthur Conan Doyle"] },
  { q: "Hercule's surname", a: "Poirot", pos: 3, ch: ["Maigret", "Clouseau", "Japp"], b: ["The Murder of Roger Ackroyd", "Agatha Christie"] },
  { q: "The Hound of the ___", a: "Baskervilles", pos: 1, ch: ["Moors", "Night", "Dartmoor"], b: ["The Hound of the Baskervilles", "Arthur Conan Doyle"] },
  { q: "Rebus's creator, first name", a: "Ian", pos: 1, ch: ["Val", "Lee", "Peter"], b: ["Knots and Crosses", "Ian Rankin"] }
 ]},
 { word: "MOTIVE", hint: "The why behind the whodunnit",
   clues: [
  { q: "Christie's village spinster sleuth, Miss ___", a: "Marple", pos: 1, ch: ["Lemon", "Silver", "Climpson"], b: ["A Murder Is Announced", "Agatha Christie"] },
  { q: "Murder on the ___ Express", a: "Orient", pos: 1, ch: ["Midnight", "Polar", "Highland"], b: ["Murder on the Orient Express", "Agatha Christie"] },
  { q: "Holmes's loyal sidekick", a: "Watson", pos: 3, ch: ["Hastings", "Lestrade", "Hudson"], b: ["The Adventures of Sherlock Holmes", "Arthur Conan Doyle"] },
  { q: "Stephen King's killer-clown novel", a: "It", pos: 1, ch: ["Carrie", "Misery", "Christine"], b: ["It", "Stephen King"] },
  { q: "Colleen Hoover's thriller about a writer's hidden manuscript", a: "Verity", pos: 1, ch: ["Confess", "Ugly Love", "November 9"], b: ["Verity", "Colleen Hoover"] },
  { q: "Gail Honeyman's heroine who is \"completely fine\"", a: "Eleanor", pos: 1, ch: ["Edith", "Emily", "Esther"], b: ["Eleanor Oliphant Is Completely Fine", "Gail Honeyman"] }
 ]},
 { word: "HEIST", hint: "A big job, Ocean's Eleven style",
   clues: [
  { q: "Harry's school", a: "Hogwarts", pos: 1, ch: ["Durmstrang", "Beauxbatons", "Malory Towers"], b: ["Harry Potter and the Philosopher's Stone", "J.K. Rowling"] },
  { q: "Jane's surname in Charlotte Brontë's novel", a: "Eyre", pos: 1, ch: ["Bennet", "Price", "Grey"], b: ["Jane Eyre", "Charlotte Brontë"] },
  { q: "Dan Brown's The Da ___ Code", a: "Vinci", pos: 2, ch: ["Silva", "Costa", "Medici"], b: ["The Da Vinci Code", "Dan Brown"] },
  { q: "Alex Michaelides' The ___ Patient", a: "Silent", pos: 1, ch: ["Secret", "Quiet", "Last"], b: ["The Silent Patient", "Alex Michaelides"] },
  { q: "Stevenson's ___ Island", a: "Treasure", pos: 1, ch: ["Coral", "Skull", "Mystery"], b: ["Treasure Island", "Robert Louis Stevenson"] }
 ]},
 { word: "DETECTIVE", hint: "Poirot, Holmes or Marple, for instance",
   clues: [
  { q: "Bram Stoker's count", a: "Dracula", pos: 1, ch: ["Orlok", "Fosco", "Monte Cristo"], b: ["Dracula", "Bram Stoker"] },
  { q: "The Count of Monte Cristo's hero, ___ Dantès", a: "Edmond", pos: 1, ch: ["Albert", "Fernand", "Henri"], b: ["The Count of Monte Cristo", "Alexandre Dumas"] },
  { q: "Richard Osman's ___ Murder Club", a: "Thursday", pos: 1, ch: ["Monday", "Friday", "Sunday"], b: ["The Thursday Murder Club", "Richard Osman"] },
  { q: "Jane ___, Charlotte Brontë's heroine", a: "Eyre", pos: 1, ch: ["Bennet", "Grey", "Price"], b: ["Jane Eyre", "Charlotte Brontë"] },
  { q: "Dan Brown's The Da Vinci ___", a: "Code", pos: 1, ch: ["Key", "Cipher", "Secret"], b: ["The Da Vinci Code", "Dan Brown"] },
  { q: "Stevenson's ___ Island", a: "Treasure", pos: 1, ch: ["Coral", "Skull", "Mystery"], b: ["Treasure Island", "Robert Louis Stevenson"] },
  { q: "Stephen King's killer-clown novel", a: "It", pos: 1, ch: ["Carrie", "Misery", "Christine"], b: ["It", "Stephen King"] },
  { q: "Colleen Hoover's thriller about a writer's hidden manuscript", a: "Verity", pos: 1, ch: ["Confess", "Ugly Love", "November 9"], b: ["Verity", "Colleen Hoover"] },
  { q: "Murder on the Orient ___", a: "Express", pos: 1, ch: ["Line", "Railway", "Night"], b: ["Murder on the Orient Express", "Agatha Christie"] }
 ]}
],
easy: [
 { word: "NOVEL", hint: "What Dickens wrote by the yard",
   clues: [
  { q: "The pig who takes over Animal Farm", a: "Napoleon", pos: 1, ch: ["Snowball", "Squealer", "Boxer"], b: ["Animal Farm", "George Orwell"] },
  { q: "Dickens's orphan who asked for more", a: "Oliver", pos: 1, ch: ["David", "Pip", "Nicholas"], b: ["Oliver Twist", "Charles Dickens"] },
  { q: "Thackeray's ___ Fair", a: "Vanity", pos: 1, ch: ["Country", "Summer", "Bartholomew"], b: ["Vanity Fair", "William Makepeace Thackeray"] },
  { q: "Austen's matchmaking heroine", a: "Emma", pos: 1, ch: ["Elizabeth", "Anne", "Fanny"], b: ["Emma", "Jane Austen"] },
  { q: "Shakespeare's king with three daughters", a: "Lear", pos: 1, ch: ["Duncan", "Henry", "Richard"], b: ["King Lear", "William Shakespeare"] }
 ]},
 { word: "QUILL", hint: "An old writer's tool",
   clues: [
  { q: "Don ___, Cervantes's knight", a: "Quixote", pos: 1, ch: ["Juan", "Carlos", "Pedro"], b: ["Don Quixote", "Miguel de Cervantes"] },
  { q: "Thomas More's ideal island", a: "Utopia", pos: 1, ch: ["Atlantis", "Avalon", "Arcadia"], b: ["Utopia", "Thomas More"] },
  { q: "Homer's Trojan War epic", a: "Iliad", pos: 1, ch: ["Odyssey", "Aeneid", "Oresteia"], b: ["The Iliad", "Homer"] },
  { q: "Nabokov's notorious novel", a: "Lolita", pos: 1, ch: ["Pnin", "Ada", "Despair"], b: ["Lolita", "Vladimir Nabokov"] },
  { q: "Tolstoy's first name", a: "Leo", pos: 1, ch: ["Ivan", "Fyodor", "Anton"], b: ["War and Peace", "Leo Tolstoy"] }
 ]},
 { word: "SHELF", hint: "Where finished books go",
   clues: [
  { q: "Frankenstein's author, Mary ___", a: "Shelley", pos: 1, ch: ["Austen", "Gaskell", "Brontë"], b: ["Frankenstein", "Mary Shelley"] },
  { q: "Shakespeare's Danish prince", a: "Hamlet", pos: 1, ch: ["Macbeth", "Othello", "Romeo"], b: ["Hamlet", "William Shakespeare"] },
  { q: "Middlemarch's author, George ___", a: "Eliot", pos: 1, ch: ["Orwell", "Gissing", "Meredith"], b: ["Middlemarch", "George Eliot"] },
  { q: "Golding's ___ of the Flies", a: "Lord", pos: 1, ch: ["King", "Island", "Swarm"], b: ["Lord of the Flies", "William Golding"] },
  { q: "The Great Gatsby's author", a: "Fitzgerald", pos: 1, ch: ["Hemingway", "Faulkner", "Steinbeck"], b: ["The Great Gatsby", "F. Scott Fitzgerald"] }
 ]},
 { word: "CLASSIC", hint: "What every book on this list is",
   clues: [
  { q: "Jane Eyre's author's first name", a: "Charlotte", pos: 1, ch: ["Emily", "Anne", "Jane"], b: ["Jane Eyre", "Charlotte Brontë"] },
  { q: "Shakespeare's king with three daughters", a: "Lear", pos: 1, ch: ["Duncan", "Henry", "Richard"], b: ["King Lear", "William Shakespeare"] },
  { q: "Tolstoy's tragic Karenina", a: "Anna", pos: 1, ch: ["Natasha", "Sonya", "Kitty"], b: ["Anna Karenina", "Leo Tolstoy"] },
  { q: "Tom ___, Huck Finn's friend", a: "Sawyer", pos: 1, ch: ["Thumb", "Jones", "Brown"], b: ["Adventures of Huckleberry Finn", "Mark Twain"] },
  { q: "Don Quixote's squire, ___ Panza", a: "Sancho", pos: 1, ch: ["Pedro", "Juan", "Diego"], b: ["Don Quixote", "Miguel de Cervantes"] },
  { q: "Ralph Ellison's ___ Man", a: "Invisible", pos: 1, ch: ["Thin", "Iron", "Hollow"], b: ["Invisible Man", "Ralph Ellison"] },
  { q: "Voltaire's naïve hero", a: "Candide", pos: 1, ch: ["Pangloss", "Zadig", "Emile"], b: ["Candide", "Voltaire"] }
 ]}
],
medium: [
 { word: "PROSE", hint: "Not poetry",
   clues: [
  { q: "Great Expectations' young hero", a: "Pip", pos: 1, ch: ["Joe", "Herbert", "Magwitch"], b: ["Great Expectations", "Charles Dickens"] },
  { q: "Crime and Punishment's axe murderer", a: "Raskolnikov", pos: 1, ch: ["Svidrigailov", "Razumikhin", "Porfiry"], b: ["Crime and Punishment", "Fyodor Dostoevsky"] },
  { q: "Shakespeare's Moor of Venice", a: "Othello", pos: 1, ch: ["Shylock", "Iago", "Antonio"], b: ["Othello", "William Shakespeare"] },
  { q: "Tom ___, Huck Finn's friend", a: "Sawyer", pos: 1, ch: ["Thumb", "Jones", "Brown"], b: ["Adventures of Huckleberry Finn", "Mark Twain"] },
  { q: "Madame Bovary's first name", a: "Emma", pos: 1, ch: ["Claire", "Rose", "Marie"], b: ["Madame Bovary", "Gustave Flaubert"] }
 ]},
 { word: "STANZA", hint: "A verse of a poem",
   clues: [
  { q: "Kafka's insect hero's surname", a: "Samsa", pos: 1, ch: ["Klamm", "Rossmann", "Bürstner"], b: ["The Metamorphosis", "Franz Kafka"] },
  { q: "Tess's author's first name", a: "Thomas", pos: 1, ch: ["Henry", "George", "William"], b: ["Tess of the d'Urbervilles", "Thomas Hardy"] },
  { q: "Holden ___, The Catcher in the Rye", a: "Caulfield", pos: 2, ch: ["Carraway", "Finch", "Pilgrim"], b: ["The Catcher in the Rye", "J.D. Salinger"] },
  { q: "Quasimodo's cathedral, ___-Dame", a: "Notre", pos: 1, ch: ["Sainte", "Grande", "Belle"], b: ["The Hunchback of Notre-Dame", "Victor Hugo"] },
  { q: "Pasternak's doctor", a: "Zhivago", pos: 1, ch: ["Faustus", "Jekyll", "Moreau"], b: ["Doctor Zhivago", "Boris Pasternak"] },
  { q: "Moby-Dick's obsessed captain", a: "Ahab", pos: 1, ch: ["Nemo", "Hook", "Flint"], b: ["Moby-Dick", "Herman Melville"] }
 ]},
 { word: "SATIRE", hint: "Swift's speciality",
   clues: [
  { q: "Don Quixote's squire, ___ Panza", a: "Sancho", pos: 1, ch: ["Pedro", "Juan", "Diego"], b: ["Don Quixote", "Miguel de Cervantes"] },
  { q: "Persuasion's heroine, ___ Elliot", a: "Anne", pos: 1, ch: ["Emma", "Elinor", "Fanny"], b: ["Persuasion", "Jane Austen"] },
  { q: "Shakespeare's island play, The ___", a: "Tempest", pos: 1, ch: ["Storm", "Shipwreck", "Island"], b: ["The Tempest", "William Shakespeare"] },
  { q: "Ralph Ellison's ___ Man", a: "Invisible", pos: 1, ch: ["Thin", "Iron", "Hollow"], b: ["Invisible Man", "Ralph Ellison"] },
  { q: "Juliet's lover", a: "Romeo", pos: 1, ch: ["Paris", "Tybalt", "Mercutio"], b: ["Romeo and Juliet", "William Shakespeare"] },
  { q: "Wilde's The Importance of Being ___", a: "Earnest", pos: 1, ch: ["Honest", "Idle", "Frank"], b: ["The Importance of Being Earnest", "Oscar Wilde"] }
 ]},
 { word: "NARRATOR", hint: "Nick Carraway or Ishmael, for example",
   clues: [
  { q: "Quasimodo's cathedral, ___-Dame", a: "Notre", pos: 1, ch: ["Sainte", "Grande", "Belle"], b: ["The Hunchback of Notre-Dame", "Victor Hugo"] },
  { q: "Moby-Dick's obsessed captain", a: "Ahab", pos: 1, ch: ["Nemo", "Hook", "Flint"], b: ["Moby-Dick", "Herman Melville"] },
  { q: "Juliet's lover", a: "Romeo", pos: 1, ch: ["Paris", "Tybalt", "Mercutio"], b: ["Romeo and Juliet", "William Shakespeare"] },
  { q: "Crime and Punishment's axe murderer", a: "Raskolnikov", pos: 1, ch: ["Svidrigailov", "Razumikhin", "Porfiry"], b: ["Crime and Punishment", "Fyodor Dostoevsky"] },
  { q: "Persuasion's heroine, ___ Elliot", a: "Anne", pos: 1, ch: ["Emma", "Elinor", "Fanny"], b: ["Persuasion", "Jane Austen"] },
  { q: "Hardy's milkmaid heroine", a: "Tess", pos: 1, ch: ["Bathsheba", "Eustacia", "Sue"], b: ["Tess of the d'Urbervilles", "Thomas Hardy"] },
  { q: "Shakespeare's Moor of Venice", a: "Othello", pos: 1, ch: ["Shylock", "Iago", "Antonio"], b: ["Othello", "William Shakespeare"] },
  { q: "Jane Eyre's brooding employer", a: "Rochester", pos: 1, ch: ["Heathcliff", "Darcy", "Rivers"], b: ["Jane Eyre", "Charlotte Brontë"] }
 ]}
],
difficult: [
 { word: "CANTO", hint: "A section of Dante's Comedy",
   clues: [
  { q: "Voltaire's naïve hero", a: "Candide", pos: 1, ch: ["Pangloss", "Zadig", "Emile"], b: ["Candide", "Voltaire"] },
  { q: "Gatsby's narrator, Nick ___", a: "Carraway", pos: 2, ch: ["Buchanan", "Wilson", "Baker"], b: ["The Great Gatsby", "F. Scott Fitzgerald"] },
  { q: "War and Peace heroine, ___ Rostova", a: "Natasha", pos: 1, ch: ["Sonya", "Marya", "Hélène"], b: ["War and Peace", "Leo Tolstoy"] },
  { q: "Dorian Gray's corrupter, Lord Henry ___", a: "Wotton", pos: 3, ch: ["Hallward", "Vane", "Darlington"], b: ["The Picture of Dorian Gray", "Oscar Wilde"] },
  { q: "The Greek hero Joyce's Ulysses is named after, in Greek", a: "Odysseus", pos: 1, ch: ["Achilles", "Ajax", "Hector"], b: ["Ulysses", "James Joyce"] }
 ]},
 { word: "ELEGY", hint: "Gray wrote one in a country churchyard",
   clues: [
  { q: "Mr Darcy's estate", a: "Pemberley", pos: 2, ch: ["Netherfield", "Longbourn", "Rosings"], b: ["Pride and Prejudice", "Jane Austen"] },
  { q: "Middlemarch's ambitious young doctor, Tertius ___", a: "Lydgate", pos: 1, ch: ["Casaubon", "Ladislaw", "Bulstrode"], b: ["Middlemarch", "George Eliot"] },
  { q: "Gregor Samsa's sister", a: "Grete", pos: 3, ch: ["Anna", "Klara", "Liesl"], b: ["The Metamorphosis", "Franz Kafka"] },
  { q: "Pip's blacksmith brother-in-law, Joe ___", a: "Gargery", pos: 1, ch: ["Pocket", "Jaggers", "Wemmick"], b: ["Great Expectations", "Charles Dickens"] },
  { q: "Hamlet's jester, known only as a skull", a: "Yorick", pos: 1, ch: ["Feste", "Touchstone", "Osric"], b: ["Hamlet", "William Shakespeare"] }
 ]},
 { word: "SONNET", hint: "Fourteen lines",
   clues: [
  { q: "Moby-Dick's first mate", a: "Starbuck", pos: 1, ch: ["Stubb", "Flask", "Queequeg"], b: ["Moby-Dick", "Herman Melville"] },
  { q: "Raskolnikov's detective pursuer", a: "Porfiry", pos: 2, ch: ["Razumikhin", "Luzhin", "Zossimov"], b: ["Crime and Punishment", "Fyodor Dostoevsky"] },
  { q: "Gatsby's narrator's first name", a: "Nick", pos: 1, ch: ["Tom", "Jay", "George"], b: ["The Great Gatsby", "F. Scott Fitzgerald"] },
  { q: "Elizabeth's family surname in Pride and Prejudice", a: "Bennet", pos: 3, ch: ["Darcy", "Bingley", "Lucas"], b: ["Pride and Prejudice", "Jane Austen"] },
  { q: "Wuthering Heights: Catherine's maiden name", a: "Earnshaw", pos: 1, ch: ["Linton", "Heathcliff", "Lockwood"], b: ["Wuthering Heights", "Emily Brontë"] },
  { q: "Miss Havisham's cold-hearted ward", a: "Estella", pos: 3, ch: ["Biddy", "Clara", "Molly"], b: ["Great Expectations", "Charles Dickens"] }
 ]}
],
world: [
 { word: "EPIC", hint: "Gilgamesh, or the Mahabharata",
   clues: [
  { q: "Shūsaku ___, author of Silence", a: "Endo", pos: 1, ch: ["Mishima", "Abe", "Oe"], alt: ["endou"], b: ["Silence", "Shūsaku Endō"] },
  { q: "Juan Rulfo's ___ Páramo", a: "Pedro", pos: 1, ch: ["Juan", "Diego", "Pablo"], b: ["Pedro Páramo", "Juan Rulfo"] },
  { q: "Sōseki's novel narrated by a cat: \"___ Am a Cat\"", a: "I", pos: 1, ch: ["We", "Here", "So"], b: ["I Am a Cat", "Natsume Sōseki"] },
  { q: "Naguib Mahfouz's ___ Trilogy", a: "Cairo", pos: 1, ch: ["Alexandria", "Nile", "Desert"], b: ["The Cairo Trilogy", "Naguib Mahfouz"] }
 ]},
 { word: "HAIKU", hint: "Bashō's art form",
   clues: [
  { q: "Korea's Robin Hood, ___ Gildong", a: "Hong", pos: 1, ch: ["Kim", "Park", "Lee"], b: ["The Story of Hong Gildong", "Heo Gyun"] },
  { q: "Author of Things Fall Apart", a: "Achebe", pos: 1, ch: ["Soyinka", "Okri", "Ngũgĩ"], b: ["Things Fall Apart", "Chinua Achebe"] },
  { q: "Tagore's prize-winning poetry collection", a: "Gitanjali", pos: 2, ch: ["Shakuntala", "Panchatantra", "Gulistan"], b: ["Gitanjali", "Rabindranath Tagore"] },
  { q: "Author of Shakuntala", a: "Kalidasa", pos: 1, ch: ["Valmiki", "Tagore", "Vyasa"], b: ["Shakuntala", "Kalidasa"] },
  { q: "Author of Norwegian Wood", a: "Murakami", pos: 2, ch: ["Kawabata", "Mishima", "Ishiguro"], b: ["Norwegian Wood", "Haruki Murakami"] }
 ]},
 { word: "FABLE", hint: "The Panchatantra is full of them",
   clues: [
  { q: "Author of the Shahnameh", a: "Ferdowsi", pos: 1, ch: ["Rumi", "Hafez", "Saadi"], alt: ["firdausi", "firdowsi"], b: ["Shahnameh", "Ferdowsi"] },
  { q: "Author of Americanah", a: "Adichie", pos: 1, ch: ["Achebe", "Okri", "Soyinka"], b: ["Americanah", "Chimamanda Ngozi Adichie"] },
  { q: "Author of Ficciones", a: "Borges", pos: 1, ch: ["Cortázar", "Neruda", "Bolaño"], b: ["Ficciones", "Jorge Luis Borges"] },
  { q: "Tang poet usually paired with Du Fu", a: "Li Bai", pos: 1, ch: ["Wang Wei", "Bai Juyi", "Su Shi"], alt: ["li po", "libai", "lipo"], b: ["Selected Poems", "Li Bai"] },
  { q: "Author of The Name of the Rose", a: "Eco", pos: 1, ch: ["Calvino", "Levi", "Moravia"], b: ["The Name of the Rose", "Umberto Eco"] }
 ]}
]
};
