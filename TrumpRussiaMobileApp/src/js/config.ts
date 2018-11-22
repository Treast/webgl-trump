export const CONFIG = {
  SERVER: process.env.SERVER,
  ENVELOPES: [
    {
      id: '01',
      title: 'Ingérence russe dès 2016',
      source: 'Wikipédia',
      content: `La CIA déclare que la communauté du renseignement a conclu que la Russie a mené des opérations pendant
       l'élection de 2016 pour aider Donald Trump à remporter la présidence. Plusieurs agences de renseignement
        américaines ont conclu que des personnes ayant des liens directs avec le Kremlin avaient fourni à WikiLeaks
         les courriels piratés provenant du Comité national démocrate et de sources comme John Podesta, le directeur
          de campagne de Hillary Clinton.`,
      url: `https://fr.wikipedia.org/wiki/Accusations_d%27ing%C3%A9rences_russes_dans_
      l%27%C3%A9lection_pr%C3%A9sidentielle_am%C3%A9ricaine_de_2016`,
    },
    {
      id: '02',
      title: 'Rupture entre Trump et les renseignements américains',
      source: 'New York Times, 10/12/2016',
      content: `Une rupture extraordinaire est apparue entre le président élu Donald J. Trump et les responsables de la
       sécurité nationale. M. Trump se moquait des déclarations des services de renseignement américains selon lesquelles
        la Russie s'était ingérée pour le compte de l'élection et des républicains haut placés vouant des enquêtes sur
         les activités du Kremlin. Samedi, des responsables des services de renseignements ont déclaré que ce ne serait
          que la semaine après les élections que le parti C.I.A. modifié son évaluation officielle des activités de la
           Russie pour conclure que le gouvernement du président Vladimir Poutine ne cherchait pas seulement à saper les
            élections, mais avait également agi pour donner un avantage à un candidat.`,
      url: 'https://www.nytimes.com/2016/12/10/us/politics/trump-mocking-claim-that-russia-hacked-election-at-odds-with-gop.html',
    },
    {
      id: '03',
      title: '13 Russes inculpés aux Etats-Unis',
      source: 'Libération, 17/02/2018',
      content: `La justice américaine a mis la Russie et le Kremlin sur la sellette vendredi en inculpant 13 Russes, dont
       un proche de Vladimir Poutine, pour avoir favorisé la candidature de Donald Trump à l’élection présidentielle de
        2016. Moscou a aussitôt qualifié d'«absurde» cet acte d’accusation qui ne mentionne toutefois aucune connivence
         entre l’équipe de campagne du candidat républicain et le gouvernement russe. «La campagne Trump n’a rien fait
          d’illégal - pas de collusion», a pour sa part réaffirmé le président américain dans un tweet.`,
      url: 'https://www.liberation.fr/planete/2018/02/17/ingerence-electorale-13-russes-inculpes-aux-etats-unis-pour-complot_1630432',
    },
    {
      id: '04',
      title: '12 officiers russes arretés',
      source: 'New York Times, 13/07/2018',
      content: `Le conseil spécial enquêtant sur l’ingérence russe de l’élection américaine de 2016 confirme l’arrestation
       de 12 officiers du renseignement russe pour le piratage du Comité national démocrate et la campagne présidentielle
        d’Hillary Clinton. Les arrestations ont eu lieu seulement trois jours avant la rencontre du Président Trump avec
         le Président Vladimir Poutine à Helsinki, Finlande.`,
      url: 'https://www.nytimes.com/2018/07/13/us/politics/mueller-indictment-russian-intelligence-hacking.html',
    },
    {
      id: '05',
      title: 'Une avocate accusée de reignenements',
      source: 'Independent, 27/04/2018',
      content: `L’avocate russe qui a assisté à une réunion controversée avec des membres de la campagne Trump
       s’appellerait elle-même «informatrice» et en communication avec le procureur général de Russie.
        L'avocate Natalia Veselnitskaya était l'une des huit personnes présentes à la réunion de la Trump
         Tower de juin 2016, organisée après qu'un intermédiaire eut promis de donner à Donald Trump Jr des
          informations compromettantes sur la rivale de son père, Hillary Clinton. Mme Veselnitskaya a précédemment
           affirmé qu'elle agissait de manière indépendante lors de la réunion avec les responsables de la campagne Trump.
            Mais ses récents commentaires suggèrent qu'elle aurait pu être plus impliquée dans le gouvernement russe
             qu'elle ne l'a laissé entendre.`,
      url: `https://www.independent.co.uk/news/world/americas/us-politics/russian-lawyer-informant-trump-tower-meeting-
      natalia-veselnitskaya-a8326456.html`,
    },
  ],
  SOUNDS: [
    'DTMF_0.wav',
    'DTMF_1.wav',
    'DTMF_2.wav',
    'DTMF_3.wav',
    'DTMF_4.wav',
    'DTMF_5.wav',
    'DTMF_6.wav',
    'DTMF_7.wav',
    'DTMF_8.wav',
    'DTMF_9.wav',
    'DTMF_Et.wav',
    'DTMF_Di.wav',
  ],
};
