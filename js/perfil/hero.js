Bolao.events.on(

    "perfil:changed",

    ({ participante, dados }) => {

        Bolao.perfil.hero.render(

            participante,

            dados

        );

    }

);
