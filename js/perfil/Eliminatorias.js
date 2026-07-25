Bolao.events.on(

    "perfil:changed",

    ({ participante, dados }) => {

        Bolao.perfil.eliminatorias.render(

            participante,

            dados

        );

    }

);
