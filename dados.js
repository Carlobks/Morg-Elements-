document.documentElement.classList.add('js');
const EL = {
  fogo:{cor:'var(--fogo)'}, ar:{cor:'var(--ar)'}, agua:{cor:'var(--agua)'}, terra:{cor:'var(--terra)'}
};
const slug = n => n.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const subCor = s => `var(--s-${slug(s.nome)})`;
/* Ícones (viewBox 0 0 32 32, traço na cor do subtipo) */
const ICO = {
 'Faísca':'<path class="tw" d="M10 4v8M6 8h8"/><path class="tw" d="M23 9v6M20 12h6"/><path class="tw" d="M15 19v9M10.5 23.5h9"/>',
 'Fogo':'<path class="fl" d="M16 3c1 5 8 8 8 16a8 8 0 0 1-16 0c0-4 2-6.5 3.5-8.5 1 3 2 4.5 3.5 4.5-1-4 0-9 1-12z"/>',
 'Brasa':'<circle class="gl" cx="16" cy="20" r="6.5" fill="currentColor" fill-opacity=".55"/><path d="M7 27h18"/><path class="gl" style="animation-delay:1.2s" d="M13 11c1.5-2 0-3.5 1-6M19 12c1.5-2 0-3 1-5"/>',
 'Vento':'<path class="dash" d="M3 11h17a4 4 0 1 0-4-4"/><path class="dash" d="M3 17h25"/><path class="dash" d="M3 23h14a4 4 0 1 1-4 4"/>',
 'Ar':'<path class="spin" d="M16 6a10 10 0 1 1-9.5 13M16 11a5 5 0 1 1-4.7 6.7"/>',
 'Brisa':'<path class="sway" d="M4 13c4-3 8-3 12 0s8 3 12 0"/><path class="sway" style="animation-delay:-1.7s" d="M7 20c3-2 6-2 9 0s6 2 9 0"/>',
 'Vapor':'<path class="rise" d="M10 25c-2-3 2-5 0-8s2-5 0-8"/><path class="rise" d="M16 25c-2-3 2-5 0-8s2-5 0-8"/><path class="rise" d="M22 25c-2-3 2-5 0-8s2-5 0-8"/><path d="M6 28h20"/>',
 'Água':'<path class="bob" d="M16 4c4 6 8 10 8 15a8 8 0 0 1-16 0c0-5 4-9 8-15z"/>',
 'Gelo':'<g class="spin slow"><path d="M16 4v24M5.6 10l20.8 12M5.6 22l20.8-12"/><path d="M13 6.5l3 3 3-3M13 25.5l3-3 3 3"/></g>',
 'Argila':'<path class="squish" d="M6 25c0-6 4-12 10-12s10 6 10 12z"/><path d="M4 27h24"/>',
 'Terra':'<path d="M3 26c4-9 8-13 13-13s9 4 13 13z"/><path class="gl" d="M10 22h12M13 18h6"/><path class="sway" d="M16 13V6m0 3c2-2 4-2.5 4-2.5"/>',
 'Pedra':'<path d="M5 25l3-12 8-7 10 5 1 14z"/><path class="shine" d="M8 13l8 3 10-5M16 16v9"/>'
};
const icon = s => `<svg class="ico" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[s.nome]}</svg>`;
const r = n => `<sup class="r"><a href="#ref${n}">${n}</a></sup>`;

const T = [
 {id:'sanguineo', nome:'Sanguíneo', el:'ar', elNome:'Ar', eixos:['Expansivo','Não marcado'], humor:'Sangue', quali:'Quente e úmido', est:'Primavera', oposto:'Melancólico',
  resumo:'Vive o presente. É tocado com facilidade e intensidade, mas as impressões passam rápido. Abre-se ao mundo e não guarda por muito tempo o que sentiu.',
  age:['Puxa conversa com desconhecidos e anima o ambiente.','Promete com sinceridade no momento e pode esquecer depois.','Fica chateado e, uma hora depois, já passou.','Começa projetos com entusiasmo e se cansa quando viram rotina.'],
  forcas:'Otimismo, sociabilidade, perdão fácil, criatividade.', atencao:'Inconstância, superficialidade, dificuldade de concluir.',
  fontes:`Temperamento do sentimento para Kant${r(7)}; fraco e rápido para Wundt${r(8)}; corpo astral predominante para Steiner${r(9)}.`,
  subs:[
   {nome:'Brisa', viz:'fleumatico', vizNome:'Fleumático', vizEl:'agua', desc:'Sanguíneo suavizado. Gentil, conciliador, alegre sem barulho.', busca:'A calma e a constância do fleumático.', base:'Continua precisando de gente e de movimento. Se se acomodar demais, a leveza vira dispersão.'},
   {nome:'Ar', desc:'O sanguíneo puro: leve, comunicativo, curioso e sempre em movimento.'},
   {nome:'Vento', viz:'colerico', vizNome:'Colérico', vizEl:'fogo', desc:'Sanguíneo com direção e força. Lidera pelo carisma e mobiliza pessoas.', busca:'A determinação e a capacidade de realizar do colérico.', base:'Sua força é a alegria, não o domínio. Quando quer se impor, atropela os outros e perde o que tem de melhor.'}
  ]},
 {id:'colerico', nome:'Colérico', el:'fogo', elNome:'Fogo', eixos:['Expansivo','Marcado'], humor:'Bile amarela', quali:'Quente e seco', est:'Verão', oposto:'Fleumático',
  resumo:'Vive para agir. Sente com força e reage rápido. Vai para fora e é atingido com intensidade pelo que encontra.',
  age:['Assume o comando quando ninguém decide.','Fala direto, às vezes de forma dura.','Irrita-se com lentidão e incompetência.','Define uma meta e faz o que for preciso para alcançá-la.'],
  forcas:'Liderança, coragem, iniciativa, praticidade.', atencao:'Impaciência, ira, orgulho, pouca escuta.',
  fontes:`Temperamento da atividade, que se inflama depressa, para Kant${r(7)}; forte e rápido para Wundt${r(8)}; o eu predominante para Steiner${r(9)}.`,
  subs:[
   {nome:'Faísca', viz:'sanguineo', vizNome:'Sanguíneo', vizEl:'ar', desc:'Colérico mais leve e rápido. Inflama os outros com entusiasmo; é persuasivo e espontâneo.', busca:'A leveza e a simpatia do sanguíneo.', base:'Seu valor está em concluir. Sem a vontade firme, vira fogo de palha: começa tudo e termina pouco.'},
   {nome:'Fogo', desc:'O colérico puro: decidido, prático, intenso e voltado para o resultado.'},
   {nome:'Brasa', viz:'melancolico', vizNome:'Melancólico', vizEl:'terra', desc:'Fogo contido e duradouro. Planeja, aprofunda e exige qualidade.', busca:'A profundidade e o rigor do melancólico.', base:'Nasceu para agir. Se ficar só planejando e remoendo, o calor vira ressentimento guardado.'}
  ]},
 {id:'melancolico', nome:'Melancólico', el:'terra', elNome:'Terra', eixos:['Não expansivo','Marcado'], humor:'Bile negra', quali:'Frio e seco', est:'Outono', oposto:'Sanguíneo',
  resumo:'Vive para dentro. As impressões demoram a entrar e, quando entram, ficam. Reflete muito e guarda por muito tempo o que sente.',
  age:['Pensa antes de falar e repassa as conversas depois.','Vê primeiro os riscos e os problemas de um plano.','Demora a confiar, mas quando confia é para sempre.','Busca perfeição e sentido no que faz e sofre quando não encontra.'],
  forcas:'Profundidade, sensibilidade, fidelidade, senso de detalhe e de beleza.', atencao:'Pessimismo, autocrítica excessiva, retraimento, rancor.',
  fontes:`Temperamento do sentimento, que leva tudo a sério, para Kant${r(7)}; forte e lento para Wundt${r(8)}; ligado a pessoas de destaque nos <i>Problemas</i>${r(4)}; corpo físico predominante para Steiner${r(9)}.`,
  subs:[
   {nome:'Pedra', viz:'colerico', vizNome:'Colérico', vizEl:'fogo', desc:'Firme, exigente e persistente. Transforma reflexão em ação.', busca:'A força de decisão do colérico.', base:'A sensibilidade é o seu centro. Endurecido demais, fica frio, crítico e inflexível.'},
   {nome:'Terra', desc:'O melancólico puro: profundo, reflexivo, fiel e idealista.'},
   {nome:'Argila', viz:'fleumatico', vizNome:'Fleumático', vizEl:'agua', desc:'Moldável, gentil e pacífico.', busca:'A paz e a leveza do fleumático: não carregar tudo tão a fundo.', base:'Continua sendo um melancólico: sente fundo e guarda o que sente. Fingir indiferença só empurra a tristeza para baixo. Precisa dar nome ao que sente.'}
  ]},
 {id:'fleumatico', nome:'Fleumático', el:'agua', elNome:'Água', eixos:['Não expansivo','Não marcado'], humor:'Fleuma', quali:'Frio e úmido', est:'Inverno', oposto:'Colérico',
  resumo:'Vive em equilíbrio. Demora a se mover, mas é constante. Não se impõe e não se abala com facilidade.',
  age:['Mantém a calma quando todos se agitam.','Ouve mais do que fala e solta comentários de humor seco.','Evita conflitos e cede para manter a paz.','Adia decisões e resiste em silêncio quando pressionado.'],
  forcas:'Paciência, estabilidade, diplomacia, confiabilidade.', atencao:'Indolência, indecisão, teimosia passiva, falta de entusiasmo.',
  fontes:`Temperamento da atividade, lento para se mover mas persistente, para Kant${r(7)}; fraco e lento para Wundt${r(8)}; corpo etérico predominante para Steiner${r(9)}.`,
  subs:[
   {nome:'Gelo', viz:'melancolico', vizNome:'Melancólico', vizEl:'terra', desc:'Mais rígido do que o fleumático costuma ser. Reservado, metódico e teimoso.', busca:'A ordem e a profundidade do melancólico.', base:'Sua natureza é fluir. Congelado, fecha-se e fica frio com os outros.'},
   {nome:'Água', desc:'O fleumático puro: sereno, paciente e adaptável.'},
   {nome:'Vapor', viz:'sanguineo', vizNome:'Sanguíneo', vizEl:'ar', desc:'Calma que se expande. Mais sociável, bem-humorado e leve.', busca:'A expansão e a alegria do sanguíneo.', base:'Sua força é a estabilidade. Espalhado demais, evapora e some das responsabilidades.'}
  ]}
];

/* Subtipos aprofundados: hipótese do projeto, sem fonte primária.
   tc/te = versões curtas de conflito/exagero para a tabela comparativa. */
const SUB = {
 'Brisa':{
  imagem:'Ar úmido de fim de tarde. Não derruba nada, só refresca quem passa.',
  tracos:'Alegre sem fazer barulho. Ouve mais do que o sanguíneo comum e tem paciência para a conversa do outro. Gosta de gente, mas de pouca gente por vez.',
  trabalho:'Vai bem onde é preciso acolher: atendimento, ensino de crianças, ou ser a pessoa que todos procuram quando o clima da equipe azeda. Rende menos com prazo apertado e cobrança dura.',
  relacoes:'É fácil conviver com a brisa. Cede, faz rir e deixa o outro à vontade. O risco é dizer sim para não desagradar e depois sumir do compromisso.',
  conflito:'Foge. Troca de assunto, faz uma piada, promete pensar. O problema fica sem solução e volta mais tarde.',
  tc:'Desvia com humor e promessas.',
  busca:'A calma e a constância do fleumático. Quer conseguir ficar num lugar e terminar o que começou sem precisar de estímulo novo a cada hora.',
  exagero:'Acomodada, perde o que tinha de vivo. Fica sem rumo, deixa as coisas pela metade e chama isso de leveza.',
  te:'Dispersa e acomodada.',
  base:'Continua precisando de gente e de movimento. A calma que ela procura serve de descanso; se tentar morar nela, apaga.',
  equilibrio:'Uma rotina curta e fixa, com espaço para encontros. Terminar uma coisa pequena antes de abrir a próxima.'},
 'Ar':{
  imagem:'Ar em movimento livre. Está em toda parte e ninguém consegue segurar.',
  tracos:'Curioso e falante. Repara em tudo e esquece rápido. Vive no agora e conta a própria vida como uma sequência de histórias boas.',
  trabalho:'Brilha nos começos: vender uma ideia, abrir um evento, apresentar pessoas umas às outras. Rotina longa e trabalho solitário o desgastam.',
  relacoes:'Faz amigos com facilidade e perdoa logo. Às vezes esquece aniversários e promessas, sem maldade nenhuma.',
  conflito:'Fala o que pensa na hora, às vezes alto, e esquece em uma hora. Estranha quando o outro ainda está magoado no dia seguinte.',
  tc:'Reage na hora e esquece logo.',
  exagero:'Fica superficial. Muda de plano, de turma e de opinião conforme o dia e não aprofunda nada.',
  te:'Superficial e inconstante.',
  equilibrio:'Poucos compromissos, todos à vista. Um amigo fleumático por perto ajuda mais do que muito conselho.'},
 'Vento':{
  imagem:'Ar aquecido que ganha direção. Empurra barcos e espalha sementes.',
  tracos:'Carismático e ambicioso. Junta pessoas em torno de uma ideia e quer vê-la acontecer. Pensa rápido e decide rindo.',
  trabalho:'Lidera equipes, vende, organiza mutirões. É ótimo para tirar um projeto do papel e precisa de alguém que cuide dos detalhes depois.',
  relacoes:'Contagia, mas ocupa espaço. Os amigos se divertem com ele e às vezes se cansam de seguir os planos dele.',
  conflito:'Enfrenta e tenta convencer. Quando não consegue, aumenta o tom. Para ele passa rápido; para o outro, nem sempre.',
  tc:'Enfrenta e tenta convencer.',
  busca:'A determinação do colérico e a capacidade de levar uma coisa até o fim.',
  exagero:'Vira ventania. Atropela quem pensa diferente, manda em vez de animar e se irrita quando ninguém o segue.',
  te:'Atropela e manda.',
  base:'A força dele é a alegria. Quando tenta se impor pelo domínio, perde o que tem de melhor.',
  equilibrio:'Perguntar antes de decidir pelos outros. Medir o sucesso também pelo estado de quem foi junto.'},
 'Faísca':{
  imagem:'A centelha que pula do fogo e acende o que estiver perto.',
  tracos:'Entusiasmado e persuasivo. Tem a vontade do colérico com a simpatia do sanguíneo. Começa rápido e espera que todos acompanhem.',
  trabalho:'Lança projetos, convence clientes, puxa a equipe no início. Perde o fôlego quando a tarefa fica repetitiva.',
  relacoes:'Divertido e intenso. Provoca, desafia, esquenta a conversa. Quem convive com ele aprende que a irritação passa em minutos.',
  conflito:'Estoura e logo depois quer fazer as pazes. Às vezes se surpreende porque o outro ainda está ferido.',
  tc:'Estoura e logo quer fazer as pazes.',
  busca:'A leveza e a simpatia do sanguíneo. Ser querido, e não apenas respeitado.',
  exagero:'Fogo de palha. Abre dez frentes, termina duas e culpa os outros pelo resto.',
  te:'Abre muitas frentes e termina poucas.',
  base:'O valor dele está em concluir. Sem a vontade firme do fogo, começa tudo e termina pouco.',
  equilibrio:'Uma meta por vez, levada até o fim antes de anunciar a próxima.'},
 'Fogo':{
  imagem:'Chama firme que transforma o que toca. Aquece e queima com a mesma força.',
  tracos:'Decidido e prático. Sabe o que quer e não gosta de esperar. Assume a responsabilidade sem que ninguém peça.',
  trabalho:'Comanda, resolve crises, abre caminho onde os outros desistiram. Sofre com burocracia e com reunião que não decide nada.',
  relacoes:'Leal e protetor com os seus. Pode parecer duro, porque diz a verdade sem enfeite e espera receber o mesmo.',
  conflito:'Enfrenta de frente e quer ganhar. Quase nunca recua no calor da hora. Quando admite o erro, é mais tarde.',
  tc:'Enfrenta de frente e quer ganhar.',
  exagero:'Ira e orgulho. Passa por cima de pessoas para cumprir a meta e confunde teimosia com coragem.',
  te:'Ira e orgulho.',
  equilibrio:'Ouvir até o fim antes de responder. Usar a força para proteger quem está perto.'},
 'Brasa':{
  imagem:'Carvão em brasa: quase sem chama, mas quente por horas.',
  tracos:'Intenso por dentro e contido por fora. Pensa muito antes de agir e, quando age, vai fundo. Exige qualidade de si e dos outros.',
  trabalho:'Planeja e cuida de projetos longos e difíceis. Vai bem em áreas que pedem rigor e persistência, como pesquisa, engenharia ou cirurgia.',
  relacoes:'Fala pouco do que sente e lembra de tudo. Muito fiel, e demora a perdoar.',
  conflito:'Não explode na hora. Guarda, analisa e volta ao assunto dias depois, com os argumentos prontos.',
  tc:'Guarda e volta ao assunto depois.',
  busca:'A profundidade e o rigor do melancólico.',
  exagero:'Ressentimento. Rumina ofensas e trava diante da própria exigência.',
  te:'Remói e guarda rancor.',
  base:'Nasceu para agir. Se ficar só planejando e remoendo, o calor vira ressentimento guardado.',
  equilibrio:'Pôr o plano em prática antes de ficar perfeito. Falar da raiva enquanto ela ainda é pequena.'},
 'Pedra':{
  imagem:'Rocha endurecida pelo calor. Não cede, e é sobre ela que se constrói.',
  tracos:'Firme e persistente. Reflete como melancólico e decide como colérico. Quando sabe o que é certo, não abre mão.',
  trabalho:'Qualidade, auditoria, direito, qualquer lugar onde alguém precisa sustentar um padrão. Termina o que começa.',
  relacoes:'Muito confiável e difícil de agradar. Mostra afeto mais por atos do que por palavras.',
  conflito:'Argumenta com lógica e não cede. Fica frio e cortante quando acha que tem razão.',
  tc:'Argumenta e não cede.',
  busca:'A força de decisão do colérico.',
  exagero:'Fica duro. Critica tudo e cobra dos outros uma perfeição que nem ele alcança.',
  te:'Crítico e inflexível.',
  base:'A sensibilidade é o centro dele. Endurecido demais, fica frio, crítico e inflexível.',
  equilibrio:'Deixar a sensibilidade aparecer. Elogiar em voz alta o que está bom, além de apontar o que falta.'},
 'Terra':{
  imagem:'Solo fundo e fértil. Guarda as sementes e devolve com o tempo.',
  tracos:'Profundo e idealista. Sente com intensidade e demora a esquecer. Tem olho para o detalhe e para a beleza.',
  trabalho:'Arte, pesquisa, escrita, trabalho de precisão. Rende muito quando está sozinho e tem tempo. Sofre com pressa e improviso.',
  relacoes:'Poucos amigos, para a vida toda. Precisa de tempo para confiar e se magoa com descuidos que os outros nem percebem.',
  conflito:'Recolhe-se. Sofre calado, repassa a cena muitas vezes e pode guardar a ferida por anos.',
  tc:'Recolhe-se e sofre calado.',
  exagero:'Pessimismo e autocrítica sem fim. Só vê o que falta e se isola.',
  te:'Pessimista e isolado.',
  equilibrio:'Contar a alguém o que sente antes que vire peso. Aceitar o bom o bastante de vez em quando.'},
 'Argila':{
  imagem:'Terra molhada. Aceita a forma que lhe dão e, depois de seca, a guarda.',
  tracos:'Gentil e pacífica. Sente fundo como o melancólico, mas evita mostrar. Prefere ceder a brigar.',
  trabalho:'Cuidado, apoio, artesanato, funções de bastidor que pedem paciência e atenção. Trabalha bem numa equipe calma.',
  relacoes:'Doce e disponível. Adapta-se ao outro com tanta facilidade que às vezes ninguém sabe o que ela quer de verdade.',
  conflito:'Cede para manter a paz e guarda a mágoa por dentro. Mais tarde a tristeza aparece sem motivo aparente.',
  tc:'Cede e guarda a mágoa.',
  busca:'A paz e a leveza do fleumático: não carregar tudo tão a fundo.',
  exagero:'Some dentro dos outros. Finge indiferença, acumula tristeza e perde a própria forma.',
  te:'Finge indiferença e acumula tristeza.',
  base:'Continua sendo melancólica: sente fundo e guarda o que sente. Fingir indiferença só empurra a tristeza para baixo.',
  equilibrio:'Dar nome ao que sente e dizer em voz alta. Ter um canto só seu, com as próprias escolhas.'},
 'Gelo':{
  imagem:'Água parada que o frio endureceu. Clara, firme e escorregadia.',
  tracos:'Reservado e metódico. Tem a calma do fleumático com a ordem do melancólico. Segue as regras e espera que os outros sigam também.',
  trabalho:'Contabilidade, arquivo, programação, manutenção: tarefas que pedem precisão e repetição sem drama.',
  relacoes:'Distante no começo. Quem passa da superfície encontra alguém leal e constante, de poucas palavras.',
  conflito:'Fecha-se e não muda de posição. Resiste em silêncio, às vezes por semanas.',
  tc:'Fecha-se e resiste em silêncio.',
  busca:'A ordem e a profundidade do melancólico.',
  exagero:'Congela. Fica frio com as pessoas, rígido com a rotina e perdido diante do imprevisto.',
  te:'Frio e rígido.',
  base:'A natureza dele é fluir. Congelado, fecha-se e fica frio com os outros.',
  equilibrio:'Aceitar pequenas mudanças de propósito. Perguntar pelas pessoas, e não só pelas tarefas.'},
 'Água':{
  imagem:'Lago calmo. Reflete o que está em volta e contorna os obstáculos.',
  tracos:'Sereno e paciente. Observa muito e fala pouco. Tem humor seco e uma calma que acalma os outros.',
  trabalho:'Mediação, suporte, serviços que pedem constância. Mantém a cabeça fria nas crises e precisa de alguém que o tire da inércia.',
  relacoes:'Fácil de conviver, raramente se irrita. Pode parecer indiferente quando só está esperando a vez de falar.',
  conflito:'Evita. Cede e adia. Se pressionado, resiste em silêncio, com uma teimosia que pouca gente espera.',
  tc:'Evita e adia.',
  exagero:'Indolência. Deixa tudo para depois e se acomoda onde está, mesmo quando está mal.',
  te:'Acomodado e indeciso.',
  equilibrio:'Metas pequenas com prazo. Dizer o que pensa na reunião em vez de concordar depois.'},
 'Vapor':{
  imagem:'Água aquecida que sobe e se espalha. Leve e difícil de agarrar.',
  tracos:'Bem-humorado e sociável. Tem a paz do fleumático e uma vontade nova de estar com gente.',
  trabalho:'Relação com clientes, recepção, trabalho em grupo sem tensão. Deixa o ambiente mais leve sem perder a calma.',
  relacoes:'Companhia agradável e sem cobranças. Às vezes desaparece quando a amizade pede esforço.',
  conflito:'Faz uma piada e muda de assunto. Evita o atrito ainda mais do que a água.',
  tc:'Faz piada e muda de assunto.',
  busca:'A expansão e a alegria do sanguíneo.',
  exagero:'Evapora. Promete e não aparece, espalha-se em muitas companhias sem se comprometer com nenhuma.',
  te:'Some das responsabilidades.',
  base:'A força dele é a estabilidade. Espalhado demais, evapora e some das responsabilidades.',
  equilibrio:'Um compromisso fixo por semana, aconteça o que acontecer. Voltar ao silêncio de vez em quando.'}
};
T.forEach(t=>t.subs.forEach(s=>Object.assign(s,SUB[s.nome])));

const REFS = [
 ['EMPÉDOCLES. Fragmento 31 B6. In: DIELS, H.; KRANZ, W. (ed.). <i>Die Fragmente der Vorsokratiker</i>. 6. ed. Berlin: Weidmann, 1951. v. 1.','As quatro raízes','no','Não conferida'],
 ['HIPÓCRATES (Corpus Hippocraticum). <i>Da natureza do homem</i>, cap. 4 e 7. In: <i>Hippocrates</i>, v. IV. Ed. e trad. W. H. S. Jones. Loeb Classical Library 150. Cambridge, MA: Harvard University Press, 1931.','Os quatro humores e as estações','part','Edição localizada; passagens não conferidas'],
 ['ARISTÓTELES. <i>Da geração e da corrupção</i>, II.3–4, 330a30–331b4 (Bekker).','Qualidades dos elementos; vizinhos e ciclo','ok','Conferida por busca'],
 ['ARISTÓTELES (atrib.). <i>Problemas</i>, XXX.1, 953a10 ss.','Melancolia e pessoas de destaque','no','Não conferida'],
 ['GALENO. <i>De temperamentis</i>, livro I. In: KÜHN, C. G. (ed.). <i>Claudii Galeni opera omnia</i>. Leipzig: Cnobloch, 1821. v. I, p. 509–694.','Nove misturas; humores e qualidades','no','Não conferida'],
 ['GALENO. <i>Quod animi mores corporis temperamenta sequantur</i>. In: KÜHN, C. G. (ed.). <i>Claudii Galeni opera omnia</i>. Leipzig: Cnobloch, 1822. v. IV, p. 767–822.','A alma segue o temperamento do corpo','no','Não conferida'],
 ['KANT, I. <i>Anthropologie in pragmatischer Hinsicht</i> (1798), "Vom Temperament". In: <i>Kants gesammelte Schriften</i> (Akademie-Ausgabe), v. VII. Berlin: Reimer, 1907. p. 286–291.','Sentimento × atividade; opostos; recusa de compostos','part','Divisão conferida por busca; trecho sobre compostos pendente'],
 ['WUNDT, W. <i>Grundriss der Psychologie</i>. Leipzig: Engelmann, 1896. Seção sobre os afetos e os temperamentos. Trad. ingl.: <i>Outlines of Psychology</i>, trad. C. H. Judd, 1897.','Força × velocidade das emoções','no','Não conferida; parágrafo a confirmar'],
 ['STEINER, R. <i>Die vier Temperamente</i>. Conferência, Berlim, 4 mar. 1909. In: <i>Wo und wie findet man den Geist?</i> (GA 57).','Membro predominante em cada temperamento','part','Parcialmente conferida por busca'],
 ['HOCK, C. <i>Die vier Temperamente</i>. 5. ed. Trad. ingl.: <i>The Four Temperaments</i>. Milwaukee: Bruce, 1934.','Temperamento e autoconhecimento','part','Edição conferida em catálogo; conteúdo pendente'],
 ['LAHAYE, T. <i>Spirit-Controlled Temperament</i>. Wheaton, IL: Tyndale House, 1966.','Temperamento primário e secundário','no','Não conferida'],
 ['EYSENCK, H. J. <i>The Biological Basis of Personality</i>. Springfield, IL: Charles C. Thomas, 1967.','Extroversão × estabilidade emocional','no','Não conferida']
];

/* ---------- Cards ---------- */
const cols = document.getElementById('cols');
const subId = (t,s) => `${t.id}-${slug(s.nome)}`;
T.forEach(t=>{
  const c = EL[t.el].cor;
  const subs = t.subs.map(s=>{
    const sc = subCor(s);
    const rows = [['Traços',s.tracos],['No trabalho',s.trabalho],['Nas relações',s.relacoes],['No conflito',s.conflito],
      ['Busca',s.busca],['Quando exagera',s.exagero],['Lembrar da base',s.base],['Equilíbrio',s.equilibrio]].filter(x=>x[1]);
    return `<details class="sub" id="${subId(t,s)}" style="--sc:${sc}">
      <summary><span class="sh"><span class="nm">${icon(s)}<strong>${s.nome}</strong></span><small>${s.viz ? 'perto do '+s.vizNome : 'neutro, no centro'}</small></span>
      <span class="img">${s.imagem}</span></summary>
      <dl>${rows.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    </details>`;
  }).join('');
  const cmp = `<table class="mini"><thead><tr><th scope="col">Subtipo</th><th scope="col">No conflito</th><th scope="col">Quando exagera</th></tr></thead><tbody>${
    t.subs.map(s=>`<tr><th scope="row">${s.nome}</th><td>${s.tc}</td><td>${s.te}</td></tr>`).join('')}</tbody></table>`;
  cols.insertAdjacentHTML('beforeend', `<article class="card" id="${t.id}" style="--c:${c}">
    <canvas class="fx" data-el="${t.el}" aria-hidden="true"></canvas>
    <div class="top">
      <div class="ttl"><h3>${t.nome}</h3><div class="el">${t.elNome}</div></div>
      <div class="chips">${t.eixos.map(e=>`<span>${e}</span>`).join('')}</div>
    </div>
    <div class="body">
      <p>${t.resumo}</p>
      <details class="more"><summary>Mais sobre o ${t.nome}</summary><div class="morein">
        <div class="fa"><b>Qualidades</b><span>${t.quali}${r(3)}</span><b>Estação</b><span>${t.est}${r(2)}</span></div>
        <div><h4>Como costuma agir</h4><ul>${t.age.map(a=>`<li>${a}</li>`).join('')}</ul></div>
        <div class="fa"><b>Forças</b><span>${t.forcas}</span><b>Atenção</b><span>${t.atencao}</span></div>
        <p class="src">${t.fontes}</p>
        <div><h4>Os três lado a lado</h4>${cmp}</div>
        <p class="opp">Oposto na diagonal: <b>${t.oposto}</b>. Não há subtipo nessa direção.</p>
      </div></details>
      <div><h4 class="subh">Subtipos</h4><p class="src hint1" style="margin-top:4px">Toque num subtipo para abrir. Hipótese do projeto, sem fonte.</p><div class="subs" style="margin-top:8px">${subs}</div></div>
    </div>
  </article>`);
});

/* ---------- References ---------- */
document.getElementById('refs').innerHTML = REFS.map((x,i)=>
  `<li id="ref${i+1}"><span class="n">${i+1}</span><span>${x[0]}<span class="use">Uso: ${x[1]}</span><span class="pill ${x[2]}">${x[3]}</span></span></li>`).join('');

